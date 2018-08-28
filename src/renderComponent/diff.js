import {loopDidMount} from './component';
import { isString, isNumber, isBoolean, isFunction } from '../utils';
import { buildComponent } from './index';
import { ATTR_KEY } from '../data'
import { handleNode } from '../vdom/handleComponent';

const diffLeval = 0;


export function diff(vnode, dom, parentNode, mountAll, componetRef) {//componetRef: 当在第一次渲染时被传入true。用于调用componentDidMount。
  ++diffLeval;
  const ret = idiff(vnode, dom, mountAll, componetRef);
  if(parentNode) {
    parentNode.appendChild(ret);
  }
  if (!--diffLeval) {
    if (componetRef) {
      loopDidMount();
    }
  }
  return ret;
}

function idiff(vnode, dom, mountAll, componetRef) {
  let out = dom;

  if (isBoolean(vnode) || vnode === null || vnode === undefined){
    vnode = '';
  }

  if (isString(vnode) || isNumber(vnode)) {
    if (dom && dom.splitText !== undefined && (!dom._component || !componetRef)) {
      dom.nodeValue = vnode;
    } else {
      out = document.createTextNode(vnode);
      if (dom.parentNode) {
        dom.parentNode.replaceChild(out, dom);
        handleNode(dom);
      }
    }
    out[ATTR_KEY] = true;
    return out;
  }

  const vnodeName = vnode.name;

  if (isFunction(vnodeName)) {
    return buildComponent(vnode, dom, mountAll);
  }

}