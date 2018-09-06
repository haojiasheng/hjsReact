import { Component, h, render } from '../../src/hjsReact';
/** @jsx h */

describe('ES6 spec', function () {
  it('es6 arrows feature ', function () {
    let v = () => { console.log(1); };
    function Z() {
      return <div>c</div>
    }
    class A extends Component {
      state = {
        status: false
      }
      constructor() {
        super();
      }
      render() {
        const { status } = this.state;
        const { num } = this.props;
        return <div onClick={this.add} id='a'>
          <div>props：{num}</div>
          <div onClick={this.update}>forceNum: {this.forceNum || (this.forceNum = 0)}</div>
          <a>1</a><br />
          {status && <b>2</b>}<br />
          {status && <p>5</p>}
          <i>3</i><br />
          {status && <div>4</div>}
          {status && <p>5</p>}
          {status && <Z status={status} />}
        </div>
      }
      add = () => {
        this.setState((preState) => {
          console.log('add')
          return {
            status: !preState.status
          }
        })
      }
      update = (event) => {
        console.log('forceUpdate')
        this.forceNum = ++this.forceNum;
        this.forceUpdate();
        event.stopPropagation()
      }
      static getDerivedStateFromProps(props, state, context) {
        console.group('getDerivedStateFromProps=================>');
        console.log('argments', props, state, context);

        return {
          StateFromProps: `stateNum: ${state.stateNum}`
        }
      }
      componentWillMount(props, state, context) {
        console.group('componentWillMount=================>');
        console.log('this', this.props, this.state, context);
        console.log('argments', props, state, context);
      }
      shouldComponentUpdate(props, state, context) {
        console.group('shouldComponentUpdate=================>');
        console.log('this', this.props, this.state, context);
        console.log('argments', props, state, context);
        return true
      }
      componentWillReceiveProps (props, state, context) {
          console.group('componentWillReceiveProps=================>');
          console.log('this', this.props, this.state, context);
          console.log('argments',props, state, context);
      }
      componentWillUpdate (props, state, context) {
          console.group('componentWillUpdate=================>');
          console.log('this', this.props, this.state, context);
          console.log('argments',props, state, context);
      }
      getSnapshotBeforeUpdate(props, state, context) {
        console.group('getSnapshotBeforeUpdate=================>');
        console.log('this', this.props, this.state, context);
        console.log('argments', props, state, context);
        return {
          msg: 'getSnapshotBeforeUpdate传送数据'
        }
      }
      componentDidUpdate(props, state, data) {
        console.group('componentDidUpdate=================>');
        console.log('this', this.props, this.state);
        console.log('argments', props, state, data);
      }
      componentDidMount(props, state, context) {
        console.group('componentDidMount=================>');
        console.log('this', this.props, this.state);
        console.log('argments', props, state, context, 'a:', this.a);
      }
    }

    class B extends Component {
      state = {
        num: 0
      }
      render() {
        const { num } = this.state;
        return (
          <div>
            <div onClick={this.add}>增加</div>
            <A num={num} />
            <div>一些内容</div>
          </div>
        );
      }
      add = () => {
        this.setState((preState) => ({
          num: ++preState.num
        }))
      }
    }
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(<B />, div);
  });
});