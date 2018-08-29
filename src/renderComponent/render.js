import {diff} from './diff';
import { oldComponents } from '../data';
import { Component } from './component';
import { isArray, warning } from "../utils";
import { renderComponent } from './index';

export function render(vnode, parentNode, oldDom) {
  diff(vnode, oldDom, parentNode, false, true);
}

export function createComponent(Ctor, props, context) {
  const componentList = oldComponents[func.name], inst;

  if (Ctor.prototype && Ctor.prototype.render) {
    inst = new Ctor(props, context);
    Component.call(inst, props, context);
  } else {
    inst = new Component(props, context);
    inst.constructor = Ctor;
    inst.render = doRender;
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

function doRender(props) {
  return this.constructor(props);
}

const items = [];

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
    if (p._dirty) {
      renderComponent(component, props, state, undefined, undefined, context);
    }
  }
}

