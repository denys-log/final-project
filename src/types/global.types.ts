import { SuperMemoItem } from "supermemo";

export type ExtensionMessageEvent =
  | {
      action: "TRANSLATE";
      payload?: ExtensionMessageEventPayload["TRANSLATE"];
    }
  | {
      action: "WIKTIONARY";
      payload?: ExtensionMessageEventPayload["WIKTIONARY"];
    };

export type ExtensionMessageEventPayload = {
  TRANSLATE: {
    text: string;
    targetLang?: string;
  };
  WIKTIONARY: {
    word: string;
  };
};

export type ExtensionMessageEventPayloadKeys =
  keyof ExtensionMessageEventPayload;

export type ExtensionMessageResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type DictionaryApiResponse = {
  word: string;
  phonetics: { audio?: string; text?: string }[];
  meanings: {
    partOfSpeech: string;
    definitions: { definition: string; example?: string }[];
  }[];
}[];

export type ExtensionMessageResponsePayload = {
  TRANSLATE: {
    translations: {
      detected_source_language: string;
      text: string;
    }[];
  };
  WIKTIONARY: DictionaryApiResponse;
};

export type ExtensionMessageResponsePayloadKeys =
  keyof ExtensionMessageResponsePayload;

export type Flashcard = SuperMemoItem & {
  dueDate: string;
};

export type Frequency = {
  range: number[];
  color: string;
  hex: string;
  name: string;
  nameEn: string;
  description: string;
  coverage: string;
  cefrLevel: string;
  priority: string;
};
