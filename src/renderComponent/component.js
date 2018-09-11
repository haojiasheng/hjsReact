import { isObject, isFunction, warning } from '../utils';
import { mounts, FORCE_MOUNT } from '../data';
import { queueRender } from './render';
import { renderComponent } from '../renderComponent';

export class Component {
  constructor (props, context) {
    const that = this;
    let _dirty = true;
    Object.defineProperty(this, '_dirty', {
      set (value) {
        if (!value && !that.base) {//确保在componentWillMount里调用setState的时候可以直接接下来的生命周期直接用
          that.state = Object.assign((that.state || {}), that.delayState);
        }
        _dirty = value;
      },
      get () {
        return _dirty;
      }
    })
    this.props = props || {};
    this.context = context || {};
    this.state = null;
    this.delayState = {};
    this.__rendercallBack = [];//用于存放当前实例用于在渲染完后调用的回调函数
  }
  render () {}
  setState (state, callBack) {
    let s = null;
    warning(isObject(state) || isFunction(state), `在${this.constructor.name}组件中调用setState方法时，请传入函数或者对象！`, 'type');
    if (isFunction(state)) {
      s = state(this.state, this.props);
      if (callBack) {
        this.__rendercallBack.push(callBack);
      }
    } else {
      s = state;
    }
    s = Object.assign({}, this.state, s);
    queueRender(this, this.props, s, this.context);
  }
  forceUpdate () {
    renderComponent(this, this.props, this.state, FORCE_MOUNT, false, this.context)
  }
}


export function loopDidMount() {
  while (mounts.length) {
    const component = mounts.pop();
    if(isFunction(component.componentDidMount)) {
      component.componentDidMount();
    }
  }
}