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
      const arr = [];
      for (let i = child.length; i--;) {
        const key = child[i].key;
        if(!key || arr.includes(key)) {
          console.warn('请将多个虚拟dom的key加上，以及不要重复');
        } else if (key) {
          arr.push(key);
        }
        args.push(child[i]);
      }
    } else {
      let isString = false;
      if (!isObject(child)) {
        isString = true;
        if (isNumber(child)) {
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
  vnode.key = attributes && attributes.key;
  vnode.attributes = attributes;
  vnode.children = childrens;
  return vnode;
}
