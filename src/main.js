import Vue from "vue";
import App from "./App.vue";
import vueMarkEditor from "../packages/index";

Vue.config.productionTip = false;
Vue.use(vueMarkEditor);
new Vue({
  render: h => h(App)
}).$mount("#app");
