export function warning(boolean, message, type) {
  if (!boolean) {
    if (type === 'type') {
      throw new TypeError(message);
    } else if (type === 'reference') {
      throw new ReferenceError(message);
    } else {
      throw new Error(message);
    }
  } else {
    return true;
  }
}