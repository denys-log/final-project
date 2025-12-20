import {
  ExtensionMessageEvent,
  ExtensionMessageEventPayload,
  ExtensionMessageResponse,
  ExtensionMessageResponsePayload,
} from "@/types/global.types";

async function sendToBackground(
  message: { action: "TRANSLATE"; payload?: ExtensionMessageEventPayload["TRANSLATE"] }
): Promise<ExtensionMessageResponse<ExtensionMessageResponsePayload["TRANSLATE"]>>;

async function sendToBackground(
  message: { action: "WIKTIONARY"; payload?: ExtensionMessageEventPayload["WIKTIONARY"] }
): Promise<ExtensionMessageResponse<ExtensionMessageResponsePayload["WIKTIONARY"]>>;

async function sendToBackground(
  message: ExtensionMessageEvent
): Promise<ExtensionMessageResponse<any>> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve(response);
      }
    });
  });
}

export const messagingAPI = {
  sendToBackground,
};
