const { getTypeDisplayString } = require('./parser');

describe('getTypeDisplayString', () => {
  test('Simple type', () => {
    const type = { name: 'string' };
    expect(getTypeDisplayString(type)).toBe('string');
  });

  test('Generic type', () => {
    const type = {
      name: 'SomeType',
      typeArguments: [
        { name: 'string' },
        { name: 'number' },
      ]
    };
    expect(getTypeDisplayString(type)).toBe('SomeType<string, number>');
  });

  test('Array type', () => {
    const type = {
      type: 'array',
      elementType: {
        name: 'SomeType'
      }
    };
    expect(getTypeDisplayString(type)).toBe('Array<SomeType>');
  });

  test('Union type', () => {
    const type = {
      type: 'union',
      types: [
        { name: 'string' },
        { name: 'number' },
      ]
    };
    expect(getTypeDisplayString(type)).toBe('string | number');
  });

  test('Union type with array', () => {
    const type = {
      type: 'union',
      types: [
        { name: 'Item' },
        { type: 'array', elementType: { name: 'Item' } },
      ]
    };
    expect(getTypeDisplayString(type)).toBe('Item | Array<Item>');
  });

  test('Union type with generics', () => {
    const type = {
      type: 'union',
      types: [
        {
          name: 'SomeType',
          typeArguments: [
            { name: 'string' },
            { name: 'Item' },
          ]
        },
        {
          name: 'Item'
        }
      ]
    };
    expect(getTypeDisplayString(type)).toBe('SomeType<string, Item> | Item');
  });

  test('Array type with union', () => {
    const type = {
      type: 'array',
      elementType: {
        type: 'union',
        types: [
          { name: 'string' },
          { name: 'number' },
        ]
      }
    };
    expect(getTypeDisplayString(type)).toBe('Array<string | number>');
  });

  test('Array type with generics', () => {
    const type = {
      type: 'array',
      elementType: {
        name: 'SomeType',
        typeArguments: [
          { name: 'string' },
          { name: 'Item' },
        ],
      }
    };
    expect(getTypeDisplayString(type)).toBe('Array<SomeType<string, Item>>');
  });
});
