// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import  Toast from './vueJs/toast.js'
import { isAndroid } from './js/detector';
import bridge from './js/bridge';
import {bomb} from "./js/zujian";
import {androidIos} from "./js/app";
Vue.config.productionTip = false
Vue.use(Toast)

import components from './components/tem'
//对导入的组件进行全局组件注册
Object.keys(components).forEach((key) => {
  Vue.component(key, components[key])
});


/* eslint-disable no-new */
const  renderApp = () => {
  new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App }
  })
}

/*window.apiready = function () {
  renderApp();
}*/
renderApp();



