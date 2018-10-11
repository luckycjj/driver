<template>
  <div id="trackList">
    <div id="title" v-title data-title="订单"></div>
    <div id="showBox">
      <div class="wrapper" id="trackTab">
        <div class="scroller">
          <ul class="clearfix">
            <li v-for="(item,index) in list" :i="index"><a href="javascript:void(0)">{{item.name}}<span v-if="item.number*1 > 0">{{item.number}}</span></a></li>
          </ul>
        </div>
      </div>
      <div v-for="(item,index) in list" :id="'mescroll' + index" :class="index != tabShow ? 'hide' :''" class="mescroll">
        <ul :id="'dataList' + index" class="data-list">
          <li v-for="(items,indexs) in item.prolist" @click="lookTrackMore(items.pkInvoice)">
            <h3 v-html="items.status == 10 ? '已确认': items.status == 20 ? '司机出发': items.status == 31 ? '提货到达': items.status == 32 ? '开始装货': items.status == 33 ? '装货完毕': items.status == 41 ? '运输到达': items.status == 42 ? '开始卸货': items.status == 43 ? '卸货完毕': items.status == 50 ? '已签收': ''"></h3>
            <h6 class="deliDateTime">{{items.deliDate}}</h6>
            <h6 class="arriDateTime">{{items.arriDate}}</h6>
            <div class="proBox">
              <p class="startEnd"><span class="startEndSpan">{{items.deliAddr}}<img src="../images/addressImg.png">{{items.arriAddr}}</span><div class="clearBoth"></div></p>
              <div class="proBoxList" v-for="(pro,proIndex) in items.itemDaos">{{pro.goodsCode}}/{{pro.goodsName}}/{{pro.num}}件/{{pro.weight*1}}吨/{{pro.volume*1}}立方米</div>
            </div>
            <h1>订单编号：{{items.vbillno}}</h1>
          </li>
        </ul>
      </div>
    </div>
    <footComponent ref="footcomponent" :idx='0'></footComponent>
  </div>
</template>

<script>
   import "../js/navbarscroll";
   import {androidIos} from "../js/app";
   import {bomb} from "../js/zujian";
   import bridge from '../js/bridge';
   import MeScroll from '../js/mescroll'
   import {iscroll} from '../js/iscroll'
    export default {
        name: "track-list",
       data(){
          return{
             list:[{
                name:"全部",
                number:0,
                prolist:[]
             },{
               name:"未运输",
               number:0,
               prolist:[]
             },{
               name:"在途中",
               number:0,
               prolist:[]
             },{
               name:"已到货",
               number:0,
               prolist:[]
             },{
               name:"已完成",
               number:0,
               prolist:[]
             }],
            tabShow:0,
          }
       },
       mounted:function () {
         var _this = this;
         sessionStorage.removeItem("weh");
         sessionStorage.removeItem("nowOrderCartype");
         sessionStorage.removeItem("dataStart");
         sessionStorage.removeItem("dataEnd");
         sessionStorage.removeItem("orderPk");
         sessionStorage.removeItem("dispatchPK");
         sessionStorage.removeItem("carPKlistGo");
         sessionStorage.removeItem("driverPk");
         sessionStorage.removeItem("ORDERSCREEN");
         androidIos.bridge(_this);
       },
       methods:{
         go:function () {
             var _this = this;
             _this.corner();
             var trackTap = sessionStorage.getItem("trackTap");
             if(trackTap != undefined){
                _this.tabShow = trackTap*1;
             }
            $('.wrapper').navbarscroll({defaultSelect:_this.tabShow});
             var curNavIndex = _this.tabShow;//首页0; 奶粉1; 面膜2; 图书3;
             var mescrollArr=new Array(_this.list.length);//4个菜单所对应的4个mescroll对象
             //初始化首页
             mescrollArr[_this.tabShow]=initMescroll("mescroll" + _this.tabShow, "dataList" + _this.tabShow);

             /*初始化菜单*/
             $("#trackTab li").click(function(){
               var i=Number($(this).attr("i"));
               sessionStorage.setItem("trackTap",i);
               if(curNavIndex!=i) {
                 //更改列表条件
                 //隐藏当前列表和回到顶部按钮
                 $("#mescroll"+curNavIndex).hide();
                 mescrollArr[curNavIndex].hideTopBtn();
                 //显示对应的列表
                 $("#mescroll"+i).show();
                 //取出菜单所对应的mescroll对象,如果未初始化则初始化
                 if(mescrollArr[i]==null){
                   mescrollArr[i]=initMescroll("mescroll"+i, "dataList"+i);
                 }else{
                   //检查是否需要显示回到到顶按钮
                   var curMescroll=mescrollArr[i];
                   var curScrollTop=curMescroll.getScrollTop();
                   if(curScrollTop>=curMescroll.optUp.toTop.offset){
                     curMescroll.showTopBtn();
                   }else{
                     curMescroll.hideTopBtn();
                   }
                 }
                 //更新标记
                 curNavIndex=i;
               }
             })

             /*创建MeScroll对象*/
             function initMescroll(mescrollId,clearEmptyId){
               //创建MeScroll对象,内部已默认开启下拉刷新,自动执行up.callback,刷新列表数据;
               var mescroll = new MeScroll(mescrollId, {
                 //上拉加载的配置项
                 up: {
                   callback: getListData, //上拉回调,此处可简写; 相当于 callback: function (page) { getListData(page); }
                   isBounce: false, //此处禁止ios回弹,解析(务必认真阅读,特别是最后一点): http://www.mescroll.com/qa.html#q10
                   noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
                   empty: {
                     icon: require("../images/nojilu.png"),
                     tip: "暂无订单", //提示
                   },
                   clearEmptyId: clearEmptyId, //相当于同时设置了clearId和empty.warpId; 简化写法;默认null; 注意vue中不能配置此项
                   toTop:{ //配置回到顶部按钮
                     src :require("../images/scrollTop.png"), //默认滚动到1000px显示,可配置offset修改
                     //offset : 1000
                   },
                   lazyLoad: {
                     use: true // 是否开启懒加载,默认false
                   }
                 }
               });
               return mescroll;
             }

             /*联网加载列表数据  page = {num:1, size:10}; num:当前页 从1开始, size:每页数据条数 */
             function getListData(page){
               //联网加载数据
               var dataIndex=curNavIndex; //记录当前联网的nav下标,防止快速切换时,联网回来curNavIndex已经改变的情况;
               getListDataFromNet(dataIndex, page.num, page.size, function(pageData){
                mescrollArr[dataIndex].endSuccess(pageData.length);
                 setListData(pageData,dataIndex);
               }, function(){
                 //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
                 mescrollArr[dataIndex].endErr();
               });
             }
             function setListData(pageData,dataIndex){
               for (var i = 0; i < pageData.length; i++) {
                 _this.list[dataIndex].prolist.push(pageData[i]);
               }
             }
             function getListDataFromNet(curNavIndex,pageNum,pageSize,successCallback,errorCallback) {
               //延时一秒,模拟联网
               setTimeout(function () {
                 if(pageNum == 1){
                   _this.$refs.footcomponent.go();
                 }
                 var status = JSON.parse(androidIos.getcookie("MESSAGEDRIVER")).status;
                 if(status != 0){
                   $.ajax({
                     type: "POST",
                     url: androidIos.ajaxHttp() + "/order/loadEntrust",
                     data:JSON.stringify({
                       page:pageNum,
                       size:pageSize,
                       type:1,
                       state:curNavIndex,
                       userCode:sessionStorage.getItem("token"),
                       source:sessionStorage.getItem("source")
                     }),
                     contentType: "application/json;charset=utf-8",
                     dataType: "json",
                     timeout: 30000,
                     success: function (loadEntrust) {
                       if (loadEntrust.success == "1") {
                         successCallback(loadEntrust.list);
                       }else{
                         androidIos.second(loadEntrust.message);
                         successCallback([]);
                       }
                     },
                     complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
                       if (status == 'timeout') { //超时,status还有success,error等值的情况
                         androidIos.second("当前状况下网络状态差，请检查网络！");
                         successCallback([]);
                       } else if (status == "error") {
                         androidIos.errorwife();
                         successCallback([]);
                       }
                     }
                   });
                 }else{
                   successCallback([]);
                 }

               },200)
             }
           },
         lookTrackMore:function (pk) {
            var _this = this;
           androidIos.addPageList();
           _this.$router.push({ path: '/track/trackMore',query:{pk:pk,pt:1}});
         },
         corner:function () {
           var _this = this;
           $.ajax({
             type: "POST",
             url: androidIos.ajaxHttp() + "/carrier/carrOrderListHeaderIcon",
             data:JSON.stringify({
               userCode:sessionStorage.getItem("token"),
               source:sessionStorage.getItem("source"),
               type:1,
             }),
             contentType: "application/json;charset=utf-8",
             dataType: "json",
             timeout: 30000,
             success: function (carrOrderListHeaderIcon) {
               if (carrOrderListHeaderIcon.success == "1") {
                 _this.list[0].number = carrOrderListHeaderIcon.notTransportedCount*1 + carrOrderListHeaderIcon.onTheWayCount*1 + carrOrderListHeaderIcon.arrivedCount*1 + carrOrderListHeaderIcon.completedCount*1;
                 _this.list[1].number = carrOrderListHeaderIcon.notTransportedCount*1;
                 _this.list[2].number = carrOrderListHeaderIcon.onTheWayCount*1;
                 _this.list[3].number = carrOrderListHeaderIcon.arrivedCount*1;
                 _this.list[4].number = carrOrderListHeaderIcon.completedCount*1;
               }else{
                 androidIos.second(carrOrderListHeaderIcon.message);
               }
             },
             complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
               if (status == 'timeout') { //超时,status还有success,error等值的情况
                 androidIos.second("当前状况下网络状态差，请检查网络！");
               } else if (status == "error") {
                 androidIos.errorwife();
               }
             }
           });
         },
       },
      beforeDestroy:function () {
        var _this = this;
        var body = document.getElementsByTagName("body")[0];
        var listDom=document.getElementsByClassName("mescroll-totop")[0];
        if(listDom != null){
          body.removeChild(listDom);
        }
      },
      destroy:function () {
        var _this = this;
        var body = document.getElementsByTagName("body")[0];
        var listDom=document.getElementsByClassName("mescroll-totop")[0];
        if(listDom != null){
          body.removeChild(listDom);
        }
      }
    }
</script>
<style>
  @import "../css/mescroll.css";
  @import "../css/scroll.css";
  #trackList .hide{
    display: none;
  }
</style>
<style scoped>
  #trackList{
     position:absolute;
    top:1.3rem;
    bottom:0;
    height: auto;
    width:100%;
    background: #f6f6f6;
  }
  .mescroll{
    position: absolute;
    top:1.2rem;
    bottom:0rem;
    height: auto!important;
  }
  #showBox{
    position: absolute;
    top:0;
    bottom: 1.3rem;
    height: auto;
    width:100%;
  }
  .wrapper {
    position:relative;
    height: 1rem;
    width: 100%;
    margin:0 auto;
    background:white;
    border-top: 2px solid #E5E5E5;
  }
  .wrapper .scroller {
    position:absolute;
  }
  .wrapper .scroller li {
    height: 1rem;
    color:#373737;
    float: left;
    line-height: 1rem;
    font-size: .4rem;
    text-align: center;
    width:2rem;
  }
  .wrapper .scroller li a{
    color:#373737;
    display:block;
    font-size: 0.35rem;
    margin:0 0.1rem;
  }
  .wrapper .scroller li a span{
    color:#2c9cff;
    font-size: 0.3125rem;
  }
  .wrapper .scroller li.cur a{
    color:#2c9cff;
    border-bottom: 1px solid #2c9cff;
  }
.data-list{
  width:100%;
}
  .data-list li{
    width:94%;
    margin: 0.2rem auto 0.08rem;
    background: white;
    border-radius:0.16rem;
    padding:0.4rem 0 ;
    position: relative;
  }
  .data-list li h6{
    font-size:0.32rem ;
    color:#999;
    margin-left: 0.4rem;
    margin-bottom: 0.01rem;
    padding-left: 0.5rem;
    background-repeat: no-repeat;
    background-size:0.213rem 0.213rem ;
    background-position: 0 50%;
  }
  .data-list li h1{
    font-size:0.34rem ;
    color:#999;
    padding-top: 0.2rem;
    margin-left: 0.5rem;
  }
  .data-list li h3{
    position: absolute;
    width:2rem;
    font-size: 0.375rem;
    right:0;
    top:0.6rem;
  }
  .deliDateTime{
    background-image: url("../images/pickmessage.png");
  }
  .arriDateTime{
    background-image: url("../images/arrmessage.png");
  }
  .proBox{
    width:85%;
    padding: 0.5rem 0.45rem;
    margin: 0.2rem auto;
    border-radius: 0.1rem;
    box-shadow: 0 0 0.13rem #e2e2e2;
    border: 1px solid white;
  }
  .startEndSpan{
    float: left;
    font-size: 0.44rem;
    font-weight:bold;
    line-height: 0.56rem;
    color:#333;
    margin-bottom: 0.25rem;

  }
  .startEnd img{
    display: inline-block;
    margin:0rem 0.3rem 0.13rem 0.3rem;
    width:0.45rem;
  }
  .proBoxList{
     color:#999;
    font-size:0.35rem ;
    margin-top: 0.1rem;
  }
</style>
