export const mounts = [];//用于存放所有第一次渲染的组件

export const ATTR_KEY = Symbol('attributes');//所有dom的这个属性里存的是它们所有的属性

export const oldComponents = {};//用于存放所有被卸载但是还是有可能会用到的组件

export const SYNC_MOUNT = Symbol('sync run component mount');//同步渲染组件

export const ASYNC_MOUNT = Symbol('async run component mount');//异步渲染组件

export const FORCE_MOUNT = Symbol('force run component mount');//强制更新

export const NO_MOUNT = Symbol('no run component mount');//不更新

export const IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;//这些是css名称，如果css名称包含了这些字符，那值就可以是数字。