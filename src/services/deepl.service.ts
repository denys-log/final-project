import { messagingAPI } from "@/extension/api/messaging.api";

function translate(text: string, targetLang?: string) {
  return messagingAPI.sendToBackground({
    action: "TRANSLATE",
    payload: {
      text,
      targetLang: targetLang || "UK",
    },
  });
}

export const deepLService = {
  translate,
};
