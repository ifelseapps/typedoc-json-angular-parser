# Typedoc json Angular parser

Парсит результат работы `typedoc`, формирует описание компонента, пригодное для вывода в интерфейсе, и записывает его в файл.

## Установка:
```
npm install @ifelseapps/typedoc-json-angular-parser
```

## Использование

```javascript
const { parse } = require('@ifelseapps/typedoc-json-angular-parser');
const typeDocResult = require('docs.json');

parse(typeDocResult, { outputPath: '/some/path' });
```
