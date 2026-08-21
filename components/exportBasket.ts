import type { Product } from "@/data/products";
import { company } from "@/data/company";
import { deliverBlob } from "@/components/fileDelivery";

const COVER_IMAGE_PATH = "/visual-aids/visual-aid-cover-2026.jpg";
const PDF_WIDTH = 1920;
const PDF_HEIGHT = 1080;
const PPT_WIDTH = 13.333;
const PPT_HEIGHT = 7.5;

type ExportImage = {
  dataUrl: string;
  format: "JPEG" | "PNG";
  width: number;
  height: number;
};

type ImageBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ExportProgressCallback = (message: string) => void;
export type PdfDeliveryMode = "share" | "download";

function createExportFileName(
  extension: "pdf" | "pptx",
  basketName: string,
) {
  const now = new Date();
  const date = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
  const safeBasketName =
    basketName
      .trim()
      .replace(/[^a-z0-9]+/gi, "-")
      .replace(/^-+|-+$/g, "") || "Presentation-Basket";

  return `Macron-Health-Care-${safeBasketName}-${date}.${extension}`;
}

function resolveAssetUrl(src: string) {
  return new URL(src, window.location.origin).toString();
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

async function getImageDimensions(dataUrl: string, src: string) {
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

  return {
    width: image.naturalWidth,
    height: image.naturalHeight,
  };
}

function getContainedImageBounds(
  image: ExportImage,
  targetWidth: number,
  targetHeight: number,
): ImageBounds {
  const scale = Math.min(targetWidth / image.width, targetHeight / image.height);
  const width = image.width * scale;
  const height = image.height * scale;

  return {
    x: (targetWidth - width) / 2,
    y: (targetHeight - height) / 2,
    width,
    height,
  };
}

export async function loadImageAsDataUrl(src: string): Promise<ExportImage> {
  const response = await fetch(resolveAssetUrl(src));

  if (!response.ok) {
    throw new Error(`Unable to load image: ${src}`);
  }

  const blob = await response.blob();
  const dataUrl = await readBlobAsDataUrl(blob);
  const dimensions = await getImageDimensions(dataUrl, src);

  return {
    dataUrl,
    format: getImageFormat(blob.type),
    ...dimensions,
  };
}

async function loadExportImages(
  products: Product[],
  onProgress?: ExportProgressCallback,
) {
  const sources = [
    { src: COVER_IMAGE_PATH, label: "visual aid cover" },
    ...products.map((product) => ({
      src: product.visualAidImage,
      label: product.brandName,
    })),
  ];
  const images: ExportImage[] = [];

  for (const [index, source] of sources.entries()) {
    onProgress?.(`Preparing ${index + 1}/${sources.length}…`);

    try {
      images.push(await loadImageAsDataUrl(source.src));
    } catch (error) {
      const reason =
        error instanceof Error ? error.message : "The image could not be loaded.";
      throw new Error(`Unable to prepare ${source.label}: ${reason}`);
    }
  }

  return images;
}

export async function exportBasketAsPdf(
  products: Product[],
  onProgress?: ExportProgressCallback,
  basketName = "Presentation Basket",
  deliveryMode: PdfDeliveryMode = "download",
) {
  const [{ jsPDF }, images] = await Promise.all([
    import("jspdf"),
    loadExportImages(products, onProgress),
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

    const bounds = getContainedImageBounds(image, PDF_WIDTH, PDF_HEIGHT);

    pdf.addImage(
      image.dataUrl,
      image.format,
      bounds.x,
      bounds.y,
      bounds.width,
      bounds.height,
      undefined,
      "FAST",
    );
  });

  await deliverBlob(pdf.output("blob"), createExportFileName("pdf", basketName), {
    preferWebShare: deliveryMode === "share",
    shareTitle: "Macron Health Care visual aid",
  });
}

export async function exportBasketAsPpt(
  products: Product[],
  onProgress?: ExportProgressCallback,
  basketName = "Presentation Basket",
) {
  const [{ default: PptxGenJS }, images] = await Promise.all([
    import("pptxgenjs"),
    loadExportImages(products, onProgress),
  ]);
  const pptx = new PptxGenJS();

  pptx.layout = "LAYOUT_WIDE";
  pptx.author = company.displayName;
  pptx.subject = "Macron Health Care visual aid presentation";
  pptx.title = "Macron Health Care Visual Aid";
  pptx.company = company.displayName;

  images.forEach((image, index) => {
    const slide = pptx.addSlide();
    const bounds = getContainedImageBounds(image, PPT_WIDTH, PPT_HEIGHT);

    slide.background = { color: "FFFFFF" };
    slide.addImage({
      data: image.dataUrl,
      x: bounds.x,
      y: bounds.y,
      w: bounds.width,
      h: bounds.height,
      altText: index === 0 ? "Visual Aid Cover" : products[index - 1]?.brandName,
    });
  });

  const pptBlob = await pptx.write({
    outputType: "blob",
    compression: true,
  });

  await deliverBlob(
    pptBlob as Blob,
    createExportFileName("pptx", basketName),
    {
      preferWebShare: true,
      shareTitle: "Macron Health Care visual aid",
    },
  );
}
