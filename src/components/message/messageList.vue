<template>
 <div id="messageList">
    <div id="title" v-title data-title="消息列表"></div>
     <div id="mescroll" class="mescroll">
       <ul id="dataList" class="data-list">
         <li v-for="item in messageList">
           <p>{{item.title}}</p>
           <h1 v-html="item.time"></h1>
           <div class="clearBoth"></div>
           <div class="body">
               {{item.content}}
           </div>
         </li>
       </ul>
     </div>
  </div>
</template>

<script>
  import {androidIos} from "../../js/app";
  import {bomb} from "../../js/zujian";
  import bridge from '../../js/bridge';
  import MeScroll from '../../js/mescroll'
  import {iscroll} from '../../js/iscroll'
  var thisThat;
    export default {
        name: "message-list",
        data(){
          return{
            messageList:[],
            type:1,
            mescroll:null,
          }
        },
       mounted:function () {
         var _this = this;
        androidIos.bridge(_this);
       },
      methods:{
          go:function () {
             var _this = this;
            thisThat = _this;
             _this.type = _this.$route.query.type;
            _this.mescroll = new MeScroll("mescroll", { //请至少在vue的mounted生命周期初始化mescroll,以确保您配置的id能够被找到
              up: {
                callback: _this.upCallback, //上拉回调
                isBounce: false, //此处禁止ios回弹,解析(务必认真阅读,特别是最后一点): http://www.mescroll.com/qa.html#q10
                empty:{ //配置列表无任何数据的提示
                  warpId:"dataList",
                  icon : require("../../images/nojilu.png") ,
   						  	tip : "暂无消息~" ,
                },
                lazyLoad: {
                  use: true // 是否开启懒加载,默认false
                }
              }
            });
          },
        upCallback: function(page) {
          //联网加载数据
          var self = this;
          getListDataFromNet(page.num, page.size, function(curPageData) {
            if(page.num == 1) self.messageList = [];

            self.messageList = self.messageList.concat(curPageData);
            self.mescroll.endSuccess(curPageData.length);
          }, function() {
            //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
            self.mescroll.endErr();
          });
        },
        ten:function (number) {
          return number - 10 < 0 ? "0" + number : number;
        }
      }
    }
  function getListDataFromNet(pageNum,pageSize,successCallback,errorCallback) {
    //延时一秒,模拟联网
    setTimeout(function () {
        $.ajax({
          type: "POST",
          url: androidIos.ajaxHttp()+"/settings/getBulletin",
          data:JSON.stringify({userCode:sessionStorage.getItem("token"),source:sessionStorage.getItem("source")}),
          contentType: "application/json;charset=utf-8",
          dataType: "json",
          timeout: 30000,
          success: function (getBulletin) {
            if (getBulletin.success == "1") {
              for(var i = 0;i < getBulletin.list.length;i++){
                getBulletin.list[i].time = getBulletin.list[i].time.split(".")[0];
               }
              successCallback&&successCallback(getBulletin.list);//成功回调
            }else{
              androidIos.second(getBulletin.message);
            }
          },
          complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
            if(status=='timeout'){//超时,status还有success,error等值的情况
              androidIos.second("网络请求超时");
            }else if(status=='error'){
              androidIos.errorwife();
            }
          }
        })
    },500)
  }
</script>

<style scoped>
  #messageList{
    background: #f6f6f6;
    position: absolute;
    top:1.3rem;
    bottom:0;
    height: auto;
    width:100%;
  }
#mescroll{
  position: absolute;
  top:0.4rem;
  bottom:0;
  height: auto;
  width:100%;
}
#mescroll li{
  width:86%;
  padding: 0.3rem 0.3rem ;
  margin:0rem auto 0.3rem auto ;
  background: white;
  border-radius: 0.3rem;
  box-shadow:0px 5px 5px 0px rgba(0,0,0,0.1);
}
#mescroll li p{
   font-size:0.37rem ;
   color:#606060;
   line-height:0.4rem ;
  float: left;
}
#mescroll li h1{
  font-size:0.3125rem ;
  color:#606060;
  line-height:0.4rem ;
  float: right;
}
#mescroll li .body{
  font-size:0.35rem ;
  color:#606060;
  width:8.5rem;
  margin: 0.4rem auto 0 auto;
  padding: 0.15rem 0.15rem;
  background:#f9f9f9 ;
  line-height: 0.65rem;
  border-radius: 0.1rem;
  }
</style>
