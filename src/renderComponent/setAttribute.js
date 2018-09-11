import { warning, isObject, isNumber } from '../utils';

export function setAttribute(dom, name, oldVal, val) {
    if(name === 'className') {
      name = 'class';
    };
    if (name === 'ref') {
      if (oldVal) {
        oldVal(null);
      } else if (val) {
        val(dom)
      }
    } else if (name === 'class') {
      dom.className = val;
    } else if (name === 'key') {
    } else if (name === 'style') {
      if (warning(isObject(val), `style必须是对象，在${dom._componentConstructor ? dom._componentConstructor.name : ''}组件上`, 'type')) {
        for (const ov in oldVal) {
          if (oldVal.hasOwnProperty(ov) && !val.hasOwnProperty(ov)) {
            dom.style[ov] = '';
          }
        }
        for (let v in val) {
          if (val.hasOwnProperty(v)) {
            const styleVal = val[v];
            v = v.replace(/([A-Z])/g, (match) => {//将大写字母都转换为小写。
              return `-${String.fromCharCode(match.charCodeAt()+32)}`;
            })
            dom.style[v] = isNumber(styleVal) && IS_NON_DIMENSIONAL.test(v) === false ? `${styleVal}px` : styleVal;
          }
        }
      }
    } else if (name[0] === 'o' && name[1] === 'n') {
      const useCapture = name !== (name = name.replace(/Capture$/, ''));
      name = name.slice(2).toLowerCase();
      if (val) {
          if (!oldVal) {
            dom.addEventListener(name, eventProxy, useCapture);
          }
      } else {
          dom.removeEventListener(name, eventProxy, useCapture);
      }
      (dom._listener || (dom._listener = {}))[name] = val;
    } else {
        if (!val) {
            node.removeAttribute(name);
        } else {
            dom.setAttribute(name, val);
        }
    }
  }


  function eventProxy (event) {
      return event.currentTarget._listener[event.type](event);
  }