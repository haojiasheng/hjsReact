export function getType(a) {
  return {}.toString.call(a).match(/\S+\s(\S+)]/)[1].toLowerCase();
};

export function isObject(a) {
  return getType(a) === 'object';
};

export function isArray(a) {
  return getType(a) === 'array';
};

export function isNumber(a) {
  return getType(a) === 'number';
};

export function isString(a) {
  return getType(a) === 'string';
}

export function isBoolean(a) {
  return getType(a) === 'boolean';
}

export function isFunction(a) {
  return getType(a) === 'function';
}

console.log(1);