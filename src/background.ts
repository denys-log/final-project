import { ExtensionMessageEvent } from "./types/global.types";
import { vocabularyController } from "./controller/vocabulary.controller";
import { storage } from "./extension/storage/storage.api";

// Update extension badge with words due count
async function updateBadge() {
  const todayWords = await vocabularyController.getTodayWords();
  const dueCount = todayWords.length;

  chrome.action.setBadgeText({ text: dueCount > 0 ? String(dueCount) : "" });
  chrome.action.setBadgeBackgroundColor({ color: "#4CAF50" });
}

// Check for words due today and send notification
async function checkAndNotify() {
  const todayWords = await vocabularyController.getTodayWords();

  // Only show notification if there are words to review
  if (todayWords.length === 0) {
    return;
  }

  const notificationId = `vocabulary-reminder-${Date.now()}`;

  chrome.notifications.create(
    notificationId,
    {
      type: "basic",
      iconUrl: chrome.runtime.getURL("public/logo.png"),
      title: "Vocabulary Reminder",
      message: `You have ${todayWords.length} word(s) to review today.`,
      priority: 2,
      requireInteraction: true,
    },
    (id) => {
      if (chrome.runtime.lastError) {
        console.error("Notification error:", chrome.runtime.lastError);
      } else {
        console.log("Notification created:", id);
      }
    }
  );
}

// Schedule daily notification at user-defined time
async function scheduleDailyNotification() {
  const notificationTime = (await storage.get("notificationTime")) || "18:00";
  const [hours, minutes] = notificationTime.split(":").map(Number);

  const now = new Date();
  const scheduledTime = new Date();
  scheduledTime.setHours(hours, minutes, 0, 0);

  // If time already passed today, schedule for tomorrow
  if (scheduledTime <= now) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }

  const delayInMinutes = (scheduledTime.getTime() - now.getTime()) / 60000;

  // Clear existing alarm and create new one
  await chrome.alarms.clear("daily-vocabulary-reminder");
  chrome.alarms.create("daily-vocabulary-reminder", {
    delayInMinutes,
    periodInMinutes: 24 * 60, // Repeat daily
  });
}

// Set up alarm on extension install/update
chrome.runtime.onInstalled.addListener(() => {
  scheduleDailyNotification();
  updateBadge();
});

// Update badge on extension startup
chrome.runtime.onStartup.addListener(() => {
  updateBadge();
});

// Handle alarm trigger
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "daily-vocabulary-reminder") {
    checkAndNotify();
  }
});

// Listen for storage changes
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local") {
    if (changes.notificationTime) {
      scheduleDailyNotification();
    }
    // Update badge when vocabulary changes
    if (changes.vocabulary) {
      updateBadge();
    }
  }
});

// Handle notification click - open vocabulary trainer
chrome.notifications.onClicked.addListener((notificationId) => {
  if (notificationId.startsWith("vocabulary-reminder")) {
    chrome.tabs.create({
      url: chrome.runtime.getURL("src/pages/vocabulary-trainer/index.html"),
    });
    chrome.notifications.clear(notificationId);
  }
});

chrome.runtime.onMessage.addListener(
  (
    message: ExtensionMessageEvent,
    _: unknown,
    sendResponse: (response?: any) => void
  ) => {
    if (
      message.action === "TRANSLATE" &&
      message.payload?.text &&
      message.payload?.targetLang
    ) {
      // new Promise((resolve) => {
      //   setTimeout(() => {
      //     resolve({
      //       translations: [
      //         {
      //           detected_source_language: "EN",
      //           text: "Тут буде переклад",
      //         },
      //       ],
      //     });
      //   }, 200);
      // }).then((data) => sendResponse({ success: true, data }));

      fetch("https://api-free.deepl.com/v2/translate", {
        method: "POST",
        headers: {
          Authorization:
            "DeepL-Auth-Key cc43ea64-7c94-49b8-a1f6-5032c15abcac:fx",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: [message.payload.text],
          target_lang: message.payload.targetLang,
        }),
      })
        .then((response) => response.json())
        .then((data) => sendResponse({ success: true, data }))
        .catch((error) =>
          sendResponse({ success: false, error: error.message })
        );

      return true;
    } else if (message.action === "WIKTIONARY" && message.payload?.word) {
      fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${message.payload.word}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((data) => sendResponse({ success: true, data }))
        .catch((error) =>
          sendResponse({ success: false, error: error.message })
        );

      return true;
    }
  }
);
