import markdown from "./src/main";

// 为组件添加 install 方法，用于按需引入
markdown.install = function(Vue) {
  Vue.component(markdown.name, markdown);
};

export default markdown;
