<template>
  <div id="orderScreen">
    <div id="title" v-title data-title="发货地址"></div>
    <div id="carTitleBox"   @click="event($event)">
      <div class="carTitleBox">
        <div class="carTitleback" @click="goback()"></div>
        <input type="text" placeholder="请输入订单号"  id="carNumber" v-model="address"  @focus="aaa()">
        <p @click="sousuo()" id="sousuo">搜索</p>
      </div>
    </div>
    <div id="mescroll" class="mescroll">
      <ul id="dataList" class="data-list">
        <li v-for="(items,indexs) in pdlist" @click="lookTrackMore(items.pkInvoice)">
          <h3 v-html="items.status == 10 ? '已确认': items.status == 20 ? '司机出发': items.status == 31 ? '提货到达': items.status == 32 ? '开始装货': items.status == 33 ? '装货完毕': items.status == 41 ? '运输到达': items.status == 42 ? '开始卸货': items.status == 43 ? '卸货完毕': items.status == 50 ? '已签收': ''"></h3>
          <h6 class="deliDateTime">{{items.deliDate}}</h6>
          <h6 class="arriDateTime">{{items.arriDate}}</h6>
          <div class="proBox">
            <p class="startEnd"><span class="startEndSpan">{{items.deliAddr}}<img src="../../images/addressImg.png">{{items.arriAddr}}</span><div class="clearBoth"></div></p>
            <div class="proBoxList" v-for="(pro,proIndex) in items.itemDaos">{{pro.goodsCode}}/{{pro.goodsName}}/{{pro.num}}件/{{pro.weight*1}}吨/{{pro.volume*1}}立方米</div>
          </div>
          <h1>订单编号：{{items.vbillno}}</h1>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import MeScroll from '../../js/mescroll'
  import {iscroll} from '../../js/iscroll'
  import {androidIos} from "../../js/app";
  import {bomb} from "../../js/zujian";
  var thisthatsecond;
  export default {
    name: "orderScreen",
    data(){
      return{
        pdlist:[],
        address:"",
        pk:"",
        size:"",
        number:"",
        manage:false,
        addressType:"",
        total:100,
      }
    },
    mounted:function () {
      var _this = this;
      _this.addressType = _this.$route.query.type;
      androidIos.bridge(_this);
    },
    methods:{
      go:function () {
        var self = this;
        thisthatsecond = self;
        var ORDERSCREEN = sessionStorage.getItem("ORDERSCREEN");
        if( ORDERSCREEN != null){
          self.address = ORDERSCREEN;
        }
        self.mescroll = new MeScroll("mescroll", { //请至少在vue的mounted生命周期初始化mescroll,以确保您配置的id能够被找到
          up: {
            callback: self.upCallback, //上拉回调
            isBounce: false, //此处禁止ios回弹,解析(务必认真阅读,特别是最后一点): http://www.mescroll.com/qa.html#q10
            empty:{
              warpId:'mescroll',
              icon:require('../../images/nojilu.png'),
              tip:"暂无此订单~"
            },
            page: {
              num: 0, //当前页码,默认0,回调之前会加1,即callback(page)会从1开始
              size: 10, //每页数据的数量
            }
          },
          down: {
            offset: 2.1 * $("html").css("font-size").replace("px", ""),
          }
        });
      },
      aaa:function(){
        $("#orderScreen #carTitleBox").css("z-index","100");
        document.getElementById("sousuo").innerText = "搜索";
      },
      event:function (e) {
        var _this = this;
        if($("#orderScreen #carTitleBox").css("z-index")=="100"){
          if(e.target.id=="carTitleBox"){
            $("#orderScreen #carTitleBox").css("z-index","0");
            _this.pdlist = [];
            _this.mescroll.resetUpScroll();
          }
        }
      },
      sousuo:function(){
        var _this = this;
        $("#orderScreen #carTitleBox").css("z-index","0");
        _this.pdlist = [];
        _this.mescroll.resetUpScroll();
      },
      upCallback: function(page) {
        //联网加载数据
        var self = this;
        getListDataFromNet(page.num, page.size, function(curPageData) {
          //curPageData=[]; //打开本行注释,可演示列表无任何数据empty的配置

          //如果是第一页需手动制空列表 (代替clearId和clearEmptyId的配置)
          if(page.num == 1) self.pdlist = [];
          self.number = page.num;
          self.size = page.size;
          //更新列表数据
          self.pdlist = self.pdlist.concat(curPageData);
          self.mescroll.endSuccess(curPageData.length);
          self.$nextTick(function () {
            $("#addressMessage .secondBox").css("height","50%");
          })

        }, function() {
          //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          self.mescroll.endErr();
        });
      },
      goback:function () {
        androidIos.gobackFrom(this);
      },
      lookTrackMore:function (pk) {
        var _this = this;
        sessionStorage.setItem("ORDERSCREEN",_this.address);
        androidIos.addPageList();
        _this.$router.push({ path: '/track/trackMore',query:{pk:pk,pt:2}});
      },
    }
  }
  function getListDataFromNet(pageNum,pageSize,successCallback,errorCallback) {
    //延时一秒,模拟联网
    setTimeout(function () {
      $.ajax({
        type: "POST",
        url: androidIos.ajaxHttp() + "/order/loadEntrust",
        data:JSON.stringify({
          page:pageNum,
          size:pageSize,
          type:0,
          state:0,
          userCode:sessionStorage.getItem("token"),
          source:sessionStorage.getItem("source"),
          keyword:thisthatsecond.address == "" ? "HDSDDD" : androidIos.checkText(thisthatsecond.address),
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
    },500)
  }
</script>

<style >
  @import "../../css/mescroll.css";
  @import "../../css/scroll.css";
  #orderScreen .carTitleBox{
    width: 100%;
    position: absolute;
    top: 0;
    height: 1.25rem;
    background: white;
  }
  #orderScreen .carTitleback{
    position: absolute;
    left:0;
    top:0;
    bottom: 0;
    height: auto;
    width: 1.5rem;
    background-image: url("../../images/titlejian.png");
    background-position: 35% 50%;
    background-repeat: no-repeat;
    background-size: 0.2rem 0.3714rem;
  }
  #orderScreen #carTitleBox{
    position: absolute;
    top:0;
    left:0;
    bottom:0;
    right:0;
    background: rgba(0,0,0,0.2);
    width:auto;
    height: auto;
    z-index:0;
  }
  #orderScreen .carTitleBox p {
    position: absolute;
    right:0;
    top:0;
    line-height: 1.25rem;
    color:#333;
    margin-right: 2%;
    font-size: 0.35rem;
  }
  #orderScreen .carTitleBox input{
    display: block;
    width:50%;
    background-color: #f2f2f2;
    border:1px solid #eaeaea;
    color:#333;
    padding: 0.15rem 0;
    margin-top:0.225rem;
    margin-left:2rem;
    font-size: 0.36rem;
    border-radius: 0.45rem;
    text-align: left;
    padding-left: 10%;
    background-image: url("../../images/sousuo.png");
    background-position: 6% 50%;
    background-repeat: no-repeat;
    background-size: 0.4133rem 0.4rem;
  }
  #orderScreen .mescroll{
    position: fixed;
    top:1.3rem;
    bottom:0rem;
    height: auto;
    background-color: rgb(245, 245, 249)!important;
  }
</style>
<style scoped>
  #orderScreen{
    position:absolute;
    top:0rem;
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
    background-image: url("../../images/pickmessage.png");
  }
  .arriDateTime{
    background-image: url("../../images/arrmessage.png");
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
