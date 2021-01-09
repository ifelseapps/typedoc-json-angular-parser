const mock = require('./mock.json');

const AVAILABLE_DECORATORS = ['Output', 'Input'];

parse(mock);

function parse(tree) {
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

    console.log(api);
  });
}

function getMethodTypeDisplayString(signature) {
  const parameters = (signature.parameters || []).map(p => `${p.name}: ${getTypeDisplayString(p.type)}`);
  return `${signature.name}(${parameters.join(', ')}): ${getTypeDisplayString(signature.type)}`;
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
    const arguments = type.typeArguments.map(a => a.name);
    return `${type.name}<${arguments.join(', ')}>`;
  }

  return type.name;
}
