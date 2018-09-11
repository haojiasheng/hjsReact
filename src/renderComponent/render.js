import {diff} from './diff';
import { oldComponents } from '../data';
import { Component } from './component';
import { isArray, warning, isClass } from "../utils";
import { renderComponent } from './index';

export function render(vnode, parentNode, oldDom) {
  diff(vnode, oldDom, parentNode , false, true);
}

export function createComponent(Ctor, props, context) {
  let componentList = oldComponents[Ctor.name], inst;

  if (isClass(Ctor) && (warning(Ctor.prototype.render, `组件${Ctor.name}必须要有render方法`, 'TypeError')) && warning(Object.getPrototypeOf(Ctor.prototype).constructor === Component, `组件${Ctor.name}必须继承Component类`, 'TypeError')) {
    inst = new Ctor(props, context);
  } else {
    inst = new Component(props, context);
    inst.constructor = Ctor;
    inst.render = doRender.bind(inst, props, context);
  }
  
  if (isArray(componentList)) {
    for (const component of componentList) {
      if (component.constructor === Ctor) {
        inst.nextBase = component.base;
        break;  
      }
    }
  }

  return inst;
}

function doRender(props, context) {
  return this.constructor.call(undefined,props, context);
}

let items = [];

export function queueRender(component, props, state, context) {
  if (!component._dirty) {
    component._dirty = true;
    warning(
      items.push({
        component,
        props,
        state,
        context,
      }) === 1, `请勿多次同时修改组件的状态`)
    Promise.resolve().then(reRender);
  } else {
    component.delayState = state;
  }
}

function reRender() {
  let p, list = items;
  items = [];
  while (p = list.pop()) {
    const {props, state, component, context} = p;
    if (component._dirty) {
      renderComponent(component, props, state, undefined, undefined, context);
    }
  }
}

