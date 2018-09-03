import {ATTR_KEY, oldComponents} from '../data';

//删除元素，并且在元素有_component的时候，将_component也卸载。
export function handleNode(node) {
  const component = node._component;
  if (component) {
    removeComponent(component);
  } else {
    if (node[ATTR_KEY] && node[ATTR_KEY].ref) {
      node[ATTR_KEY].ref(null);
    }
    removeNode(node);
    removeChild(node);
  }
}


//卸载组件，如果组件内还有组件就传入内组件递归一次，否则将base存到组件的nextBase，然后保存组件，并且卸载base和base的子元素
export function removeComponent(component) {
  const base = component.base;
  const inner = component._component;

  component._disable = true;

  if (component.componentWillUnmount) {
    component.componentWillUnmount();
  }
  if (inner) {
    removeComponent(inner);
  } else if (base) {
    component.nextBase = base;
    collectComponent(component);
    if (base[ATTR_KEY] && base[ATTR_KEY].ref) {
      base[ATTR_KEY].ref(null);
    }
    removeNode(base);
    removeChild(base);
  }
  if (component.__ref) {
    component.__ref(null);
  }
}

//删除节点
export function removeNode ( node ) {
  if (node && node.parentNode) {
    node.parentNode.removeChild(node);
  }
}

//删除元素的所有子节点
export function removeChild(node) {
  while (node.firstChild) {
    handleNode(node.firstChild);
  }
}

//收集组件，以便下次使用
export function collectComponent(component) {
  const name = component.constructor.name;
  const sameComponents = oldComponents[name];
  if (sameComponents) {
    for (let i = 0; i < sameComponents.length; i++) {
      if (sameComponents[i].constructor === component.constructor) {
        sameComponents[i] = component;
        return;
      }
    }
    sameComponents.push(component);
  } else {
    oldComponents[name] = [component];
  }
}