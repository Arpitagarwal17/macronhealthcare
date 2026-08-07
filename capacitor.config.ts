import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.macronhealthcare.app",
  appName: "Macron Health Care",
  webDir: "mobile-web",
  server: {
    url: "https://www.macronhealthcare.com",
    cleartext: false,
    allowNavigation: ["www.macronhealthcare.com", "macronhealthcare.com"],
  },
  android: {
    backgroundColor: "#F7FBFF",
  },
};

export default config;
