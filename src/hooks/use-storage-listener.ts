import { StorageSchema } from "@/extension/storage/storage.types";
import { useEffect } from "react";

type StorageChange = {
  oldValue?: any;
  newValue?: any;
};

export function useStorageListener(
  key: keyof StorageSchema,
  callback: (change: StorageChange) => void,
  area: "local" | "sync" = "local"
) {
  useEffect(() => {
    const listener = (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string
    ) => {
      if (areaName === area && changes[key]) {
        callback(changes[key]);
      }
    };

    chrome.storage.onChanged.addListener(listener);

    return () => {
      chrome.storage.onChanged.removeListener(listener);
    };
  }, [key, area, callback]);
}
