<template>
    <div id="settlementYes" style="top:1.3rem">
       <div id="title" v-title data-title="已收款"></div>
       <ul id="tabEnter">
         <li v-for="(item,index) in list" :class="item.check ? 'checked':''"  :i="index" :style="{width:10/list.length + 'rem'}">
            <div class="imgTab" :style="{backgroundImage : item.icon != '' ? 'url(' + item.icon+ ')' : 'none'}">
              <h1 v-if="item.number > 0 ">{{item.number | toThousands}}</h1>
            </div>
           <p>{{item.name}}</p>
         </li>
         <div class="clearBoth"></div>
       </ul>
      <div v-for="(item,index) in list" :id="'mescroll' + index" :class="index != tabShow ? 'hide' :''" class="mescroll">
        <ul :id="'dataList' + index" class="data-list">
          <li v-for="(items,indexs) in item.prolist" @click="lookTrackMore(items.pkInvoice)">
            <h1>{{items.vbillno}}</h1>
            <h3>已完成</h3>
            <h4>￥{{items.price | toThousands}}</h4>
            <div class="clearBoth"></div>
          </li>
        </ul>
      </div>
    </div>
</template>

<script>
  import "../../js/navbarscroll";
  import {androidIos} from "../../js/app";
  import {bomb} from "../../js/zujian";
  import bridge from '../../js/bridge';
  import MeScroll from '../../js/mescroll'
  import {iscroll} from '../../js/iscroll'
    export default {
        name: "settlement-yes",
        data(){
          return{
            list:[{
              name:"今日收入",
              number:2525.33,
              prolist:[],
              icon:"",
              check:false,
            },{
              name:"历史账单",
              number:0,
              prolist:[],
              icon:require("../../images/icon-histroyOrderPrice.png"),
              check:false,
            }],
            tabShow:0,
          }
        },
      mounted:function () {
        var _this = this;
        androidIos.judgeIphoneX("settlementYes",2);
        sessionStorage.removeItem("weh");
        sessionStorage.removeItem("nowOrderCartype");
        sessionStorage.removeItem("dataStart");
        sessionStorage.removeItem("dataEnd");
        sessionStorage.removeItem("orderPk");
        sessionStorage.removeItem("dispatchPK");
        sessionStorage.removeItem("carPKlistGo");
        sessionStorage.removeItem("driverPk");
        sessionStorage.removeItem("ORDERSCREEN");
        sessionStorage.removeItem("histroyTrackTap");
        var settlementYesTap = sessionStorage.getItem("settlementYesTap");
        if(settlementYesTap != null){
          _this.tabShow = settlementYesTap;
          sessionStorage.removeItem("settlementYesTap");
        }
        _this.list[_this.tabShow].check = true;
        androidIos.bridge(_this);
      },
      methods:{
        go:function () {
             var _this = this;
             var curNavIndex = _this.tabShow;
             var mescrollArr=new Array(_this.list.length);//4个菜单所对应的4个mescroll对象
             //初始化首页
             mescrollArr[_this.tabShow]=initMescroll("mescroll" + _this.tabShow, "dataList" + _this.tabShow);

             /*初始化菜单*/
             $("#tabEnter li").click(function(){
               var i=Number($(this).attr("i"));
               sessionStorage.setItem("settlementYesTap",i);
               for(var x = 0 ; x < _this.list.length;x++){
                 _this.list[x].check = false;
               }
               _this.list[i].check = true;
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
                     icon: require("../../images/nojilu.png"),
                     tip: "暂无记录", //提示
                   },
                   clearEmptyId: clearEmptyId, //相当于同时设置了clearId和empty.warpId; 简化写法;默认null; 注意vue中不能配置此项
                   toTop:{ //配置回到顶部按钮
                     src :require("../../images/scrollTop.png"), //默认滚动到1000px显示,可配置offset修改
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
                 var status = JSON.parse(sessionStorage.getItem("driverMessage")).status;
                 if(status == 2){
                   $.ajax({
                     type: "POST",
                     url: androidIos.ajaxHttp() + "/order/loadEntrust",
                     data:JSON.stringify({
                       page:pageNum,
                       size:pageSize,
                       type:1,
                       state: '7',
                       userCode:sessionStorage.getItem("token"),
                       source:sessionStorage.getItem("source")
                     }),
                     contentType: "application/json;charset=utf-8",
                     dataType: "json",
                     timeout: 30000,
                     success: function (loadEntrust) {
                       if (loadEntrust.success == "1") {
                         for(var i = 0 ;i < loadEntrust.list.length;i++){
                           loadEntrust.list[i].price = 100 + i;
                         }
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
      }
    }
</script>
<style>
  @import "../../css/mescroll.css";
  @import "../../css/scroll.css";
  #settlementYes .hide{
    display: none;
  }
</style>
<style scoped>
  #settlementYes{
    position:absolute;
    top:1.3rem;
    bottom:0;
    height: auto;
    width:100%;
    background: #f6f6f6;
  }
  #tabEnter{
    width:100%;
    background: white;
  }
  #tabEnter li{
    float: left;
    padding: 0.375rem 0 0.26rem 0;
  }
  .imgTab{
     background-size:0.636744rem ;
    background-position: 50% 0;
    background-repeat: no-repeat;
    height:0.74rem ;
    text-align: center;
    color:#999999;
    font-size: 0.6rem;
    line-height: 0.74rem;
  }
  #tabEnter li p {
    text-align: center;
    color:#999999;
    font-size: 0.4rem;
  }
  .mescroll{
    position: absolute;
    top:2.24rem;
    bottom:0rem;
    height: auto!important;
  }
  .data-list{
    width:100%;
  }
  .data-list li{
    width:100%;
    background: white;
    height: 1.28rem;
    border-radius:0.16rem;
    position: relative;
    margin-bottom: 1px;
    background-image: url("../../images/lookMore2.png");
    background-position: 95% 50%;
    background-repeat: no-repeat;
    background-size:0.2216rem ;
  }
  .data-list li h1{
    font-size:0.375rem ;
    color:#373737;
    margin-left: 0.375rem;
    line-height: 1.28rem;
    float: left;
  }
  .data-list li h4{
    font-size:0.375rem ;
    color:#FA6B18;
    margin-left: 1.25rem;
    line-height: 1.28rem;
    float: left;
  }
  .data-list li h3{
    font-size:0.375rem ;
    color:#373737;
    margin-left: 1.25rem;
    line-height: 1.28rem;
    float: left;
  }

  .startEnd img{
    display: inline-block;
    margin:0rem 0.3rem 0.13rem 0.3rem;
    width:0.45rem;
  }

  .checked p{
     color:#1869A9!important;
  }
  .checked .imgTab{
    color:#1869A9!important;
    background-position: 50% 100%!important;
  }
</style>
