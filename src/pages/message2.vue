<template>
  <div id="message" style="top:1.3rem;">
    <div id="title" v-title data-title="消息"></div>
    <div class="wrapper" id="trackTab">
      <div class="scroller">
        <ul class="clearfix">
          <li  tapmode="" v-for="(item,index) in messageList" :style="{width : 10 / messageList.length + 'rem'}" :i="index">
            <div class="imglistBox" :style="{backgroundImage:'url('+item.icon+')'}"></div>
            <a href="javascript:void(0)">{{item.name}}</a>
          </li>
        </ul>
      </div>
    </div>
    <div v-for="(item,index) in messageList" :id="'mescroll' + index" :class="index != tabShow ? 'hide' :''" class="mescroll">
      <ul v-if="index == 0" :id="'dataList' + index" class="data-list">
        <li v-for="(items,indexs) in item.prolist" @click="lookYes(indexs,items.pk)">
          <p :style="{paddingLeft: items.readBy == 0 ? '0.2rem' : '0rem'}"><span class="noread" v-if="items.readBy == 0"></span>承运商更换司机</p>
          <h1 v-html="items.tackingTime"></h1>
          <div class="clearBoth"></div>
          <div class="body">
            {{items.tackingMemo}}
          </div>
        </li>
      </ul>
      <ul v-if="index == 1" :id="'dataList' + index" class="data-list">
        <li v-for="(items,indexs) in item.prolist" >
          <p>{{items.title}}</p>
          <h1 v-html="items.time"></h1>
          <div class="clearBoth"></div>
          <div class="body">
            {{items.content}}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import {androidIos} from "../js/app";
  import {bomb} from "../js/zujian";
  import bridge from '../js/bridge';
  import "../js/navbarscroll";
  import MeScroll from '../js/mescroll'
  import {iscroll} from '../js/iscroll'
  export default {
    name: "message",
    data(){
      return{
        messageList:[{
          name : "运单物流",
          type:1,
          icon:require("../images/messageyundanwuliu.png"),
          number:0,
          prolist:[]
        },{
          name : "系统信息",
          type:2,
          icon:require("../images/messagesystemInformation.png"),
          number:0,
          prolist:[]
        }],
        tabShow:0,
        ajax1:null,
        settime:null,
      }
    },
    mounted:function () {
      var _this = this;
      androidIos.judgeIphoneX("message",2);
      androidIos.judgeIphoneX("mescroll",1);
      androidIos.bridge(_this);
    },
    methods:{
      lookYes:function (index,pk) {
        var _this = this;
        if(_this.messageList[0].prolist[index].readBy == 0){
          $.ajax({
            type: "POST",
            url: androidIos.ajaxHttp() + "/order/driverMessageRead",
            data:JSON.stringify({
              pk:pk,
              userCode: sessionStorage.getItem("token"),
              source:sessionStorage.getItem("source")
            }),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            timeout: 30000,
            success: function (driverMessageRead) {
              if (driverMessageRead.success == "1") {
                _this.messageList[0].prolist[index].readBy = 1;
              }else{
                androidIos.second(driverMessageRead.message);
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
        }

      },
      go:function () {
        var _this = this;
        var messageTap = sessionStorage.getItem("messageTap");
        if(messageTap != undefined){
          _this.tabShow = messageTap*1;
        }
        $('.wrapper').navbarscroll({defaultSelect:_this.tabShow});
        var curNavIndex = _this.tabShow;//首页0; 奶粉1; 面膜2; 图书3;
        var mescrollArr=new Array(_this.messageList.length);//4个菜单所对应的4个mescroll对象
        //初始化首页
        mescrollArr[_this.tabShow]=initMescroll("mescroll" + _this.tabShow, "dataList" + _this.tabShow);

        /*初始化菜单*/
        $("#trackTab li").on("touchend",function(){
          var i=Number($(this).attr("i"));
          sessionStorage.setItem("messageTap",i);
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
          }else{
            $(".mescroll-totop").hide();
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
                tip: "暂无消息", //提示
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
            _this.messageList[dataIndex].prolist.push(pageData[i]);
          }
        }
        function getListDataFromNet(curNavIndex,pageNum,pageSize,successCallback,errorCallback) {
          //延时一秒,模拟联网
          _this.settime = setTimeout(function () {
            var http = curNavIndex == 0 ? "/order/driverMessage" :"/settings/getBulletin" ;
            _this.ajax1 = $.ajax({
              type: "POST",
              url: androidIos.ajaxHttp() + http,
              data:JSON.stringify({
                page:pageNum,
                size:pageSize,
                userCode: sessionStorage.getItem("token"),
                source:sessionStorage.getItem("source")
              }),
              contentType: "application/json;charset=utf-8",
              dataType: "json",
              timeout: 30000,
              success: function (loadInvoice) {
                if (loadInvoice.success == "1") {
                  successCallback(loadInvoice.list);
                }else{
                  androidIos.second(loadInvoice.message);
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
          },100)
        }
      },
      marginWidth:function () {
        var _this = this;
        var corner = document.getElementsByClassName("messageCorner");
        for(var i = 0; i< corner.length;i++){
          var width = corner[i].scrollWidth;
          corner[i].style.marginRight = - width / (2*(_this.htmlSize())) + 0.05+ "rem";
        }
      },
      htmlSize:function () {
        return document.getElementsByTagName("html")[0].style.fontSize.replace("px","");
      }
    },
    beforeDestroy:function () {
      var _this = this;
      clearTimeout(_this.settime);
      if(_this.ajax1 != null){
        _this.ajax1.abort();
      }
    },
    destroy:function () {
      var _this = this;
      clearTimeout(_this.settime);
      if(_this.ajax1 != null){
        _this.ajax1.abort();
      }
    }
  }
</script>
<style>
  @import "../css/mescroll.css";
  @import "../css/scroll.css";
  #message .hide{
    display: none;
  }
</style>
<style scoped>
  #message{
    background: #f6f6f6;
    position:absolute;
    top:1.3rem;
    bottom:0;
    height: auto;
    width:100%;
  }
  .wrapper {
    position:relative;
    height: 1.78rem;
    width: 100%;
    margin:0 auto;
    background:white;
    border-top: 2px solid #E5E5E5;
  }
  .wrapper .scroller {
    position:absolute;
  }
  .wrapper .scroller li {
    height: 1.78rem;
    color:#373737;
    float: left;
    line-height: 0.7rem;
    font-size: .4rem;
    text-align: center;
    width:3.333333rem;
  }
  .wrapper .scroller li a{
    color:#999;
    display:block;
    font-size: 0.375rem;
    margin:0 0.1rem;
  }
  .wrapper .scroller li a span{
    color:#1D68A8;
    font-size: 0.3125rem;
  }
  .wrapper .scroller li.cur a{
    color:#1D68A8;
  }
  .wrapper .scroller li .imglistBox{
    width:0.53rem;
    height:0.53rem;
    background-repeat: no-repeat;
    background-size: 0.53rem;
    background-position: 0 100% ;
    margin: 0.45rem auto 0 auto;
  }
  .wrapper .scroller li.cur .imglistBox{
    background-position: 0 0 ;
  }
  .mescroll{
    position: absolute;
    top:1.78rem;
    bottom:0rem;
    height: auto!important;
  }
  .data-list{
    width:100%;
  }
  .data-list li{
    width: 88%;
    margin: 0.33rem auto 0 auto;
    padding:0.33rem 0.24rem;
    background: white;
    border-radius: 0.2rem;
  }
  .data-list li p{
    font-size:0.375rem ;
    float: left;
    color:#2c2c2c;
    position: relative;
  }
  .data-list li h6{
    font-size:0.3125rem ;
    float: right;
    color:#999;
  }
  .orderBox{
    width:94%;
    margin-top:0.34rem ;
    background: #F9F9F9;
    border-radius: 0.2rem;
    padding: 0.2rem 3%;
  }
  .orderBox h1,.orderBox h2,.orderBox h3 span{
    color:#2C2C2C;
    font-size: 0.345rem;
    margin-bottom: 0.1rem;
  }
  .noread{
    position: absolute;
    width:0.18rem;
    height: 0.18rem;
    border-radius: 50%;
    background: #E1473C;
    top:50%;
    margin-top:-0.09rem;
    left:0;
  }
  .data-list li{
    width:86%;
    padding: 0.3rem 0.3rem ;
    margin:0.3rem auto 0rem auto ;
    background: white;
    border-radius: 0.3rem;
    box-shadow:0px 5px 5px 0px rgba(0,0,0,0.1);
  }
  .data-list li p{
    font-size:0.37rem ;
    color:#606060;
    line-height:0.4rem ;
    float: left;
  }
  .data-list li h1{
    font-size:0.3125rem ;
    color:#606060;
    line-height:0.4rem ;
    float: right;
  }
  .data-list li .body{
    font-size:0.35rem ;
    color:#606060;
    width:97%;
    margin: 0.4rem auto 0 auto;
    padding: 0.15rem 0.15rem;
    background:#f9f9f9 ;
    line-height: 0.65rem;
    border-radius: 0.1rem;
  }
  .noread{
    position: absolute;
    width:0.18rem;
    height: 0.18rem;
    border-radius: 50%;
    background: #E1473C;
    top:50%;
    margin-top:-0.09rem;
    left:0;
  }
</style>
