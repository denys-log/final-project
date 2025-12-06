import { isWord } from "@/utils/is-word";
import en_50k from "../../data/en_50k.json";

export function useWordFrequency(text: string) {
  if (!isWord(text)) return null;

  const count = getWordFrequencyCount(text);

  if (
    count >= FREQUENCY_TIERS.ESSENTIAL.range[0] &&
    count <= FREQUENCY_TIERS.ESSENTIAL.range[1]
  ) {
    return FREQUENCY_TIERS.ESSENTIAL;
  } else if (
    count >= FREQUENCY_TIERS.IMPORTANT.range[0] &&
    count <= FREQUENCY_TIERS.IMPORTANT.range[1]
  ) {
    return FREQUENCY_TIERS.IMPORTANT;
  } else if (
    count >= FREQUENCY_TIERS.USEFUL.range[0] &&
    count <= FREQUENCY_TIERS.USEFUL.range[1]
  ) {
    return FREQUENCY_TIERS.USEFUL;
  } else {
    return FREQUENCY_TIERS.ADVANCED;
  }
}

const FREQUENCY_TIERS = {
  ESSENTIAL: {
    range: [1, 1000],
    color: "🟢",
    hex: "#22c55e",
    name: "Критично важливі",
    nameEn: "Essential",
    description: "Must-know слова",
    coverage: "~75-80% повсякденної мови",
    cefrLevel: "A1-A2",
    priority: "ДУЖЕ ВИСОКИЙ",
  },

  IMPORTANT: {
    range: [1001, 3000],
    color: "🟡",
    hex: "#eab308",
    name: "Дуже корисні",
    nameEn: "Important",
    description: "Необхідні для впевненого спілкування",
    coverage: "+15% (всього ~90-95%)",
    cefrLevel: "B1-B2",
    priority: "ВИСОКИЙ",
  },

  USEFUL: {
    range: [3001, 10000],
    color: "🔵",
    hex: "#3b82f6",
    name: "Корисні",
    nameEn: "Useful",
    description: "Для вільного володіння",
    coverage: "+3-5% (всього ~95-98%)",
    cefrLevel: "B2-C1",
    priority: "СЕРЕДНІЙ",
  },

  ADVANCED: {
    range: [10001, Infinity],
    color: "⚪",
    hex: "#9ca3af",
    name: "Специфічні",
    nameEn: "Advanced/Rare",
    description: "Рідкісні або спеціалізовані",
    coverage: "~1-2%",
    cefrLevel: "C1-C2",
    priority: "НИЗЬКИЙ",
  },
};

function getWordFrequencyCount(text: string) {
  if (!en_50k.hasOwnProperty(text)) {
    return -1;
  }
  return en_50k[text as keyof typeof en_50k];
}
