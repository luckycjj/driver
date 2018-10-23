// 引入子路由
import trackList from '../pages/trackList'
import login from '../pages/login'
import message from '../pages/message'
import authenticationS from '@/components/authentication/authenticationS'
import user from '../pages/user'
import track from '../pages/track'
import Vue from 'vue'
import Router from 'vue-router'
import  trackF from '@/components/track/trackMore'
import  trackS from '@/components/track/map'
import  trackT from '@/components/track/qrcode'
import  trackFo from  '@/components/track/uploadBill'
import  trackSi from '@/components/track/uploadImg'
import forgetPassword from '@/components/loginBox/forgetPassword'
import  orderScreen from '@/components/track/orderScreen'
import register from '@/components/loginBox/register'
import listMessage from '@/components/message/messageList'
import aboutUs from '@/components/myBox/aboutUs'
import setup from '@/components/myBox/setup'
import suggestion from '@/components/myBox/suggestion'
import changePassword from '@/components/myBox/changePassword'
import statusNow from '@/components/myBox/statusNow'
Vue.use(Router);

Vue.directive('title', {
  inserted: function (el, binding) {
    document.title = el.dataset.title
    document.getElementById('title').innerText = document.title
  }
});
Vue.filter('companyTypeName', function(value) {
  value = value*1;
  var valueTypeName  ="";
  switch (value)
  {
    case 0:
      valueTypeName="";
      break;
    case 1:
      valueTypeName="待审核";
      break;
    case 2:
      valueTypeName="已审核";
      break;
    case 3:
      valueTypeName="已驳回";
      break;
    case 4:
      valueTypeName="已禁用";
      break;
  }
  return valueTypeName
});

Vue.filter('orderTypeName', function(value) {
  value = value*1;
  var valueTypeName  ="";
  switch (value)
  {
    case 0:
      valueTypeName = "待确认";
      break;
    case 10:
      valueTypeName = "已确认";
      break;
    case 20:
      valueTypeName = "司机出发";
      break;
    case 31:
      valueTypeName = "提货到达";
      break;
    case 32:
      valueTypeName = "开始装货";
      break;
    case 33:
      valueTypeName = "装货完毕";
      break;
    case 41:
      valueTypeName = "运输到达";
      break;
    case 42:
      valueTypeName = "开始卸货";
      break;
    case 43:
      valueTypeName = "卸货完毕";
      break;
    case 50:
      valueTypeName = "已签收";
      break;
    case 60:
      valueTypeName = "退单";
      break;
  }
  return valueTypeName
});

export default new Router(
  {
  routes: [
    {
      path:'/authenticationS',
      name:'authenticationS',
      component:authenticationS,
    },
    {
      path:'/orderScreen',
      name:'orderScreen',
      component:orderScreen,
    },
    {
      path:'/changePassword',
      name:'changePassword',
      component:changePassword,
    },
    {
      path:'/statusNow',
      name:'statusNow',
      component:statusNow,
    },
    {
      path:'/aboutUs',
      name:'aboutUs',
      component:aboutUs,
    },
    {
      path:'/setup',
      name:'setup',
      component:setup,
    },
    {
      path:'/suggestion',
      name:'suggestion',
      component:suggestion,
    },
    {
      path:'/login',
      name:'login',
      component:login,
    },
    {
      path:'/forgetPassword',
      name:'forgetPassword',
      component:forgetPassword,
    },
    {
      path:'/register',
      name:'register',
      component:register,
    },
    {
      path:'/trackList',
      name:'trackList',
      component:trackList,
    },
    {
      path:'/message',
      name:'message',
      component:message,
    },
    {
      path:'/user',
      name:'user',
      component:user,
    },
    {
      path:'/listMessage',
      name:'listMessage',
      component:listMessage
    },
    {
      path: '/track',
      name: 'track',
      component: track,
      children: [
        {path: 'trackMore', component: trackF},
        {path: 'map', component: trackS},
        {path: 'qrcode', component: trackT},
        {path:'uploadBill',component:trackFo},
        {path:'uploadImg',component:trackSi}
      ]
    }
  ]
})
