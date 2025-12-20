import { vocabularyController } from "@/controller/vocabulary.controller";
import { deepLService } from "@/services/deepl.service";
import { wiktionaryService } from "@/services/wiktionary.service";
import { isWord } from "@/utils/is-word";
import { useEffect, useState } from "react";

export function useTranslate(text: string) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [translatedText, setTranslatedText] = useState<string>("");
  const [isAddedToVocabulary, setIsAddedToVocabulary] =
    useState<boolean>(false);
  const [phonetic, setPhonetic] = useState<{
    audio: string;
    text: string;
  } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);

        const alreadyAddedToVocabulary = await vocabularyController.get({
          text,
        });

        if (alreadyAddedToVocabulary) {
          setIsAddedToVocabulary(true);
          setTranslatedText(alreadyAddedToVocabulary.translation);
        } else {
          const result = await deepLService.translate(text);
          if (result.data) {
            setTranslatedText(result.data.translations[0].text);
          }
          if (isWord(text)) {
            const phonetic = await wiktionaryService.get(text);
            setPhonetic(phonetic);
          }
        }

        setIsLoading(false);
        setError(null);
      } catch (err: any) {
        setError(err.message || "An error occurred during translation.");
        setIsLoading(false);
      }
    })();
  }, [text]);

  return { translatedText, isAddedToVocabulary, isLoading, error, phonetic };
}
