import { isObject, isFunction, warning } from '../utils';
import { mounts } from '../data';
import { queueRender } from './render';

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
    this.props = props;
    this.context = context;
    this.delayState = {};
    this.__rendercallBack = [];//用于存放当前实例用于在渲染完后调用的回调函数
  }
  render () {}
  seState (state, callBack) {
    let s = null;
    warning(isObject(state) || isFunction(state), '调用setState方法，请传入函数或者对象！', 'type');
    if (isFunction(state)) {
      s = state(this.state, this.props);
      if (callBack) {
        this.__rendercallBack.push(callBack);
      }
    } else {
      s = state;
    }
    s = Object.assign((this.state || {}), s); 
    queueRender(this, this.props, s, this.context);
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