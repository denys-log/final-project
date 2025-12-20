import { messagingAPI } from "@/extension/api/messaging.api";

function get(word: string) {
  return messagingAPI
    .sendToBackground({
      action: "WIKTIONARY",
      payload: {
        word,
      },
    })
    .then((response) => {
      let result = null;
      const data = response?.data?.[0];

      if (data?.phonetics) {
        const phonetic = data.phonetics?.find(
          (item: any) => item.audio && item.text
        );
        if (phonetic) {
          result = {
            audio: phonetic.audio,
            text: phonetic.text,
          };
        }
      }
      return result;
    });
}

export const wiktionaryService = {
  get,
};
