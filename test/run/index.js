import { Component,  h} from '../../src/hjsReact';
/** @jsx h */
describe('ES6 spec', function() {
  it('es6 arrows feature ', function() {
    let v = () => {console.log(1);};
    function A(params) {
    return <div id='100'>
              <a>{'这是一个a标签'}{'123'}</a>
              <b>这是一个加粗的字体</b>
            </div>
    }
    let a = <A>这是一个函数</A>
    console.log(a);
  });
});