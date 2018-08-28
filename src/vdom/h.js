import { VNode } from './VNode';
import { isArray, isNumber, isBoolean, isObject } from '../utils';

export function h(nodeName, attributes, ...args) {
  let child = null, childrens = [], lastIsString = false;
  if (attributes && (child = attributes.children)) {
    args.push(child);
    delete attributes.children;
  };
  args.reverse();
  while (args.length) {
    if ((child = args.pop()) && isArray(child)) {
      for (const node of child) {
        args.push(node);
      }
    } else {
      let isString = false;
      if (!isObject(child)) {
        isString = true;
        if (typeof isNumber(child)) {
          child = String(child);
        } else if (child === null || child === undefined || isBoolean(child)) {
          child = ''
        }
      }
      if (lastIsString && isString) {
        childrens[childrens.length - 1] += child;
      } else {
        childrens.push(child);
      }
      lastIsString = isString;
    }
  }
  const vnode = new VNode();
  vnode.nodeName =  nodeName;
  if (attributes && (vnode.key = attributes.key)) {
    delete attributes.key;
  }
  vnode.attributes = attributes;
  vnode.children = childrens;
  return vnode;
}
