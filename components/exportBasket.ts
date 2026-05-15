import type { jsPDF as JsPdfInstance } from "jspdf";
import type { Product } from "@/data/products";
import { company } from "@/data/company";

const PDF_FILE_NAME = "Macron-Health-Care-Basket.pdf";
const PPT_FILE_NAME = "Macron-Health-Care-Basket.pptx";
const LOGO_PATH = "/logo-mark.png";

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
  const image = new Image();
  image.crossOrigin = "anonymous";
  image.decoding = "async";

  const imageLoaded = new Promise<HTMLImageElement>((resolve, reject) => {
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Unable to load image: ${src}`));
  });

  image.src = resolveAssetUrl(src);
  await imageLoaded;

  if (image.decode) {
    await image.decode().catch(() => undefined);
  }

  return image;
}

async function rasterizeImage(
  src: string,
  maxWidth = 1280,
  maxHeight = 720,
  quality = 0.78,
): Promise<RasterImage> {
  const image = await loadImage(src);
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

function fitTextLines(
  pdf: JsPdfInstance,
  text: string,
  maxWidth: number,
  maxHeight: number,
  startFontSize: number,
  minFontSize: number,
) {
  let fontSize = startFontSize;
  let lines = pdf.splitTextToSize(text, maxWidth) as string[];
  let lineHeight = fontSize * 1.22;

  while (fontSize > minFontSize && lines.length * lineHeight > maxHeight) {
    fontSize -= 1;
    pdf.setFontSize(fontSize);
    lines = pdf.splitTextToSize(text, maxWidth) as string[];
    lineHeight = fontSize * 1.22;
  }

  const maxLines = Math.max(1, Math.floor(maxHeight / lineHeight));

  if (lines.length > maxLines) {
    lines = lines.slice(0, maxLines);
    const lastLine = lines[lines.length - 1] ?? "";
    lines[lines.length - 1] =
      lastLine.length > 3 ? `${lastLine.slice(0, -3)}...` : lastLine;
  }

  return { fontSize, lines, lineHeight };
}

function addPdfTextBlock(
  pdf: JsPdfInstance,
  label: string,
  text: string,
  x: number,
  y: number,
  width: number,
  height: number,
  startFontSize = 18,
) {
  pdf.setTextColor("#52677b");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8);
  pdf.text(label.toUpperCase(), x, y);

  pdf.setTextColor("#0e2b4c");
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(startFontSize);

  const fitted = fitTextLines(pdf, text, width, height, startFontSize, 9);
  pdf.setFontSize(fitted.fontSize);
  pdf.text(fitted.lines, x, y + 24, { lineHeightFactor: 1.22 });
}

export async function exportBasketAsPdf(products: Product[]) {
  const [{ jsPDF }, logo, ...visualAids] = await Promise.all([
    import("jspdf"),
    rasterizeImage(LOGO_PATH, 320, 320, 0.88),
    ...products.map((product) =>
      rasterizeImage(product.visualAidImage, 1280, 720, 0.78),
    ),
  ]);
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
    const logoRect = getContainedRect(logo.width, logo.height, 42, 34, 42, 46);
    const imageFrame = { x: 392, y: 106, width: 512, height: 360 };
    const visualRect = getContainedRect(
      visualAid.width,
      visualAid.height,
      imageFrame.x + 14,
      imageFrame.y + 14,
      imageFrame.width - 28,
      imageFrame.height - 28,
    );

    pdf.setFillColor("#f5f8fb");
    pdf.rect(0, 0, 960, 540, "F");
    pdf.setFillColor("#ffffff");
    pdf.setDrawColor("#d8e6ee");
    pdf.roundedRect(24, 22, 912, 496, 18, 18, "FD");

    pdf.addImage(
      logo.dataUrl,
      "JPEG",
      logoRect.x,
      logoRect.y,
      logoRect.width,
      logoRect.height,
    );
    pdf.setTextColor("#0e2b4c");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(17);
    pdf.text(company.displayName, 96, 50);
    pdf.setTextColor("#064b8d");
    pdf.setFontSize(9);
    pdf.text("Committed to Quality & Services.", 96, 68);

    pdf.setFontSize(10);
    pdf.setTextColor("#52677b");
    pdf.text(`Product ${index + 1} of ${products.length}`, 820, 52);

    pdf.setFillColor("#edf6f8");
    pdf.setDrawColor("#d8e6ee");
    pdf.roundedRect(48, 104, 304, 364, 14, 14, "FD");

    pdf.setTextColor("#0e2b4c");
    pdf.setFont("helvetica", "bold");
    const title = fitTextLines(pdf, product.brandName, 248, 86, 32, 20);
    pdf.setFontSize(title.fontSize);
    pdf.text(title.lines, 70, 148, { lineHeightFactor: 1.1 });

    addPdfTextBlock(pdf, "Composition", product.composition, 70, 236, 252, 142);
    addPdfTextBlock(pdf, "Dosage Form", product.dosageForm, 70, 416, 252, 42, 18);

    pdf.setFillColor("#ffffff");
    pdf.setDrawColor("#d8e6ee");
    pdf.roundedRect(
      imageFrame.x,
      imageFrame.y,
      imageFrame.width,
      imageFrame.height,
      14,
      14,
      "FD",
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

  pdf.save(PDF_FILE_NAME);
}

function getPptCompositionFontSize(composition: string) {
  if (composition.length > 520) {
    return 7.5;
  }

  if (composition.length > 360) {
    return 9;
  }

  if (composition.length > 220) {
    return 10.5;
  }

  if (composition.length > 130) {
    return 12;
  }

  return 14;
}

export async function exportBasketAsPpt(products: Product[]) {
  const [{ default: PptxGenJS }, logo, ...visualAids] = await Promise.all([
    import("pptxgenjs"),
    rasterizeImage(LOGO_PATH, 320, 320, 0.9),
    ...products.map((product) =>
      rasterizeImage(product.visualAidImage, 1280, 720, 0.8),
    ),
  ]);
  const pptx = new PptxGenJS();

  pptx.layout = "LAYOUT_WIDE";
  pptx.author = company.displayName;
  pptx.subject = "Macron Health Care selected product visual aids";
  pptx.title = "Macron Health Care Basket";
  pptx.company = company.displayName;

  products.forEach((product, index) => {
    const slide = pptx.addSlide();
    const visualAid = visualAids[index];
    const logoRect = getContainedRect(logo.width, logo.height, 0.58, 0.36, 0.48, 0.5);
    const visualRect = getContainedRect(
      visualAid.width,
      visualAid.height,
      5.68,
      1.56,
      6.42,
      4.8,
    );

    slide.background = { color: "F5F8FB" };
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.32,
      y: 0.28,
      w: 12.7,
      h: 6.9,
      rectRadius: 0.08,
      fill: { color: "FFFFFF" },
      line: { color: "D8E6EE", transparency: 0 },
    });
    slide.addImage({
      data: logo.dataUrl,
      x: logoRect.x,
      y: logoRect.y,
      w: logoRect.width,
      h: logoRect.height,
      altText: "Macron Health Care",
    });
    slide.addText(company.displayName, {
      x: 1.18,
      y: 0.43,
      w: 3.6,
      h: 0.24,
      fontFace: "Aptos",
      fontSize: 15,
      bold: true,
      color: "0E2B4C",
      margin: 0,
    });
    slide.addText("Committed to Quality & Services.", {
      x: 1.18,
      y: 0.74,
      w: 3.7,
      h: 0.18,
      fontFace: "Aptos",
      fontSize: 8,
      bold: true,
      color: "064B8D",
      margin: 0,
    });
    slide.addText(`Product ${index + 1} of ${products.length}`, {
      x: 10.7,
      y: 0.5,
      w: 1.7,
      h: 0.2,
      fontFace: "Aptos",
      fontSize: 9,
      bold: true,
      color: "52677B",
      align: "right",
      margin: 0,
    });

    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.7,
      y: 1.28,
      w: 4.25,
      h: 5.08,
      rectRadius: 0.07,
      fill: { color: "EDF6F8" },
      line: { color: "D8E6EE", transparency: 0 },
    });
    slide.addText(product.brandName, {
      x: 0.98,
      y: 1.62,
      w: 3.54,
      h: 0.9,
      fontFace: "Aptos",
      fontSize: product.brandName.length > 22 ? 24 : 30,
      bold: true,
      color: "0E2B4C",
      fit: "shrink",
      margin: 0,
      breakLine: false,
    });
    slide.addText("COMPOSITION", {
      x: 0.98,
      y: 2.72,
      w: 3.4,
      h: 0.16,
      fontFace: "Aptos",
      fontSize: 7.5,
      bold: true,
      color: "52677B",
      margin: 0,
    });
    slide.addText(product.composition, {
      x: 0.98,
      y: 3.02,
      w: 3.45,
      h: 1.78,
      fontFace: "Aptos",
      fontSize: getPptCompositionFontSize(product.composition),
      color: "0E2B4C",
      breakLine: false,
      fit: "shrink",
      margin: 0.02,
      valign: "top",
    });
    slide.addText("DOSAGE FORM", {
      x: 0.98,
      y: 5.18,
      w: 3.4,
      h: 0.16,
      fontFace: "Aptos",
      fontSize: 7.5,
      bold: true,
      color: "52677B",
      margin: 0,
    });
    slide.addText(product.dosageForm, {
      x: 0.98,
      y: 5.48,
      w: 3.4,
      h: 0.35,
      fontFace: "Aptos",
      fontSize: 14,
      bold: true,
      color: "064B8D",
      margin: 0,
      fit: "shrink",
    });

    slide.addShape(pptx.ShapeType.roundRect, {
      x: 5.38,
      y: 1.18,
      w: 6.98,
      h: 5.42,
      rectRadius: 0.07,
      fill: { color: "FFFFFF" },
      line: { color: "D8E6EE", transparency: 0 },
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

  await pptx.writeFile({ fileName: PPT_FILE_NAME, compression: true });
}
