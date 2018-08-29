import { getNodeProps } from '../vdom';
import { SYNC_MOUNT, ASYNC_MOUNT, FORCE_MOUNT } from '../data';
import { removeComponent } from '../vdom/handleComponent';
import { createComponent, render, queueRender } from './render';
import { warning } from '../utils';
import { isFunction } from 'util';


//将vnode传入其中，获取vnode的dom
export function buildComponent(vnode, dom, mountAll, context) {
  let domComponent = dom && dom._component,
      Cst = vnode.nodeName,
      isDirectly = dom._componentConstructor === Cst,
      isOwner = isDirectly,
      props = getNodeProps(vnode);

  if (domComponent && !isOwner && (domComponent =  domComponent.parentComponent)) {
    isOwner = domComponent.constructor === Cst;
  }
  if (domComponent && isOwner && !mountAll) {
    setComponentProps(domComponent, SYNC_MOUNT, mountAll, props, domComponent.state, context);
    dom = domComponent.base;
  } else {
    if (domComponent) {
      removeComponent(domComponent);
      dom = null;
    }

    const inst = createComponent(Cst, props, context);
    setComponentProps(inst, SYNC_MOUNT, mountAll, props, inst.state, context);
    dom = inst.base;
  }

  return dom;
}

//当修改props的时候运行这个函数。
export function setComponentProps(component, mode, mountAll,  props, state, context) {
  warning(!component._disable, `请勿运行已经卸载或者正在运行的组件${component.constructor.name}, 否则会造成内存泄漏`, 'reference');
  component._disable = true;

  component.__ref = props.ref;
  component.__key = props.key;
  delete props.ref;
  delete props.key;

  if (!isFunction(component.constructor.getDerivedStateFromProps)) {
    if (!component.base || mountAll) {
      if (component.componentWillMount) {
        component.componentWillMount();
      }
    } else if (isFunction(component.componentWillReceiveProps)) {
      component.componentWillReceiveProps(props, context);
    }
  }

  component._disable = false;

  if (mode === SYNC_MOUNT) {
    renderComponent(component, props, state, mode, mountAll, context)
  } else if (mode === ASYNC_MOUNT) {
    queueRender(component, props, state, context);
  }
}



export function renderComponent(component, props = null, state = null, mode, mountAll, context) {
  let preProps = component.props,
      preState = component.state,
      initBase = component.base || component.nextBase,
      isUpdate = component.base,
      skip = false,
      getDerivedStateFromPropsData, rendered;


  if (isFunction(component.constructor.getDerivedStateFromProps)) {
    getDerivedStateFromPropsData = component.constructor.getDerivedStateFromProps(props, state);
    state = Object.assign((state || {}),getDerivedStateFromPropsData);
    component.state = Object.assign((component.state || {}), getDerivedStateFromPropsData);
  }
  
  if (isUpdate) {
    if (mode !== FORCE_MOUNT && component.shouldComponentUpdate && component.shouldComponentUpdate(props, state)) {
      skip = true;
    } else if (!isFunction(component.constructor.getDerivedStateFromProps) && isFunction(component.componentWillUpdate)) {
      component.componentWillUpdate(props, state)
    }
    component.nextBase = null;
    component.props = props;
    component.state = state;
    component.context = context;
  }

  component._dirty = false;
  if (!skip) {
    rendered = component.render();
    if (isFunction(rendered)){
      
    }
  }

}