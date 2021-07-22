// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import store from './store/index';
import router from './router/index';
import Root from './Root.vue';
import axios from 'axios';
import JsonViewer from 'vue-json-viewer';

import 'vue-json-viewer/style.css'


// 引入公共样式表
import 'normalize.css';
import 'animate.css';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// 引入echarts主模块（基础模块）
import ECharts from 'vue-echarts/components/ECharts.vue'

// 引入需要的echarts如表
// import 'echarts/lib/chart/bar';
// import 'echarts/lib/chart/line';
// import 'echarts/lib/chart/pie';

// 引入需要的 echarts的交互组件
// import 'echarts/lib/component/tooltip';
// import 'echarts/lib/component/legend';
// import 'echarts/lib/component/title';
// import 'echarts/lib/component/visualMap';
// import 'echarts/lib/component/toolbox';

import 'src/assets/styles/variable.scss';
import 'src/assets/styles/base.scss';
import 'src/assets/styles/common.scss';
import 'src/assets/styles/iconfont.css';

import D2Crud from '@d2-projects/d2-crud'
import weekSlider from 'v-week-slider'
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/index.css'
import echarts from 'echarts'

Vue.use(echarts)
Vue.prototype.$echarts = echarts
 Vue.prototype.setCookie = function (name, value, day) {
  if (day !== 0) { //当设置的时间等于0时，不设置expires属性，cookie在浏览器关闭后删除
    var curDate = new Date();
    var curTamp = curDate.getTime();
    var curWeeHours = new Date(curDate.toLocaleDateString()).getTime() - 1;
    var passedTamp = curTamp - curWeeHours;
    var leftTamp = 24 * 60 * 60 * 1000 * 30;
    var leftTime = new Date();
    leftTime.setTime(leftTamp + curTamp);
    window.document.cookie = name + "=" + escape(value) + ";expires=" + leftTime.toGMTString();
   } else {
    window.document.cookie = name + "=" + escape(value);
  }
}

Vue.prototype.messageShow = function (_this, response) {
  if (response.data['status'] != 200) {
      _this.$message({
          showClose: true,
          message: response.data['message'],
          type: 'warning'
      });
      // if(response.data['error']){
      //     return 'error'
      // }
      return false
  } else {
      if (response.data['message']) {
          _this.$message({
              showClose: true,
              message: response.data['message'],
              type: 'success'
          });
      }
      return true
  }
};
Vue.prototype.getCookie = function (name) {
  var arr;
  var reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg)){
    return unescape(arr[2]);
  }else{
    return null; ocument.cookie = name + "=" + escape(value);
  }
}
Vue.use(VXETable)
Vue.use(weekSlider)
Vue.use(ElementUI)
Vue.use(D2Crud)
Vue.use(JsonViewer)

Vue.component('chart', ECharts);

Vue.config.productionTip = false;
Vue.prototype.$axios = axios
/* eslint-disable no-new */

// 将axios挂载到prototype上，在组件中可以直接使用this.axios访问
// Vue.prototype.axios = http;

new Vue({
  el: '#app',
  store,
  router,
  template: '<Root/>',
  components: { Root }
});
