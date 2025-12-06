# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Chrome extension for vocabulary building that uses spaced repetition (SuperMemo SM2 algorithm) to help users learn new words. The extension allows selecting text on web pages, translating it, and adding words to a personal vocabulary list for review.

## Development Commands

```bash
# Start development server with hot reload
npm run dev

# Build for production (TypeScript compilation + Vite build)
npm run build

# Preview production build
npm run preview
```

## Chrome Extension Development Workflow

1. Run `npm run dev` to start the development server
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked" and select the `dist` directory
5. Changes will hot-reload automatically during development

## Architecture Overview

### Extension Components

The extension has four main UI surfaces:

1. **Content Script** (`src/content/`) - Injected into web pages to enable text selection and translation popup
2. **Popup** (`src/popup/`) - Browser action popup (click extension icon)
3. **Side Panel** (`src/sidepanel/`) - Chrome side panel interface
4. **Background Service Worker** (`src/background.ts`) - Handles translation API requests via `chrome.runtime.onMessage`
5. **Web Accessible Pages** (`src/pages/`) - Full-page interfaces:
   - `vocabulary/` - Vocabulary list management
   - `vocabulary-trainer/` - Spaced repetition training interface

### Core Systems

#### Storage Architecture (`src/extension/storage/`)
- Type-safe wrapper around `chrome.storage.local` API
- Schema defined in `storage.types.ts` with single `vocabulary` key containing word entries
- Each word entry includes: `id`, `text`, `translation`, `frequencyTier`, and `sm2` (spaced repetition data)

#### Messaging System (`src/extension/api/messaging.api.ts`)
- Typed message passing between content scripts and background worker
- Currently supports `TRANSLATE` action for translation requests
- Messages are type-safe with `ExtensionMessageEvent` and `ExtensionMessageResponse` types

#### Vocabulary Management (`src/controller/vocabulary.controller.ts`)
- CRUD operations for vocabulary entries
- Key functions:
  - `add()` - Validates word isn't duplicate before adding
  - `getTodayWords()` - Filters words due for review based on SM2 schedule
  - `update()` - Updates word data including SM2 progress

#### Spaced Repetition (`src/services/spaced-repetition.service.ts`)
- Implements SuperMemo SM2 algorithm via `supermemo` package
- `practice()` function takes a flashcard and grade (0-5), returns updated flashcard with new interval and due date
- Due dates managed with `dayjs` for consistent date handling

#### Word Frequency System (`src/content/hooks/use-word-frequency.ts`)
- Uses `src/data/en_50k.json` dataset to determine word frequency
- Four frequency tiers:
  - ESSENTIAL (1-1000): Most common words
  - IMPORTANT (1001-3000): High frequency
  - USEFUL (3001-10000): Medium frequency
  - ADVANCED (10001+): Rare/specialized words
- Frequency tier stored with each vocabulary entry to prioritize learning

### Content Script Flow

1. `src/content/main.tsx` injects React app into page DOM
2. `src/content/content.tsx` orchestrates text selection detection
3. `src/content/hooks/use-text-selection.ts` monitors user text selection
4. `src/content/components/popup-trigger/` displays button near selected text
5. `src/content/components/popup/` shows translation popup with word frequency indicator
6. `src/content/hooks/use-translate.ts` handles translation via background worker messaging

## Key Technical Patterns

### Type-Safe Extension Messaging

All Chrome extension message passing uses a centralized type system defined in `src/types/global.types.ts`. When adding new message types:

1. Add action to `ExtensionMessageEvent` union
2. Add payload type to `ExtensionMessageEventPayload`
3. Add response type to `ExtensionMessageResponsePayload`
4. Update background listener in `src/background.ts`

### Storage Pattern

Storage operations are centralized through `vocabularyController`. Never call `storage.get/set` directly - use controller methods to ensure business logic (deduplication, validation) is applied.

### Manifest Configuration

The extension manifest is defined in `manifest.config.ts` (not JSON). This allows TypeScript and imports from `package.json`. When adding new permissions, content scripts, or resources, edit this file.

## Path Alias

The project uses `@/` as an alias for the `src/` directory. Configured in `vite.config.ts` and `tsconfig.json`.

## Translation API

The background worker currently returns mock translation data (see `src/background.ts:18-28`). The commented code shows integration with DeepL API. When implementing real translations, note the API key must never be committed to the repository.
