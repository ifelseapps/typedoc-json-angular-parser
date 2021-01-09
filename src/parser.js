const path = require('path');
const fs = require('fs');

const AVAILABLE_DECORATORS = ['Output', 'Input'];

/**
 * Парсит AST, сгенерированное typedoc
 *
 * @param {Object} tree результат работы typedoc
 * @param {Object} settings
 * @param {String} settings.outputDir директория для сохранения результата
 */
function parse(tree, { outputDir }) {
  tree.children.forEach(component => {
    const metaStr = component.decorators[0].arguments.obj;
    const matchResult = metaStr.match(/selector:\s\'(.+)\'/);
    if (!matchResult) {
      throw new Error('Не указан селектор компонента');
    }
    const selector = matchResult[1];
    const api = {
      inputs: [],
      outputs: [],
      methods: [],
    };

    component.children.forEach(child => {
      const decorator = Array.isArray(child.decorators)
        ? child.decorators[0]
        : null;
      if (child.kindString === 'Property' && decorator && AVAILABLE_DECORATORS.includes(decorator.name)) {
        const key = decorator.name === 'Output' ? 'outputs' : 'inputs';
        api[key].push({
          name:  child.name,
          type: getTypeDisplayString(child.type),
          description: child.comment ? child.comment.shortText : null,
        });
      }

      if (child.kindString === 'Method' && child.flags.isPublic) {
        api.methods.push({
          name: child.name,
          type: getMethodTypeDisplayString(child.signatures[0]),
          description: child.comment ? child.comment.shortText : null,

        });
      }
    });

    const result = JSON.stringify({ selector, api }, null, 2);
    const outputDirPath = path.resolve(__dirname, '../', outputDir);
    if (!fs.existsSync(outputDirPath)) {
      fs.mkdirSync(outputDirPath);
    }
    fs.writeFileSync(
      path.resolve(outputDirPath, `${selector}.json`),
      result,
      { encoding: 'utf8' }
    );
  });
}

function getMethodTypeDisplayString(signature) {
  const parameters = (signature.parameters || []).map(p => `${p.name}: ${getTypeDisplayString(p.type)}`);
  return `(${parameters.join(', ')}) => ${getTypeDisplayString(signature.type)}`;
}

function getTypeDisplayString(type) {
  if (type.type === 'union') {
    const types = type.types.map(getTypeDisplayString);
    return types.join(' | ');
  }

  if (type.type === 'array') {
    return `Array<${getTypeDisplayString(type.elementType)}>`;
  }

  if (type.typeArguments) {
    const args = type.typeArguments.map(getTypeDisplayString);
    return `${type.name}<${args.join(', ')}>`;
  }

  return type.name;
}

module.exports.parse = parse;
module.exports.getMethodDisplayString = getMethodTypeDisplayString;
module.exports.getTypeDisplayString = getTypeDisplayString;
