#!/usr/bin/env node
/**
 * Audit the actual prerendered pages after `npm run build`, or a running site.
 *
 * node scripts/check-product-seo.mjs
 * node scripts/check-product-seo.mjs --base-url https://www.macronhealthcare.com --report output/product-seo-live.json
 *
 * This checks discoverability and faithful product information. It does not
 * predict rankings or claim eligibility for shopping/product rich results.
 */
import { readFile, stat, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const options = new Map();
for (let index = 2; index < process.argv.length; index += 2) {
  const key = process.argv[index];
  const value = process.argv[index + 1];
  if (!["--base-url", "--report"].includes(key) || !value) {
    throw new Error("Usage: node scripts/check-product-seo.mjs [--base-url URL] [--report PATH]");
  }
  options.set(key, value);
}
const baseUrl = options.get("--base-url");
const canonicalOrigin = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.macronhealthcare.com").replace(/\/$/, "");
const source = await readFile(path.join(root, "data/products.ts"), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { products } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);

const failures = [];
let assertions = 0;
let visualAidPagesAudited = 0;
const records = [];
function check(condition, route, message) {
  assertions += 1;
  if (!condition) failures.push({ route, message });
}
const normalise = (value) => String(value ?? "").replace(/\s+/g, " ").trim();
const brandKey = (value) => String(value ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");
function decode(value = "") {
  return value.replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (match, entity) => {
    if (entity[0] === "#") {
      const hex = entity[1].toLowerCase() === "x";
      return String.fromCodePoint(Number.parseInt(entity.slice(hex ? 2 : 1), hex ? 16 : 10));
    }
    return { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " }[entity.toLowerCase()] ?? match;
  });
}
function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)]
    .map((match) => [match[1].toLowerCase(), decode(match[2] ?? match[3] ?? match[4])]));
}
function textOnly(html) {
  return normalise(decode(html
    .replace(/<(script|style|template)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]*>/g, " ")));
}
function parseHtml(html, route) {
  const withoutScripts = html.replace(/<(script|style|template)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, " ");
  const metas = [...withoutScripts.matchAll(/<meta\b[^>]*>/gi)].map(([tag]) => attributes(tag));
  const links = [...withoutScripts.matchAll(/<link\b[^>]*>/gi)].map(([tag]) => attributes(tag));
  const titles = [...withoutScripts.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi)].map((match) => textOnly(match[1]));
  const json = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
    .filter((match) => attributes(match[1]).type === "application/ld+json")
    .flatMap((match) => {
      try { return [JSON.parse(match[2])]; }
      catch (error) { check(false, route, `Invalid JSON-LD: ${error.message}`); return []; }
    });
  const nodes = [];
  function collect(value) {
    if (!value || typeof value !== "object") return;
    if (value["@type"]) nodes.push(value);
    Object.values(value).forEach((child) => {
      if (Array.isArray(child)) child.forEach(collect);
      else if (child && typeof child === "object") collect(child);
    });
  }
  json.forEach(collect);
  return {
    titles,
    title: titles[0] ?? "",
    meta: (key) => metas.filter((item) => item.name === key || item.property === key).map((item) => item.content ?? ""),
    canonicals: links.filter((item) => item.rel === "canonical").map((item) => item.href),
    h1s: [...withoutScripts.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((match) => textOnly(match[1])),
    text: textOnly(withoutScripts),
    anchors: [...withoutScripts.matchAll(/<a\b[^>]*>/gi)].map(([tag]) => attributes(tag).href).filter(Boolean),
    images: [...withoutScripts.matchAll(/<img\b[^>]*>/gi)].map(([tag]) => attributes(tag)),
    nodes,
  };
}
const hasType = (node, type) => [node?.["@type"]].flat().includes(type);
const ref = (value) => typeof value === "string" ? value : value?.["@id"];
const asArray = (value) => value === undefined ? [] : [value].flat();
const absolute = (route) => new URL(route, `${canonicalOrigin}/`).href;
const hrefPath = (href) => new URL(href, `${canonicalOrigin}/`).pathname.replace(/\/$/, "");

async function getPage(route) {
  if (baseUrl) {
    const response = await fetch(new URL(route, baseUrl), {
      redirect: "manual",
      signal: AbortSignal.timeout(30000),
      headers: { "User-Agent": "Macron-SEO-Verification/1.0" },
    });
    check(response.status === 200, route, `HTTP ${response.status}; expected a direct 200 response`);
    check(!/\b(noindex|none)\b/i.test(response.headers.get("x-robots-tag") ?? ""), route, "HTTP X-Robots-Tag blocks indexing");
    if (route !== "/sitemap.xml" && route !== "/robots.txt") {
      check(/text\/html/i.test(response.headers.get("content-type") ?? ""), route, "Response is not HTML");
    }
    return response.text();
  }
  const filename = route === "/" ? "index.html"
    : /\.(xml|txt)$/.test(route) ? `${route.slice(1)}.body` : `${route.slice(1)}.html`;
  return readFile(path.join(root, ".next/server/app", filename), "utf8");
}

function auditBasics(page, route, canonical) {
  check(page.titles.length === 1, route, "Expected one document title");
  check(page.meta("description").length === 1, route, "Expected one meta description");
  check(page.canonicals.length === 1 && page.canonicals[0] === canonical, route, `Canonical must be ${canonical}`);
  check(!page.meta("robots").concat(page.meta("googlebot")).some((content) => /\b(noindex|none)\b/i.test(content)), route, "Robots metadata blocks indexing");
  check(!page.nodes.some((node) => hasType(node, "Product")), route, "Ineligible Product rich-result markup is present without authentic offers or reviews");
  for (const node of page.nodes) {
    for (const invented of ["offers", "review", "aggregateRating", "manufacturer", "gtin", "gtin8", "gtin12", "gtin13", "gtin14"]) {
      check(!(invented in node), route, `Unverified ${invented} field is present in JSON-LD`);
    }
  }
}

async function auditProduct(product) {
  const route = `/product-portfolio/${product.slug}`;
  const url = absolute(route);
  try {
    const page = parseHtml(await getPage(route), route);
    auditBasics(page, route, url);
    const description = page.meta("description")[0] ?? "";
    check(page.title.includes(product.brandName), route, "Title omits the product brand");
    check(/Macron Health\s*Care/i.test(page.title), route, "Title omits Macron Health Care");
    check(description.includes(product.brandName), route, "Description omits the product brand");
    check(!/\.\.\.|…/.test(description), route, "Description contains an artificially truncated fragment");
    check(page.h1s.length === 1 && page.h1s[0].includes(product.brandName), route, "Expected one visible H1 identifying this product");
    check(page.text.includes(product.dosageForm), route, "Dosage form is missing from server-rendered content");
    for (const ingredient of product.composition.split(/\s+\+\s+/)) {
      check(page.text.includes(normalise(ingredient)), route, `Composition ingredient missing from rendered text: ${ingredient}`);
    }
    check(page.text.includes("Macron Health Care") && /marketed by/i.test(page.text), route, "The product's marketer is not visibly identified");

    const entities = page.nodes.filter((node) => hasType(node, "Thing") && node.url === url);
    check(entities.length === 1, route, "Expected one informational Thing entity for the canonical product URL");
    const entity = entities[0] ?? {};
    check(String(entity.name ?? "").includes(product.brandName), route, "Structured product name does not match the brand");
    check(entity.description?.includes(product.composition), route, "Structured description must preserve the full composition");
    const webPage = page.nodes.find((node) => hasType(node, "WebPage") && node.url === url);
    check(Boolean(webPage), route, "Missing canonical WebPage entity");
    check(Boolean(entity["@id"]) && asArray(webPage?.mainEntity).some((item) => ref(item) === entity["@id"]), route, "WebPage is not linked to its informational product entity");
    const compositionParts = asArray(webPage?.hasPart).map((part) =>
      hasType(part, "WebPageElement") ? part : page.nodes.find((node) => node["@id"] === ref(part) && hasType(node, "WebPageElement")),
    ).filter(Boolean);
    check(compositionParts.some((part) => /^composition$/i.test(part.name ?? "") && part.text === product.composition), route, "WebPage composition text differs from approved source data");
    const organization = page.nodes.find((node) => hasType(node, "Organization") && node["@id"] === ref(webPage?.publisher));
    check(Boolean(organization) && /Macron Health\s*Care/i.test(organization.name ?? ""), route, "WebPage publisher is not linked to the Macron organization");
    const breadcrumb = page.nodes.find((node) => hasType(node, "BreadcrumbList") && asArray(node.itemListElement).some((item) => ref(item.item) === url || item.item === url));
    check(Boolean(breadcrumb), route, "Missing breadcrumb to the canonical product page");

    const imageUrls = asArray(entity.image).map((item) => typeof item === "string" ? item : item?.url ?? item?.contentUrl);
    for (const photo of product.productImages ?? []) {
      const photoUrl = absolute(photo.src);
      check(imageUrls.includes(photoUrl), route, `Structured data omits supplied product photo ${photo.src}`);
      check(page.meta("og:image").includes(photoUrl), route, `Social metadata omits supplied product photo ${photo.src}`);
      const exists = await stat(path.join(root, "public", photo.src)).then((item) => item.isFile()).catch(() => false);
      check(exists, route, `Product photo file does not exist: ${photo.src}`);
    }
    if (product.productImages?.length) {
      check(page.images.some((image) => brandKey(image.alt).includes(brandKey(product.brandName))), route, "Product imagery lacks a descriptive brand alt attribute");
    }
    check(page.meta("og:url")[0] === url, route, "Open Graph URL differs from the canonical product URL");
    check(page.anchors.some((href) => hrefPath(href) === `/doctor-presentation/${product.slug}`), route, "Missing crawlable link to the product visual aid");
    records.push({ slug: product.slug, brandName: product.brandName, title: page.title, description, canonical: page.canonicals[0], imageCount: imageUrls.length });

    const visualRoute = `/doctor-presentation/${product.slug}`;
    const visualPage = parseHtml(await getPage(visualRoute), visualRoute);
    visualAidPagesAudited += 1;
    auditBasics(visualPage, visualRoute, url);
    check(visualPage.anchors.some((href) => hrefPath(href) === route), visualRoute, "Missing crawlable link to the canonical product page");
  } catch (error) {
    check(false, route, error.message);
  }
}

// Keep a live-site audit gentle: no more than four requests in flight.
let nextIndex = 0;
await Promise.all(Array.from({ length: Math.min(4, products.length) }, async () => {
  while (nextIndex < products.length) {
    const index = nextIndex++;
    await auditProduct(products[index]);
  }
}));
records.sort((first, second) => first.slug.localeCompare(second.slug));
check(records.length === products.length, "/product-portfolio", `Audited ${records.length} of ${products.length} products`);
for (const field of ["title", "description", "canonical"]) {
  const seen = new Map();
  for (const record of records) {
    check(Boolean(record[field]), record.slug, `Missing ${field}`);
    check(!seen.has(record[field]), record.slug, `Duplicate ${field} shared with ${seen.get(record[field])}`);
    seen.set(record[field], record.slug);
  }
}

for (const [route, detailPrefix] of [["/product-portfolio", "/product-portfolio/"], ["/doctor-presentation", "/doctor-presentation/"]]) {
  try {
    const page = parseHtml(await getPage(route), route);
    auditBasics(page, route, absolute(route));
    const linked = new Set(page.anchors.map(hrefPath));
    for (const product of products) {
      check(linked.has(`${detailPrefix}${product.slug}`), route, `No server-rendered link for ${product.slug}; catalogue must be discoverable without running JavaScript`);
    }
  } catch (error) { check(false, route, error.message); }
}

try {
  const sitemap = await getPage("/sitemap.xml");
  // Do not mistake image:loc values for page URLs.
  const locations = [...sitemap.matchAll(/<loc>([\s\S]*?)<\/loc>/g)].map((match) => decode(match[1]));
  check(new Set(locations).size === locations.length, "/sitemap.xml", "Duplicate sitemap URLs");
  for (const product of products) {
    check(locations.includes(absolute(`/product-portfolio/${product.slug}`)), "/sitemap.xml", `Canonical product ${product.slug} missing from sitemap`);
    check(!locations.includes(absolute(`/doctor-presentation/${product.slug}`)), "/sitemap.xml", `Duplicate visual-aid URL for ${product.slug} is included despite its product canonical`);
  }
  check(!locations.some((location) => hrefPath(location) === "/basket"), "/sitemap.xml", "Private presentation basket should not be in sitemap");
} catch (error) { check(false, "/sitemap.xml", error.message); }

try {
  const robots = await getPage("/robots.txt");
  check(robots.includes(absolute("/sitemap.xml")), "/robots.txt", "robots.txt does not advertise the canonical sitemap");
  const groups = [];
  let group;
  let startedRules = false;
  for (const rawLine of robots.split(/\r?\n/)) {
    const line = rawLine.split("#")[0].trim();
    const match = line.match(/^(user-agent|allow|disallow):\s*(.*)$/i);
    if (!match) continue;
    const key = match[1].toLowerCase();
    if (key === "user-agent") {
      if (!group || startedRules) {
        group = { agents: [], rules: [] };
        groups.push(group);
      }
      group.agents.push(match[2].toLowerCase());
      startedRules = false;
    } else if (group) {
      group.rules.push({ allow: key === "allow", path: match[2] });
      startedRules = true;
    }
  }
  const specific = groups.filter((item) => item.agents.includes("googlebot"));
  const applicable = specific.length ? specific : groups.filter((item) => item.agents.includes("*"));
  for (const product of products) {
    const route = `/product-portfolio/${product.slug}`;
    const matching = applicable.flatMap((item) => item.rules).filter((rule) => {
      if (!rule.path) return false;
      const end = rule.path.endsWith("$");
      const pattern = rule.path.replace(/\$$/, "").split("*").map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join(".*");
      return new RegExp(`^${pattern}${end ? "$" : ""}`).test(route);
    }).sort((first, second) => second.path.length - first.path.length || Number(second.allow) - Number(first.allow));
    check(!matching.length || matching[0].allow, "/robots.txt", `Googlebot is blocked from ${route}`);
  }
} catch (error) { check(false, "/robots.txt", error.message); }

const report = {
  checkedAt: new Date().toISOString(),
  source: baseUrl || "Next.js production build HTML",
  productCount: products.length,
  productPagesAudited: records.length,
  visualAidPagesAudited,
  assertions,
  passed: failures.length === 0,
  failureCount: failures.length,
  failures,
  products: records,
};
if (options.has("--report")) {
  const destination = path.resolve(root, options.get("--report"));
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`Report: ${destination}`);
}
console.log(`${report.passed ? "PASS" : "FAIL"}: ${records.length}/${products.length} product pages and ${visualAidPagesAudited}/${products.length} visual aids; ${assertions} SEO checks; ${failures.length} failures.`);
if (failures.length) {
  for (const failure of failures.slice(0, 30)) console.error(`${failure.route}: ${failure.message}`);
  if (failures.length > 30) console.error(`... plus ${failures.length - 30} more failures${options.has("--report") ? " in the report" : "; use --report to save all details"}.`);
  process.exitCode = 1;
}
