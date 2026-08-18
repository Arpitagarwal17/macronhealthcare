export type OfflineCacheProgress = {
  completed: number;
  total: number;
};

export type OfflineCacheResult = OfflineCacheProgress & {
  failures: Array<{ url: string; message: string }>;
};

export async function cacheVisualAidsOffline(
  urls: string[],
  onProgress?: (progress: OfflineCacheProgress) => void,
): Promise<OfflineCacheResult> {
  if (!("serviceWorker" in navigator)) {
    throw new Error("Offline storage is not supported in this browser.");
  }

  const existingRegistration = await navigator.serviceWorker.getRegistration();
  if (!existingRegistration) {
    throw new Error(
      "Offline storage becomes available after the production site finishes loading.",
    );
  }

  const registration = existingRegistration.active
    ? existingRegistration
    : await navigator.serviceWorker.ready;
  const worker = registration.active;
  if (!worker) {
    throw new Error("Offline storage is still starting. Please try again.");
  }

  return new Promise((resolve, reject) => {
    const channel = new MessageChannel();
    const timeout = window.setTimeout(() => {
      channel.port1.close();
      reject(new Error("Offline download timed out. Please check your connection."));
    }, 120_000);

    channel.port1.onmessage = (event: MessageEvent) => {
      const message = event.data as
        | ({ type: "progress" } & OfflineCacheProgress)
        | ({ type: "complete" } & OfflineCacheResult);

      if (message.type === "progress") {
        onProgress?.(message);
        return;
      }

      if (message.type === "complete") {
        window.clearTimeout(timeout);
        channel.port1.close();
        resolve(message);
      }
    };

    worker.postMessage(
      { type: "CACHE_VISUAL_AIDS", urls },
      [channel.port2],
    );
  });
}
