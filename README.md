# Typedoc json Angular parser

[![npm version](https://img.shields.io/npm/v/@ifelseapps/typedoc-json-angular-parser.svg)](https://www.npmjs.com/package/@ifelseapps/typedoc-json-angular-parser)

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

Пример сгенерированного описания:
```json
{
  "selector": "b-combobox",
  "api": {
    "inputs": [
      {
        "name": "items",
        "type": "Array<IItem>",
        "description": null
      },
      {
        "name": "placeholder",
        "type": "string",
        "description": null
      },
      {
        "name": "searchPlaceholder",
        "type": "string",
        "description": null
      },
      {
        "name": "width",
        "type": "string",
        "description": null
      }
    ],
    "outputs": [],
    "methods": []
  }
}
```

### Особенности
* Для того, чтобы публичный метод попал в описание api компонента — ему нужно явно прописывать модификатор доступа `public`.
