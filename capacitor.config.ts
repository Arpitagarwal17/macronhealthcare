import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.macronhealthcare.app",
  appName: "Macron Health Care",
  webDir: "mobile-web",
  server: {
    url: "https://www.macronhealthcare.com",
    cleartext: false,
    allowNavigation: ["www.macronhealthcare.com", "macronhealthcare.com"],
    errorPath: "error.html",
  },
  android: {
    backgroundColor: "#F7FBFF",
    zoomEnabled: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 10_000,
      launchAutoHide: true,
      backgroundColor: "#F7FBFFFF",
    },
  },
};

export default config;
