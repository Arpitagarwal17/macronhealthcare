import type { Product } from "@/data/products";
import { company } from "@/data/company";

const PDF_FILE_NAME = "Macron-Health-Care-Basket.pdf";
const PPT_FILE_NAME = "Macron-Health-Care-Basket.pptx";
const LOGO_PATH = "/logo.png";

type RasterImage = {
  dataUrl: string;
  width: number;
  height: number;
};

type ContainRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function resolveAssetUrl(src: string) {
  return new URL(src, window.location.origin).toString();
}

function isAppleTouchBrowser() {
  const userAgent = window.navigator.userAgent;
  const isAppleDevice = /iPad|iPhone|iPod/.test(userAgent);
  const isIpadDesktopMode =
    window.navigator.platform === "MacIntel" &&
    window.navigator.maxTouchPoints > 1;

  return isAppleDevice || isIpadDesktopMode;
}

export function openMobileExportWindow() {
  if (!isAppleTouchBrowser()) {
    return null;
  }

  const exportWindow = window.open("", "_blank");

  if (exportWindow) {
    exportWindow.document.write(
      "<!doctype html><title>Preparing export</title><body style=\"margin:0;font-family:system-ui,sans-serif;color:#063B78;background:#F7FBFF;display:grid;min-height:100vh;place-items:center;\"><p style=\"font-size:18px;font-weight:700;\">Preparing export...</p></body>",
    );
    exportWindow.document.close();
  }

  return exportWindow;
}

function downloadBlob(
  blob: Blob,
  fileName: string,
  fallbackWindow?: Window | null,
) {
  const objectUrl = window.URL.createObjectURL(blob);
  const revokeUrl = () => window.URL.revokeObjectURL(objectUrl);

  if (fallbackWindow && !fallbackWindow.closed) {
    fallbackWindow.location.href = objectUrl;
    window.setTimeout(revokeUrl, 120000);
    return;
  }

  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = fileName;
  link.rel = "noopener";
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  link.remove();

  if (isAppleTouchBrowser()) {
    const openedWindow = window.open(objectUrl, "_blank");

    if (!openedWindow) {
      window.location.href = objectUrl;
    }
  }

  window.setTimeout(revokeUrl, 120000);
}

function getContainedRect(
  imageWidth: number,
  imageHeight: number,
  boxX: number,
  boxY: number,
  boxWidth: number,
  boxHeight: number,
): ContainRect {
  const imageRatio = imageWidth / imageHeight;
  const boxRatio = boxWidth / boxHeight;

  if (imageRatio > boxRatio) {
    const width = boxWidth;
    const height = width / imageRatio;

    return {
      x: boxX,
      y: boxY + (boxHeight - height) / 2,
      width,
      height,
    };
  }

  const height = boxHeight;
  const width = height * imageRatio;

  return {
    x: boxX + (boxWidth - width) / 2,
    y: boxY,
    width,
    height,
  };
}

async function loadImage(src: string) {
  const assetUrl = resolveAssetUrl(src);
  const image = new Image();

  if (new URL(assetUrl).origin !== window.location.origin) {
    image.crossOrigin = "anonymous";
  }

  image.decoding = "async";

  const imageLoaded = new Promise<HTMLImageElement>((resolve, reject) => {
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Unable to load image: ${src}`));
  });

  image.src = assetUrl;
  await imageLoaded;

  if (image.decode) {
    await image.decode().catch(() => undefined);
  }

  return image;
}

async function rasterizeImage(
  src: string,
  maxWidth = 1500,
  maxHeight = 920,
  quality = 0.82,
): Promise<RasterImage> {
  const image = await loadImage(src);

  if (!image.naturalWidth || !image.naturalHeight) {
    throw new Error(`Image loaded without dimensions: ${src}`);
  }

  const scale = Math.min(
    1,
    maxWidth / image.naturalWidth,
    maxHeight / image.naturalHeight,
  );
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas is not available for export.");
  }

  canvas.width = width;
  canvas.height = height;
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);

  return {
    dataUrl: canvas.toDataURL("image/jpeg", quality),
    width,
    height,
  };
}

async function rasterizeVisualAids(products: Product[]) {
  const visualAids: RasterImage[] = [];

  for (const product of products) {
    visualAids.push(await rasterizeImage(product.visualAidImage, 1500, 920, 0.8));
  }

  return visualAids;
}

export async function exportBasketAsPdf(
  products: Product[],
  fallbackWindow?: Window | null,
) {
  const [{ jsPDF }, logo] = await Promise.all([
    import("jspdf"),
    rasterizeImage(LOGO_PATH, 760, 310, 0.9),
  ]);
  const visualAids = await rasterizeVisualAids(products);
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "pt",
    format: [960, 540],
    compress: true,
  });

  products.forEach((product, index) => {
    if (index > 0) {
      pdf.addPage([960, 540], "landscape");
    }

    const visualAid = visualAids[index];
    const logoRect = getContainedRect(logo.width, logo.height, 36, 18, 246, 62);
    const visualRect = getContainedRect(
      visualAid.width,
      visualAid.height,
      28,
      92,
      904,
      420,
    );

    pdf.setFillColor("#ffffff");
    pdf.rect(0, 0, 960, 540, "F");
    pdf.addImage(
      logo.dataUrl,
      "JPEG",
      logoRect.x,
      logoRect.y,
      logoRect.width,
      logoRect.height,
      undefined,
      "FAST",
    );
    pdf.addImage(
      visualAid.dataUrl,
      "JPEG",
      visualRect.x,
      visualRect.y,
      visualRect.width,
      visualRect.height,
      undefined,
      "MEDIUM",
    );
  });

  downloadBlob(pdf.output("blob"), PDF_FILE_NAME, fallbackWindow);
}

export async function exportBasketAsPpt(
  products: Product[],
  fallbackWindow?: Window | null,
) {
  const [{ default: PptxGenJS }, logo] = await Promise.all([
    import("pptxgenjs"),
    rasterizeImage(LOGO_PATH, 760, 310, 0.9),
  ]);
  const visualAids: RasterImage[] = [];

  for (const product of products) {
    visualAids.push(await rasterizeImage(product.visualAidImage, 1500, 920, 0.82));
  }

  const pptx = new PptxGenJS();

  pptx.layout = "LAYOUT_WIDE";
  pptx.author = company.displayName;
  pptx.subject = "Macron Health Care selected product visual aids";
  pptx.title = "Macron Health Care Basket";
  pptx.company = company.displayName;

  products.forEach((product, index) => {
    const slide = pptx.addSlide();
    const visualAid = visualAids[index];
    const logoRect = getContainedRect(logo.width, logo.height, 0.36, 0.16, 3.0, 0.72);
    const visualRect = getContainedRect(
      visualAid.width,
      visualAid.height,
      0.32,
      1.06,
      12.7,
      6.08,
    );

    slide.background = { color: "FFFFFF" };
    slide.addImage({
      data: logo.dataUrl,
      x: logoRect.x,
      y: logoRect.y,
      w: logoRect.width,
      h: logoRect.height,
      altText: "Macron Health Care",
    });
    slide.addImage({
      data: visualAid.dataUrl,
      x: visualRect.x,
      y: visualRect.y,
      w: visualRect.width,
      h: visualRect.height,
      altText: product.brandName,
    });
  });

  const pptBlob = await pptx.write({
    outputType: "blob",
    compression: true,
  });

  downloadBlob(pptBlob as Blob, PPT_FILE_NAME, fallbackWindow);
}
