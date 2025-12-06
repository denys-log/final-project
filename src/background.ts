import {
  ExtensionMessageEvent,
  ExtensionMessageEventPayload,
  ExtensionMessageEventPayloadKeys,
} from "./types/global.types";

chrome.runtime.onMessage.addListener(
  <T extends ExtensionMessageEventPayloadKeys>(
    message: ExtensionMessageEvent<ExtensionMessageEventPayload[T]>,
    _: unknown,
    sendResponse: (response?: any) => void
  ) => {
    if (
      message.action === "TRANSLATE" &&
      message.payload?.text &&
      message.payload?.targetLang
    ) {
      new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            translations: [
              {
                detected_source_language: "EN",
                text: "Зрозуміти",
              },
            ],
          });
        }, 200);
      }).then((data) => sendResponse({ success: true, data }));

      // fetch("https://api-free.deepl.com/v2/translate", {
      //   method: "POST",
      //   headers: {
      //     Authorization:
      //       "DeepL-Auth-Key cc43ea64-7c94-49b8-a1f6-5032c15abcac:fx",
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     text: [message.payload.text],
      //     target_lang: message.payload.targetLang,
      //   }),
      // })
      //   .then((response) => response.json())
      //   .then((data) => sendResponse({ success: true, data }))
      //   .catch((error) =>
      //     sendResponse({ success: false, error: error.message })
      //   );

      return true;
    }
  }
);
