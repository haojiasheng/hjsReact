import {diff} from './diff';
import { oldComponents } from '../data';
import { Component } from './component';
import { isArray, warning } from "../utils";
import { renderComponent } from './index';

export function render(vnode, parentNode, oldDom) {
  diff(vnode, oldDom, parentNode, false, true);
}

export function createComponent(Ctor, props) {
  const componentList = oldComponents[func.name], inst;

  if (Ctor.prototype && Ctor.prototype.render) {
    inst = new Ctor(props);
    Component.call(inst, props);
  } else {
    inst = new Component(props);
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

export function queueRender(component, props, state) {
  if (!component._dirty) {
    component._dirty = true;
    warning(
      items.push({
        component,
        props,
        state
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
    const {props, state, component} = p;
    if (p._dirty) {
      renderComponent(component, props, state);
    }
  }
}

