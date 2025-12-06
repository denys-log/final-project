import {
  ExtensionMessageEvent,
  ExtensionMessageEventPayload,
  ExtensionMessageEventPayloadKeys,
  ExtensionMessageResponse,
  ExtensionMessageResponsePayload,
} from "@/types/global.types";

async function sendToBackground<T extends ExtensionMessageEventPayloadKeys>(
  message: ExtensionMessageEvent<ExtensionMessageEventPayload[T]>,
): Promise<ExtensionMessageResponse<ExtensionMessageResponsePayload[T]>> {
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
