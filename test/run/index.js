import { Component,  h, render} from '../../src/hjsReact';
/** @jsx h */

describe('ES6 spec', function() {
  it('es6 arrows feature ', function() {
    let v = () => {console.log(1);};
    function A(props) {
      console.log(props)
      const { children, name } = props;
      return <div id='a'>
                <b>这是一个组件，它的名称是{name}</b>
                {children}
              </div>
    }

    class B extends Component {
      render () {
        return null;//FIXME:返回A组件就卡住
      }
    }

    const div = document.createElement('div');
    document.body.appendChild(div);
    render(<B />, div);
  });
});