/**
 * Скрипт для автоматического добавления подключения 404-handler.js
 * во все HTML файлы проекта (кроме error.html)
 */

import { glob } from 'glob';
import { readFileSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const htmlFiles = glob.sync('src/**/*.html', { cwd: resolve(__dirname, '..') });

const scriptTag = '<script type="module" src="../../js/404-handler.js"></script>';

htmlFiles.forEach(file => {
  const filePath = resolve(__dirname, '..', file);

  // Пропускаем error.html
  if (file.includes('error.html')) {
    return;
  }

  const content = readFileSync(filePath, 'utf-8');

  // Проверяем, не добавлен ли уже скрипт
  if (content.includes('404-handler.js')) {
    return;
  }

  // Определяем правильный путь к скрипту в зависимости от глубины вложенности
  let scriptPath = '../../js/404-handler.js';
  const depth = (file.match(/\//g) || []).length;

  if (depth === 0) {
    // index.html в корне src/
    scriptPath = './js/404-handler.js';
  } else if (depth === 1) {
    // Файлы в pages/
    scriptPath = '../js/404-handler.js';
  } else if (depth === 2) {
    // Файлы в pages/subfolder/
    scriptPath = '../../js/404-handler.js';
  }

  const scriptTagWithPath = `<script type="module" src="${scriptPath}"></script>`;

  // Ищем место для вставки (после других script тегов или перед </head>)
  const headCloseIndex = content.indexOf('</head>');

  if (headCloseIndex === -1) {
    console.warn(`Не найден закрывающий тег </head> в файле ${file}`);
    return;
  }

  // Ищем последний script тег перед </head>
  const headContent = content.substring(0, headCloseIndex);
  const lastScriptIndex = headContent.lastIndexOf('<script');

  let insertIndex;
  if (lastScriptIndex !== -1) {
    // Находим конец последнего script тега
    const scriptEndIndex = headContent.indexOf('</script>', lastScriptIndex);
    if (scriptEndIndex !== -1) {
      insertIndex = scriptEndIndex + '</script>'.length;
    } else {
      insertIndex = headCloseIndex;
    }
  } else {
    insertIndex = headCloseIndex;
  }

  // Вставляем скрипт
  const newContent =
    content.substring(0, insertIndex) +
    '\n    ' + scriptTagWithPath +
    content.substring(insertIndex);

  writeFileSync(filePath, newContent, 'utf-8');
  console.log(`✓ Добавлен 404-handler.js в ${file}`);
});

console.log('Готово! 404-handler.js добавлен во все HTML файлы.');

