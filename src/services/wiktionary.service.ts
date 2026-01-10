import { messagingAPI } from "@/extension/api/messaging.api";

function get(word: string): Promise<{ audio: string; text: string } | null> {
  return messagingAPI
    .sendToBackground({
      action: "WIKTIONARY",
      payload: {
        word,
      },
    })
    .then((response) => {
      const data = response?.data?.[0];

      if (data?.phonetics) {
        const phonetic = data.phonetics?.find(
          (item) => item.audio && item.text
        );
        if (phonetic && phonetic.audio && phonetic.text) {
          return {
            audio: phonetic.audio,
            text: phonetic.text,
          };
        }
      }
      return null;
    });
}

export const wiktionaryService = {
  get,
};
