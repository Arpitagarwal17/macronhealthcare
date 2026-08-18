"use client";

import { App } from "@capacitor/app";
import { Capacitor, type PluginListenerHandle } from "@capacitor/core";
import { SplashScreen } from "@capacitor/splash-screen";
import { useEffect } from "react";

export default function NativeBackButton() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    void SplashScreen.hide().catch(() => undefined);

    let disposed = false;
    let listener: PluginListenerHandle | undefined;

    void App.addListener("backButton", ({ canGoBack }) => {
      if (canGoBack) {
        window.history.back();
      } else {
        void App.exitApp();
      }
    }).then((handle) => {
      if (disposed) {
        void handle.remove();
        return;
      }

      listener = handle;
    });

    return () => {
      disposed = true;
      void listener?.remove();
    };
  }, []);

  return null;
}
