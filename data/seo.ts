export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.macronhealthcare.com";

// Update this only when site content, product metadata or structured data changes.
// A build or request alone must not make every sitemap entry appear newly updated.
export const SITE_LAST_UPDATED = new Date("2026-10-14T06:53:28.000Z");

export const SEO_KEYWORDS = [
  "Macron Health Care",
  "Macron Healthcare",
  "pharmaceutical company in India",
  "Indian pharmaceutical company",
  "branded pharmaceutical formulations",
  "pharmaceutical products India",
  "healthcare products India",
];

export const HOME_TITLE =
  "Macron Health Care | Pharmaceutical Company in India";

export const HOME_DESCRIPTION =
  "Macron Health Care is an Indian pharmaceutical company with a portfolio of branded formulations across a range of dosage forms.";

export const OG_TITLE = HOME_TITLE;

export const OG_DESCRIPTION = HOME_DESCRIPTION;

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}
