import type { Product } from "@/data/products";
import { company } from "@/data/company";

const PDF_FILE_NAME = "Macron-Health-Care-Visual-Aid.pdf";
const PPT_FILE_NAME = "Macron-Health-Care-Visual-Aid.pptx";
const COVER_IMAGE_PATH = "/visual-aids/visual-aid-cover.png";
const PDF_WIDTH = 1920;
const PDF_HEIGHT = 1080;
const PPT_WIDTH = 13.333;
const PPT_HEIGHT = 7.5;

type ExportImage = {
  dataUrl: string;
  format: "JPEG" | "PNG";
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

function getImageFormat(contentType: string): ExportImage["format"] {
  return contentType.toLowerCase().includes("png") ? "PNG" : "JPEG";
}

function readBlobAsDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Image could not be converted for export."));
      }
    };
    reader.onerror = () => reject(reader.error ?? new Error("Image load failed."));
    reader.readAsDataURL(blob);
  });
}

async function waitForImageDecode(dataUrl: string, src: string) {
  const image = new Image();
  const imageLoaded = new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error(`Unable to load image: ${src}`));
  });

  image.src = dataUrl;
  await imageLoaded;

  if (image.decode) {
    await image.decode().catch(() => undefined);
  }
}

export async function loadImageAsDataUrl(src: string): Promise<ExportImage> {
  const response = await fetch(resolveAssetUrl(src));

  if (!response.ok) {
    throw new Error(`Unable to load image: ${src}`);
  }

  const blob = await response.blob();
  const dataUrl = await readBlobAsDataUrl(blob);

  await waitForImageDecode(dataUrl, src);

  return {
    dataUrl,
    format: getImageFormat(blob.type),
  };
}

async function loadExportImages(products: Product[]) {
  return Promise.all([
    loadImageAsDataUrl(COVER_IMAGE_PATH),
    ...products.map((product) => loadImageAsDataUrl(product.visualAidImage)),
  ]);
}

export async function exportBasketAsPdf(
  products: Product[],
  fallbackWindow?: Window | null,
) {
  const [{ jsPDF }, images] = await Promise.all([
    import("jspdf"),
    loadExportImages(products),
  ]);
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [PDF_WIDTH, PDF_HEIGHT],
    compress: true,
  });

  images.forEach((image, index) => {
    if (index > 0) {
      pdf.addPage([PDF_WIDTH, PDF_HEIGHT], "landscape");
    }

    pdf.addImage(
      image.dataUrl,
      image.format,
      0,
      0,
      PDF_WIDTH,
      PDF_HEIGHT,
      undefined,
      "FAST",
    );
  });

  downloadBlob(pdf.output("blob"), PDF_FILE_NAME, fallbackWindow);
}

export async function exportBasketAsPpt(
  products: Product[],
  fallbackWindow?: Window | null,
) {
  const [{ default: PptxGenJS }, images] = await Promise.all([
    import("pptxgenjs"),
    loadExportImages(products),
  ]);
  const pptx = new PptxGenJS();

  pptx.layout = "LAYOUT_WIDE";
  pptx.author = company.displayName;
  pptx.subject = "Macron Health Care visual aid presentation";
  pptx.title = "Macron Health Care Visual Aid";
  pptx.company = company.displayName;

  images.forEach((image, index) => {
    const slide = pptx.addSlide();

    slide.background = { color: "FFFFFF" };
    slide.addImage({
      data: image.dataUrl,
      x: 0,
      y: 0,
      w: PPT_WIDTH,
      h: PPT_HEIGHT,
      altText: index === 0 ? "Visual Aid Cover" : products[index - 1]?.brandName,
    });
  });

  const pptBlob = await pptx.write({
    outputType: "blob",
    compression: true,
  });

  downloadBlob(pptBlob as Blob, PPT_FILE_NAME, fallbackWindow);
}
