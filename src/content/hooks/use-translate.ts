import { vocabularyController } from "@/controller/vocabulary.controller";
import { deepLService } from "@/services/deepl.service";
import { useEffect, useState } from "react";

export function useTranslate(text: string) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [translatedText, setTranslatedText] = useState<string>("");
  const [isAddedToVocabulary, setIsAddedToVocabulary] =
    useState<boolean>(false);

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
        }

        setIsLoading(false);
        setError(null);
      } catch (err: any) {
        setError(err.message || "An error occurred during translation.");
        setIsLoading(false);
      }
    })();
  }, [text]);

  return { translatedText, isAddedToVocabulary, isLoading, error };
}
