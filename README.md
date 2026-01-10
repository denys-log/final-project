# TODO

[] - Фільтрація на не потрібні символи (,.?...), тобто якщо тільки ці символи були вибрані, то не показувати переклад
[] - Встановити максимальну кількість символів для перекладу
[] - гарячі клавіші (виклик перекладу)
[] - кеш для слів які вже переклали, щоб не викликати зайві запити
[] - нагадування в браузері сповіщення про необхідність повторити слова
[] - Показати приклад та контекст (згорнутий/розгорнутий)
[] - Темна/світла тема
[] - Сторінка навчання (флешкарти)
[] - Підрахунок вивчених слів
[] - Календар активності (streak)
[] - Графіки прогресу (можна використати Chart.js)
[] - Кількість правильних/неправильних відповідей
[] - Розподіл слів за частотністю
[] - Відсоток покриття мови ("Твій словник покриває 85% розмовної англійської")
[] - Прогрес-бар сесії
[] - Екран результатів після сесії
[] - Показати статистику: правильних/неправильних
[] - Список слів, які потрібно повторити
[] - Кнопка "Повторити важкі слова" + Кнопка "Завершити"
[] - Контекст (речення, де користувач знайшов слово)

?
Показ слова → користувач вводить переклад
Показ перекладу → користувач вводить слово
Показ контексту з пропуском → заповнити слово
Випадковий вибір типу вправи

# React + Vite + CRXJS

This template helps you quickly start developing Chrome extensions with React, TypeScript and Vite. It includes the CRXJS Vite plugin for seamless Chrome extension development.

## Features

- React with TypeScript
- TypeScript support
- Vite build tool
- CRXJS Vite plugin integration
- Chrome extension manifest configuration

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Open Chrome and navigate to `chrome://extensions/`, enable "Developer mode", and load the unpacked extension from the `dist` directory.

4. Build for production:

```bash
npm run build
```

## Project Structure

- `src/popup/` - Extension popup UI
- `src/content/` - Content scripts
- `manifest.config.ts` - Chrome extension manifest configuration

## Documentation

- [React Documentation](https://reactjs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [CRXJS Documentation](https://crxjs.dev/vite-plugin)

## Chrome Extension Development Notes

- Use `manifest.config.ts` to configure your extension
- The CRXJS plugin automatically handles manifest generation
- Content scripts should be placed in `src/content/`
- Popup UI should be placed in `src/popup/`
