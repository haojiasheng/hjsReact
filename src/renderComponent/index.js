import { getNodeProps } from '../vdom';
import { SYNC_MOUNT, ASYNC_MOUNT, FORCE_MOUNT, NO_MOUNT, mounts } from '../data';
import { removeComponent, collectComponent, handleNode } from '../vdom/handleComponent';
import { diff, diffLeval } from './diff';
import { createComponent, render, queueRender } from './render';
import { warning } from '../utils';
import { isFunction } from 'util';
import { loopDidMount } from './component';


//将vnode传入其中，获取vnode的dom
export function buildComponent(vnode, dom, mountAll, context) {
  let domComponent = dom && dom._component,
      Cst = vnode.nodeName,
      isDirectly = dom && dom._componentConstructor === Cst,
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
export function setComponentProps(component, mode, mountAll,  props = {}, state, context) {
  warning(!component._disable, `请勿运行已经卸载或者正在运行的组件${component.constructor.name}, 否则会造成内存泄漏`, 'reference');
  component._disable = true;

  component.__key = props.key;
  component.newCycle = isFunction(component.constructor.getDerivedStateFromProps) || isFunction(component.getSnapshotBeforeUpdate);
  delete props.ref;
  delete props.key;

  if (!component.newCycle) {
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



export function renderComponent(component, props = {}, state = null, mode, mountAll, context) {
  warning(!component._disable, `请勿运行已经卸载或者正在运行的组件${component.constructor.name}, 否则会造成内存泄漏`, 'reference');
  let preProps = component.props,
      preState = component.state,
      preContext = component.context,
      initBase = component.base || component.nextBase,
      isUpdate = component.base,
      initialChildComponent = component._component,
      skip = false,
      getDerivedStateFromPropsData,
      rendered, 
      snapshot, 
      inst,
      cbase;

  if (isFunction(component.constructor.getDerivedStateFromProps)) {
    getDerivedStateFromPropsData = component.constructor.getDerivedStateFromProps(props, state);
    state = Object.assign((state || {}),getDerivedStateFromPropsData);
  }
  
  if (isUpdate) {
    if (mode !== FORCE_MOUNT && component.shouldComponentUpdate && !component.shouldComponentUpdate(props, state)) {
      skip = true;
    } else if (!component.newCycle && isFunction(component.componentWillUpdate)) {
      component.componentWillUpdate(props, state)
    }
  }
  component.nextBase = null;
  component.props = props;
  component.state = state;
  component.context = context;

  component._dirty = false;
  if (!skip) {
    rendered = component.render();
    warning(rendered !== undefined, 'render函数必须返回一些内容或者false或者null');


    if (isFunction(component.getChildContext)) {
      context = Object.assign({}, context, component.getChildContext())
    }

    if (isUpdate && isFunction(component.getSnapshotBeforeUpdate)) {
      snapshot = component.getSnapshotBeforeUpdate(preProps, preState);
    }

    let childComponent = rendered && rendered.nodeName,
        base = null,//放到页面上的base都存在这个变量
        toUnmount;//不需要的组件，之后需要卸载的都存在这个变量
    if (isFunction(childComponent)){
      let childProps = getNodeProps(rendered);
      inst = initialChildComponent;
      if (inst && inst.constructor === childComponent && inst.__key === childProps.key) {//如果组件返回的组件和之前组件返回的组件是一样的话，那就直接将原来的组件放到setComponentProps里跑一遍
        setComponentProps(inst, SYNC_MOUNT, false, childProps, inst.state, context);
      } else {
        toUnmount = inst;

        component._component = inst = createComponent(childComponent, childProps, context);
        inst._parentComponent = component;
        setComponentProps(inst, SYNC_MOUNT, false, childProps, inst.state, context);
      }
      base = inst.base;
    } else {
      cbase = initBase;

      toUnmount = initialChildComponent;
      if (toUnmount) {
        cbase = component._component = null;
      }

      if (initBase || mode === SYNC_MOUNT) {
        if (cbase) {
          cbase._component = null;
        }
        base = diff(rendered, cbase, cbase && cbase.parentNode, mountAll || !isUpdate, false, context);
        
      }
    }

    if (initBase && base !== initBase && inst !== initialChildComponent) {
      const initBaseParent = initBase.parentNode;
      if (initBaseParent && initBaseParent !== base) {
        if (!toUnmount) {
          handleNode(initBase);
        }
      }
    }

    if (toUnmount) {
      removeComponent(toUnmount)
    }
  
    component.base = base;
      
  
    if(base) {
      let componentRef = component,
          t = component;
      while(t = t._parentComponent) {
        (componentRef = t).base = base;
      }
      base._component = componentRef;
      base._componentConstructor = componentRef.constructor
    }
  }

  if (!isUpdate || mountAll) {
    mounts.unshift(component);
  } else if (!skip && isFunction(component.componentDidUpdate)) {
    component.componentDidUpdate(preProps, preState, snapshot);
  }

  let cbk;
  while (cbk = component.__rendercallBack.pop()) {
    cbk.call(component);
  }

  if (!diffLeval) {
    loopDidMount()
  }

}