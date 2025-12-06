import { SuperMemoItem } from "supermemo";

export type ExtensionMessageEvent<Payload = undefined> = {
  action: "TRANSLATE";
  payload?: Payload;
};

export type ExtensionMessageEventPayload = {
  TRANSLATE: {
    text: string;
    targetLang?: string;
  };
};

export type ExtensionMessageEventPayloadKeys =
  keyof ExtensionMessageEventPayload;

export type ExtensionMessageResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type ExtensionMessageResponsePayload = {
  TRANSLATE: {
    translations: {
      detected_source_language: string;
      text: string;
    }[];
  };
};

export type ExtensionMessageResponsePayloadKeys =
  keyof ExtensionMessageResponsePayload;

export type Flashcard = SuperMemoItem & {
  dueDate: string;
};
