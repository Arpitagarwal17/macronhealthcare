"use client";

import { Capacitor } from "@capacitor/core";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";

type DeliverBlobOptions = {
  preferWebShare?: boolean;
  shareTitle?: string;
};

export type FileDeliveryResult = "downloaded" | "shared" | "cancelled";

export function isNativeApp() {
  return Capacitor.isNativePlatform();
}

function readBlobAsBase64(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("The file could not be prepared for sharing."));
        return;
      }

      const commaIndex = reader.result.indexOf(",");
      resolve(commaIndex >= 0 ? reader.result.slice(commaIndex + 1) : reader.result);
    };
    reader.onerror = () =>
      reject(reader.error ?? new Error("The file could not be read."));
    reader.readAsDataURL(blob);
  });
}

function isShareCancellation(error: unknown) {
  return (
    error instanceof DOMException &&
    error.name === "AbortError"
  );
}

async function shareNativeFile(
  blob: Blob,
  fileName: string,
  shareTitle: string,
): Promise<FileDeliveryResult> {
  const data = await readBlobAsBase64(blob);
  const { uri } = await Filesystem.writeFile({
    path: fileName,
    data,
    directory: Directory.Cache,
  });

  await Share.share({
    title: shareTitle,
    files: [uri],
    dialogTitle: "Share file",
  });

  return "shared";
}

function downloadInBrowser(blob: Blob, fileName: string): FileDeliveryResult {
  const objectUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = objectUrl;
  link.download = fileName;
  link.rel = "noopener";
  link.hidden = true;
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => window.URL.revokeObjectURL(objectUrl), 60_000);
  return "downloaded";
}

async function shareInBrowser(
  blob: Blob,
  fileName: string,
  shareTitle: string,
): Promise<FileDeliveryResult | null> {
  if (
    typeof navigator.share !== "function" ||
    typeof navigator.canShare !== "function" ||
    typeof File !== "function"
  ) {
    return null;
  }

  const file = new File([blob], fileName, {
    type: blob.type || "application/octet-stream",
  });

  if (!navigator.canShare({ files: [file] })) {
    return null;
  }

  try {
    await navigator.share({
      title: shareTitle,
      files: [file],
    });
    return "shared";
  } catch (error) {
    if (isShareCancellation(error)) {
      return "cancelled";
    }

    // File sharing requires a transient user activation in some browsers. An
    // export may finish after that activation expires, so retain the download
    // path instead of failing an otherwise valid export.
    if (error instanceof DOMException && error.name === "NotAllowedError") {
      return null;
    }

    throw error;
  }
}

export async function deliverBlob(
  blob: Blob,
  fileName: string,
  {
    preferWebShare = false,
    shareTitle = fileName,
  }: DeliverBlobOptions = {},
): Promise<FileDeliveryResult> {
  if (isNativeApp()) {
    return shareNativeFile(blob, fileName, shareTitle);
  }

  if (preferWebShare) {
    const shareResult = await shareInBrowser(blob, fileName, shareTitle);

    if (shareResult) {
      return shareResult;
    }
  }

  return downloadInBrowser(blob, fileName);
}

export async function fetchAndDeliverFile(
  source: string,
  fileName: string,
  options?: DeliverBlobOptions,
) {
  const response = await fetch(new URL(source, window.location.origin));

  if (!response.ok) {
    throw new Error(`Unable to download file (${response.status}).`);
  }

  return deliverBlob(await response.blob(), fileName, options);
}
