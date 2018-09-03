export function getNodeProps(vnode) {
  const props = Object.assign({}, vnode.attributes);
  const {nodeName: {defaultProps}} = vnode;

  props.children = vnode.children;

  if (defaultProps) {
    for (const key of Object.keys(defaultProps)) {
      if (props[key] === undefined) {
        props[key] = defaultProps[key];
      }
    }
  }
  return props;
}