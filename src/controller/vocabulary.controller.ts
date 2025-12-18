import { v4 as uuidv4 } from "uuid";
import { storage } from "@/extension/storage/storage.api";
import dayjs from "dayjs";
import { StorageSchema } from "@/extension/storage/storage.types";
import { Frequency } from "@/types/global.types";

const add = async ({
  text,
  translation,
  frequency,
}: {
  text: string;
  translation: string;
  frequency: Frequency;
}) => {
  const isWord = text.trim().split(" ").length === 1;
  if (!isWord) return;

  const isAlreadyInVocabulary = await get({ text });
  if (isAlreadyInVocabulary) return;

  const prevVocabulary = await getAll();

  await storage.set("vocabulary", [
    ...prevVocabulary,
    {
      id: uuidv4(),
      text,
      translation,
      frequency,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sm2: {
        interval: 0,
        repetition: 0,
        efactor: 2.5,
        dueDate: dayjs(Date.now()).toISOString(),
      },
    },
  ]);
};

const get = async ({ text }: { text: string }) => {
  const vocabulary = await getAll();
  return vocabulary.find((entry) => entry.text === text);
};

const getAll = async () => {
  return (await storage.get("vocabulary")) || [];
};

const remove = async ({ id }: { id: string }) => {
  const vocabulary = await getAll();
  const updatedVocabulary = vocabulary.filter((entry) => entry.id !== id);
  await storage.set("vocabulary", updatedVocabulary);
  return updatedVocabulary;
};

const update = async ({
  id,
  ...updatedWord
}: StorageSchema["vocabulary"][0]) => {
  const vocabulary = await getAll();
  const newVocabulary = vocabulary.map((entry) =>
    entry.id === id ? { ...entry, ...updatedWord } : entry
  );
  await storage.set("vocabulary", newVocabulary);
};

const getTodayWords = async () => {
  const vocabulary = await getAll();

  const isDueToday = (reviewDate: string): boolean => {
    const today = dayjs().startOf("day");
    const due = dayjs(reviewDate).startOf("day");

    return due.isSame(today) || due.isBefore(today);
  };

  return vocabulary.filter((entry) => isDueToday(entry.sm2.dueDate));
};

export const vocabularyController = {
  add,
  get,
  getAll,
  remove,
  getTodayWords,
  update,
};
