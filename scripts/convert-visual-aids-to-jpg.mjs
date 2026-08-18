import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const publicDirectory = path.resolve(scriptDirectory, "..", "public");

// This fixed inventory intentionally excludes the eight PNG twins whose products
// already used reviewed JPG artwork before this migration.
const productPngPaths = [
  "/visual-aids/apcon.png",
  "/visual-aids/cloper.png",
  "/visual-aids/drt.png",
  "/visual-aids/ecitron-plus.png",
  "/visual-aids/etr-th.png",
  "/visual-aids/ferronica-drop.png",
  "/visual-aids/ferronica-syrup.png",
  "/visual-aids/flt-20.png",
  "/visual-aids/furakast-l.png",
  "/visual-aids/gabonza-m.png",
  "/visual-aids/heptamac.png",
  "/visual-aids/lycron-cap.png",
  "/visual-aids/lycron-syrup.png",
  "/visual-aids/m-trox-1500-sb.png",
  "/visual-aids/maclo-p.png",
  "/visual-aids/maclo-th.png",
  "/visual-aids/maclodase-p.png",
  "/visual-aids/macrifa-400.png",
  "/visual-aids/macron-cv-625.png",
  "/visual-aids/macron-oil-60-ml.png",
  "/visual-aids/macron-pro.png",
  "/visual-aids/macroncal-drop.png",
  "/visual-aids/macroncef-50.png",
  "/visual-aids/macronliv-300.png",
  "/visual-aids/mactuss.png",
  "/visual-aids/metoron.png",
  "/visual-aids/molly-forte-injection.png",
  "/visual-aids/molly-forte-tablet.png",
  "/visual-aids/myflez.png",
  "/visual-aids/myorab-dsr.png",
  "/visual-aids/myotral.png",
  "/visual-aids/myotral-k27.png",
  "/visual-aids/myovit.png",
  "/visual-aids/nimtek-p.png",
  "/visual-aids/nucis-plus.png",
  "/visual-aids/ppday.png",
  "/visual-aids/ppzol-dsr.png",
  "/visual-aids/propra-az.png",
  "/visual-aids/rabiday-dsr.png",
  "/visual-aids/rabron-d.png",
  "/visual-aids/rabron-dsr.png",
  "/visual-aids/ravista-m.png",
  "/visual-aids/turpiron.png",
  "/visual-aids/vertitop-16.png",
  "/visual-aids/vitabank.png",
  "/visual-aids/vtrocef.png",
  "/visual-aids/walex.png",
  "/visual-aids/walex-p.png",
  "/visual-aids/zymopan.png",
];
const sourcePaths = [...productPngPaths, "/visual-aids/visual-aid-cover.png"];

const toFileSystemPath = (publicPath) =>
  path.join(publicDirectory, publicPath.replace(/^\//, ""));
const sourceExists = await Promise.all(
  sourcePaths.map(async (publicPath) => {
    try {
      await fs.access(toFileSystemPath(publicPath));
      return true;
    } catch {
      return false;
    }
  }),
);
const availableSourceCount = sourceExists.filter(Boolean).length;

if (availableSourceCount === 0) {
  for (const publicPath of sourcePaths) {
    await fs.access(toFileSystemPath(publicPath.replace(/\.png$/i, ".jpg")));
  }
  console.log("All 50 JPEG outputs already exist; no source PNGs remain.");
  process.exit(0);
}

if (availableSourceCount !== sourcePaths.length) {
  throw new Error(
    `Incomplete source inventory: found ${availableSourceCount} of ${sourcePaths.length} PNGs.`,
  );
}

let sourceBytes = 0;
let outputBytes = 0;

for (const publicPath of sourcePaths) {
  const sourcePath = toFileSystemPath(publicPath);
  const outputPath = sourcePath.replace(/\.png$/i, ".jpg");
  const metadata = await sharp(sourcePath).metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error(`Could not read dimensions for ${publicPath}.`);
  }

  sourceBytes += (await fs.stat(sourcePath)).size;
  await sharp(sourcePath)
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(outputPath);
  outputBytes += (await fs.stat(outputPath)).size;

  console.log(
    `${publicPath} -> ${publicPath.replace(/\.png$/i, ".jpg")} ` +
      `(${metadata.width}x${metadata.height})`,
  );
}

console.log(
  `Converted ${productPngPaths.length} product visual aids and 1 export cover.`,
);
console.log(`Bytes: ${sourceBytes} -> ${outputBytes}`);
