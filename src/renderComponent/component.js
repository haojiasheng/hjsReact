import { isObject, isFunction, warning } from '../utils/type';
import { _callBack, mounts } from '../data';
import { queueRender } from './render';

export class Component {
  constructor (props, context) {
    const that = this;
    let _dirty = true;
    Object.defineProperty(this, '_dirty', {
      set (value) {
        if (!value) {
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
  }
  render () {}
  seState (state, callBack) {
    let s = null;
    warning(isObject(state) || isFunction(state), '调用setState方法，请传入函数或者对象！', 'type');
    if (isFunction(state)) {
      s = state(this.state, this.props);
      if (callBack) {
        _callBack.push(callBack);
      }
    } else {
      s = state;
    }
    s = Object.assign(this.state, s);
    queueRender(this, this.props, s);
  }
}


export function loopDidMount() {
  while (mounts.length) {
    const component = mounts.pop();
    if(component.componentDidMount) {
      component.componentDidMount();
    }
  }
}