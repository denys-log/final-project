import { defineManifest } from "@crxjs/vite-plugin";
import pkg from "./package.json";

export default defineManifest({
  manifest_version: 3,
  name: pkg.name,
  version: pkg.version,
  icons: {
    16: "public/icon-16x16.png",
    32: "public/icon-32x32.png",
    48: "public/icon-48x48.png",
    128: "public/icon-128x128.png",
  },
  action: {
    default_icon: {
      16: "public/icon-16x16.png",
      32: "public/icon-32x32.png",
      48: "public/icon-48x48.png",
      128: "public/icon-128x128.png",
    },
    default_popup: "src/popup/index.html",
  },
  permissions: ["sidePanel", "contentSettings", "storage", "alarms", "notifications"],
  content_scripts: [
    {
      js: ["src/content/main.tsx"],
      matches: ["https://*/*"],
    },
  ],
  side_panel: {
    default_path: "src/sidepanel/index.html",
  },
  background: {
    service_worker: "src/background.ts",
    type: "module",
  },
  web_accessible_resources: [
    {
      resources: ["src/pages/vocabulary/index.html"],
      matches: ["<all_urls>"],
    },
    {
      resources: ["src/pages/vocabulary-trainer/index.html"],
      matches: ["<all_urls>"],
    },
  ],
});
