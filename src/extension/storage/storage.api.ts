import { StorageKey, StorageValue } from "./storage.types";

async function set<K extends StorageKey>(
  key: K,
  value: StorageValue<K>
): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ [key]: value }, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
}

async function get<K extends StorageKey>(
  key: K
): Promise<StorageValue<K> | undefined> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([key], (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result[key] as StorageValue<K> | undefined);
      }
    });
  });
}

async function remove<K extends StorageKey>(key: K): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.remove(key, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
}

async function clear(): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.clear(() => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
}

async function has<K extends StorageKey>(key: K): Promise<boolean> {
  const value = await get(key);
  return value !== undefined;
}

export const storage = {
  set,
  get,
  remove,
  clear,
  has,
};
