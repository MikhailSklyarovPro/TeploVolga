# Документация: Модуль управления таблицами структуры компании

## Описание

Модуль `company-structure.js` реализует функциональность переключения между таблицами филиалов и обособленных подразделений на странице "Структура компании". Модуль обеспечивает плавную анимацию переключения с эффектом fade-in/fade-out и горизонтальным сдвигом.

## Основные возможности

- ✅ Автоматическое переключение таблиц при клике на кнопки навигации
- ✅ Плавная анимация переключения (fade + slide)
- ✅ Синхронизация активного состояния кнопок и таблиц
- ✅ Защита от множественных переключений во время анимации
- ✅ Программный API для управления таблицами
- ✅ Автоматическая инициализация при загрузке страницы

## Структура HTML

Модуль ожидает следующую структуру HTML:

```html
<div class="company-structure__wrapper-table">
  <!-- Навигация -->
  <nav class="company-structure__nav">
    <ul class="company-structure__nav-list">
      <li>
        <button class="company-structure__nav-button company-structure__nav-button--active" data-table="branches">Филиалы</button>
      </li>
      <li>
        <button class="company-structure__nav-button" data-table="divisions">Обособленное подразделение</button>
      </li>
    </ul>
  </nav>

  <!-- Контейнер таблиц -->
  <div class="company-structure__table-container">
    <!-- Таблица 1 -->
    <div class="company-structure__table company-structure__table--active" data-table-content="branches">
      <!-- Содержимое таблицы -->
    </div>

    <!-- Таблица 2 -->
    <div class="company-structure__table" data-table-content="divisions">
      <!-- Содержимое таблицы -->
    </div>
  </div>
</div>
```

## Обязательные атрибуты

### Кнопки навигации

- `data-table` - идентификатор таблицы, которую нужно отобразить (например, `"branches"`, `"divisions"`)

### Таблицы

- `data-table-content` - идентификатор таблицы, должен совпадать со значением `data-table` соответствующей кнопки

## CSS классы

### Активные состояния

- `.company-structure__nav-button--active` - активная кнопка навигации
- `.company-structure__table--active` - активная таблица

### Селекторы

- `.company-structure__table-container` - контейнер для всех таблиц
- `.company-structure__table` - отдельная таблица
- `.company-structure__nav-button` - кнопка навигации

## Конфигурация

Модуль можно настроить через объект опций при создании экземпляра:

```javascript
const tables = new CompanyStructureTables({
  containerSelector: '.company-structure__table-container',
  tableSelector: '.company-structure__table',
  activeTableClass: 'company-structure__table--active',
  navButtonSelector: '.company-structure__nav-button',
  activeNavButtonClass: 'company-structure__nav-button--active',
  tableDataAttribute: 'data-table-content',
  buttonDataAttribute: 'data-table',
  animationDuration: 400, // миллисекунды
});
```

### Параметры конфигурации

| Параметр               | Тип    | По умолчанию                              | Описание                              |
| ---------------------- | ------ | ----------------------------------------- | ------------------------------------- |
| `containerSelector`    | string | `'.company-structure__table-container'`   | Селектор контейнера таблиц            |
| `tableSelector`        | string | `'.company-structure__table'`             | Селектор таблиц                       |
| `activeTableClass`     | string | `'company-structure__table--active'`      | CSS класс активной таблицы            |
| `navButtonSelector`    | string | `'.company-structure__nav-button'`        | Селектор кнопок навигации             |
| `activeNavButtonClass` | string | `'company-structure__nav-button--active'` | CSS класс активной кнопки             |
| `tableDataAttribute`   | string | `'data-table-content'`                    | Атрибут идентификатора таблицы        |
| `buttonDataAttribute`  | string | `'data-table'`                            | Атрибут идентификатора кнопки         |
| `animationDuration`    | number | `400`                                     | Длительность анимации в миллисекундах |

## API

### Публичные методы

#### `switchToTable(tableId)`

Программно переключает таблицу по идентификатору.

**Параметры:**

- `tableId` (string) - идентификатор таблицы для переключения

**Пример:**

```javascript
const tables = new CompanyStructureTables();
tables.switchToTable('branches'); // Переключить на таблицу филиалов
```

#### `getActiveTable()`

Возвращает текущую активную таблицу.

**Возвращает:**

- `HTMLElement|null` - активная таблица или `null` если не найдена

**Пример:**

```javascript
const tables = new CompanyStructureTables();
const activeTable = tables.getActiveTable();
console.log(activeTable); // HTMLElement или null
```

#### `getActiveButton()`

Возвращает текущую активную кнопку навигации.

**Возвращает:**

- `HTMLElement|null` - активная кнопка или `null` если не найдена

**Пример:**

```javascript
const tables = new CompanyStructureTables();
const activeButton = tables.getActiveButton();
console.log(activeButton); // HTMLElement или null
```

## Логика работы

### Инициализация

1. При загрузке DOM модуль автоматически инициализируется
2. Проверяется наличие всех необходимых элементов
3. Находится активная таблица и кнопка (или активируется первая)
4. Привязываются обработчики событий к кнопкам навигации

### Переключение таблиц

1. Пользователь кликает на кнопку навигации
2. Проверяется, не идет ли уже анимация
3. Проверяется, не является ли кнопка уже активной
4. Находится целевая таблица по атрибуту `data-table`
5. Удаляется активный класс с текущей таблицы и кнопки
6. Добавляется активный класс к целевой таблице и кнопке
7. CSS анимация выполняется автоматически через переходы

### Анимация

Анимация реализована через CSS transitions:

- **Opacity**: от 0 до 1 (fade-in)
- **Transform**: translateX от 20px до 0 (slide-in)
- **Visibility**: скрытие/показ для корректной работы с accessibility

Длительность анимации настраивается через параметр `animationDuration` (по умолчанию 400ms).

## Обработка ошибок

Модуль выводит предупреждения в консоль в следующих случаях:

- Не найдены необходимые элементы DOM
- У кнопки отсутствует атрибут `data-table`
- Таблица с указанным идентификатором не найдена
- Кнопка с указанным идентификатором не найдена

## Совместимость

- Современные браузеры с поддержкой ES6+
- Требуется поддержка `querySelector`, `classList`, `addEventListener`
- Используется `requestAnimationFrame` для плавности анимации

## Зависимости

Модуль не имеет внешних зависимостей и работает автономно.

## Примеры использования

### Базовое использование (автоматическая инициализация)

```html
<!-- HTML уже содержит необходимую структуру -->
<script type="module" src="../../js/company-structure.js"></script>
```

### Программное переключение

```javascript
// После загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
  // Модуль уже инициализирован автоматически
  // Можно получить доступ через глобальную область, если нужно
  // Или создать новый экземпляр с кастомными настройками
  const customTables = new CompanyStructureTables({
    animationDuration: 600, // Более медленная анимация
  });

  // Переключить на таблицу обособленных подразделений через 2 секунды
  setTimeout(() => {
    customTables.switchToTable('divisions');
  }, 2000);
});
```

### Получение информации о текущем состоянии

```javascript
const tables = new CompanyStructureTables();

// Получить активную таблицу
const activeTable = tables.getActiveTable();
if (activeTable) {
  const tableId = activeTable.getAttribute('data-table-content');
  console.log(`Активна таблица: ${tableId}`);
}

// Получить активную кнопку
const activeButton = tables.getActiveButton();
if (activeButton) {
  const buttonText = activeButton.textContent.trim();
  console.log(`Активна кнопка: ${buttonText}`);
}
```

## Отладка

Для отладки можно использовать консоль браузера:

```javascript
// Проверить наличие элементов
console.log(document.querySelector('.company-structure__table-container'));
console.log(document.querySelectorAll('.company-structure__table'));
console.log(document.querySelectorAll('.company-structure__nav-button'));

// Проверить активные элементы
const activeTable = document.querySelector('.company-structure__table--active');
const activeButton = document.querySelector('.company-structure__nav-button--active');
console.log('Активная таблица:', activeTable);
console.log('Активная кнопка:', activeButton);
```

## Примечания

- Модуль использует паттерн IIFE (Immediately Invoked Function Expression) для изоляции области видимости
- Все методы и свойства класса являются публичными, но рекомендуется использовать только публичные методы API
- Анимация основана на CSS transitions, что обеспечивает хорошую производительность
- Модуль автоматически обрабатывает случаи, когда активная таблица/кнопка не найдены при инициализации
