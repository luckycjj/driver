// 引入子路由
import robbingList from '../pages/robbingList'
import trackList from '../pages/trackList'
import login from '../pages/login'
import message from '../pages/message'
import secondmessage from '../pages/message2'
import searchDayOrder from '../pages/searchDayOrder'
import settlementCenter from '../pages/settlementCenter'
import Secondmessage from '../pages/Secondmessage'
import authenticationS from '@/components/authentication/authenticationS'
import user from '../pages/user'
import track from '../pages/track'
import taskMoreHomePage from '../pages/taskMoreHomePage'
import Vue from 'vue'
import Router from 'vue-router'
import  trackF from '@/components/track/trackMore'
import  trackMore2 from '@/components/track/trackMore2'
import  trackS from '@/components/track/map'
import  trackT from '@/components/track/qrcode'
import  trackFo from  '@/components/track/uploadBill'
import  trackSi from '@/components/track/uploadImg'
import  electronicReceipt from '@/components/track/electronicReceipt'
import  drawname from '@/components/track/drawname'
import  lookImg from '@/components/track/lookImg'
import  upProductImg from '@/components/track/upProductImg'
import  histroyTrack from '@/components/track/histroyTrack'
import  paddingTrack from '@/components/track/paddingTrack'
import forgetPassword from '@/components/loginBox/forgetPassword'
import  orderScreen from '@/components/track/orderScreen'
import register from '@/components/loginBox/register'
import listMessage from '@/components/message/messageList'
import aboutUs from '@/components/myBox/aboutUs'
import setup from '@/components/myBox/setup'
import suggestion from '@/components/myBox/suggestion'
import changePassword from '@/components/myBox/changePassword'
import statusNow from '@/components/myBox/statusNow'
import robbingMore from '@/components/robbing/robbingMore'
import findProHis from '@/components/robbing/findProHis'
import robbingYesNo from '@/components/robbing/robbingYesNo'
import getOrderSet from '@/components/robbing/getOrderSet'
import settlementYes from '@/components/settlementBox/settlementYes'
Vue.use(Router);

Vue.directive('title', {
  inserted: function (el, binding) {
    document.title = el.dataset.title
    document.getElementById('title').innerText = document.title
  }
});
Vue.filter('toThousands',function (num) {
  var number = num.toString().split(".");
  number[0] =  (number[0] || 0).replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
  return number.join(".");
})
Vue.filter('carrierTime',function (value) {
   value = value.split(".")[0];
   var valTime = value.split(" ")[0];
   var newDate = new Date();
   if(new Date(valTime.replace(/-/g,'/')).getTime() == new Date(newDate.getFullYear() + '/' + (newDate.getMonth() + 1 ) + '/' + newDate.getDate()).getTime()){
     return "今天装货";
   }else if(new Date(valTime.replace(/-/g,'/')).getTime()  -  new Date(newDate.getFullYear() + '/' + (newDate.getMonth() + 1 ) + '/' + newDate.getDate()).getTime() == 24*60*60*1000){
     return "明天装货";
   }else{
      return value;
   }

})
Vue.filter('nameCheck',function (value) {
  var list = value.split("");
  var name = "";
  for(var i = 0 ; i < list.length;i++){
    if(list[i] != ""){
      if(i == 0){
        name += list[i];
      }else{
        name += "*";
      }
    }
  }
  return name;
})
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
    case 55:
      valueTypeName = "已回单";
      break;
    case 60:
      valueTypeName = "已拒绝";
      break;
  }
  return valueTypeName
});

export default new Router(
  {
  routes: [
    {
      path:'/lookImg',
      name:'lookImg',
      component:lookImg,
    },
    {
      path:'/searchDayOrder',
      name:'searchDayOrder',
      component:searchDayOrder,
    },
    {
      path:'/paddingTrack',
      name:'paddingTrack',
      component:paddingTrack,
    },
    {
      path:'/getOrderSet',
      name:'getOrderSet',
      component:getOrderSet,
    },
    {
      path:'/taskMoreHomePage',
      name:'taskMoreHomePage',
      component:taskMoreHomePage,
    },
    {
      path:'/upProductImg',
      name:'upProductImg',
      component:upProductImg,
    },
    {
      path:'/settlementYes',
      name:'settlementYes',
      component:settlementYes,
    },
    {
      path:'/settlementCenter',
      name:'settlementCenter',
      component:settlementCenter,
    },
    {
      path:'/histroyTrack',
      name:'histroyTrack',
      component:histroyTrack,
    },
    {
      path:'/robbingYesNo',
      name:'robbingYesNo',
      component:robbingYesNo,
    },
    {
      path:'/findProHis',
      name:'findProHis',
      component:findProHis,
    },
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
      path:'/robbingList',
      name:'robbingList',
      component:robbingList,
    },
    {
      path:'/robbingMore',
      name:'robbingMore',
      component:robbingMore,
    },
    {
      path:'/message',
      name:'message',
      component:message,
    },
    {
      path:'/secondmessage',
      name:'secondmessage',
      component:secondmessage,
    },
    {
      path:'/Secondmessage',
      name:'Secondmessage',
      component:Secondmessage,
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
        {path: 'trackMore2', component: trackMore2},
        {path: 'electronicReceipt', component: electronicReceipt},
        {path: 'drawname', component: drawname},
        {path: 'map', component: trackS},
        {path: 'qrcode', component: trackT},
        {path:'uploadBill',component:trackFo},
        {path:'uploadImg',component:trackSi}
      ]
    }
  ]
})
