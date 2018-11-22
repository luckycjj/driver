<template>
  <div id="app" class="bigbigtest appBox">
    <div id="appBox">
    <div id="carTitleBox">
      <div class="carTitleBox">
        <div class="carTitleback" @touchend="goback()" ></div>
        <p>{{title}}</p>
        <h3  id="manage" class="asd"  v-if="doNow==1"><span>管理</span></h3>
        <h3 id="siteCar"  style="display: none" class="asd"  v-if="doNow==2"></h3>
        <h3  id="search" class="asd"  v-if="doNow==3" ><h5 id="searchSpan"></h5></h3>
        <div id="setUp"  v-if="doNow == 5" @touchend="setUpgo()"></div>
        <div id="orderScreenTitle"  v-if="doNow == 6" @touchend="orderScreen()"></div>
        <h3  id="authenticationTab" style="display: none;" class="asd"  v-if="doNow==7"><span>上一步</span></h3>
        <h3  id="upProductImgEnter" style="" class="asd"  v-if="doNow==8"><span style="color:#1869A9">上传</span></h3>
      </div>
      <div id="table"></div>
    </div>
    </div>
    <router-view/>
  </div>
</template>

<script>
  import html2canvas from 'html2canvas';
  import bridge from './js/bridge';
  import  {fontSize} from './js/windownFont'
  import {md5} from './js/md5.js'
  import {navbarscroll} from './js/navbarscroll.js'
  import  {bomb} from './js/zujian'
  import  {androidIos} from './js/app.js'
  export default {
    name: 'app',
    ready:function () {
      androidIos.judgeIphoneX("carTitleBox",0);
    },
    data () {
      return {
        title:"",
        doNow:"",
      }
    },
    mounted:function () {
      var _this = this;
      _this.title = document.title;
      androidIos.judgeIphoneX("carTitleBox",0);
      var cookie = androidIos.getcookie("MESSAGEDRIVER");
      sessionStorage.setItem("source",3);
      if(cookie != "" && sessionStorage.getItem("addPageList")*1 == 0){
        cookie = JSON.parse(cookie);
        sessionStorage.setItem("token",cookie.token);
        sessionStorage.setItem("tokenBefore",cookie.token);
        $.ajax({
          type: "POST",
          url: androidIos.ajaxHttp() + "/getUserInfo",
          data:JSON.stringify({
            userCode:sessionStorage.getItem("token"),
            source:sessionStorage.getItem("source")
          }),
          contentType: "application/json;charset=utf-8",
          dataType: "json",
          timeout: 30000,
          async:false,
          success: function (getUserInfo) {
            if (getUserInfo.success == "1") {
              sessionStorage.setItem("driverMessage",JSON.stringify({
                licType: getUserInfo.licType,
                name:  getUserInfo.name,
                photo:  getUserInfo.photo,
                status:  getUserInfo.status,
                corpName:  getUserInfo.corpName,
                driverType:getUserInfo.type == 1 ? 2 : 1,
              }));
            }else{
              androidIos.second(getUserInfo.message);
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
        if(JSON.parse(sessionStorage.getItem("driverMessage")).driverType == 2){
          _this.$router.push({ path: '/searchDayOrder'});
        }else{
          _this.$router.push({ path: '/taskMoreHomePage'});
        }
      }else if(cookie == ""){
        _this.$router.push({ path: '/login'});
      }
      androidIos.bridge(_this);
    },
    beforeUpdate:function () {
      var _this = this;
      _this.title = document.title;
      _this.html = location.href;
      androidIos.judgeIphoneX("carTitleBox",0);
      if(_this.html.indexOf("/searchDayOrder") != -1 ||_this.html.indexOf("/taskMoreHomePage") != -1 ||_this.html.indexOf("/login") != -1 || _this.html.indexOf("/robbingList") != -1  || _this.html.indexOf("/settlementCenter") != -1  || _this.html.indexOf("/trackList") != -1 || _this.html.indexOf("/user") != -1){
        $("#appBox").hide();
      }else{
        $("#appBox").show();
      }
      if(_this.html.indexOf("/robbingList") != -1 || _this.html.indexOf("/user") != -1 || _this.html.indexOf("/trackList") != -1 || _this.html.indexOf("/message") != -1  || _this.html.indexOf("/login") != -1){
        $(".carTitleback").hide();
      }else{
        $(".carTitleback").show();
      }
      if(_this.html.indexOf("chooseSite") != -1 || _this.html.indexOf("/car/changeCarpeople") != -1){
        _this.doNow = 1;
      }else if(_this.html.indexOf("robbingMore") != -1){
        _this.doNow = 2;
      }else if(_this.html.indexOf("/site/car") != -1){
        _this.doNow = 3;
      }else if( _this.html.indexOf("/user") != -1){
        _this.doNow = 5;
      }else if( _this.html.indexOf("/trackList") != -1){
        _this.doNow = 6;
      }else if( _this.html.indexOf("/authentication") != -1){
        _this.doNow = 7;
      }else if( _this.html.indexOf("/upProductImg") != -1){
        _this.doNow = 8;
      }else{
        _this.doNow = "";
      }
    },
    updated: function () {
      var _this = this;
      _this.$nextTick(function () {
        _this.title = document.title;
        _this.html = location.href;
        androidIos.judgeIphoneX("carTitleBox",0);
        if(_this.html.indexOf("/searchDayOrder") != -1 ||_this.html.indexOf("/register") != -1 || _this.html.indexOf("/taskMoreHomePage") != -1 ||_this.html.indexOf("/login") != -1 || _this.html.indexOf("/robbingList") != -1  || _this.html.indexOf("/settlementCenter") != -1 || _this.html.indexOf("/trackList") != -1|| _this.html.indexOf("/user") != -1){
          $("#appBox").hide();
        }else{
          $("#appBox").show();
        }
        if(_this.html.indexOf("/robbingList") != -1 || _this.html.indexOf("/user") != -1 || _this.html.indexOf("/trackList") != -1 || _this.html.indexOf("/message") != -1  || _this.html.indexOf("/login") != -1){
          $(".carTitleback").hide();
        }else{
          $(".carTitleback").show();
        }
        if(_this.html.indexOf("chooseSite") != -1 || _this.html.indexOf("/car/changeCarpeople") != -1){
          _this.doNow = 1;
        }else if(_this.html.indexOf("robbingMore") != -1){
          _this.doNow = 2;
        }else if(_this.html.indexOf("/site/car") != -1){
          _this.doNow = 3;
        }else if( _this.html.indexOf("/user") != -1){
          _this.doNow = 5;
        }else if( _this.html.indexOf("/trackList") != -1){
          _this.doNow = 6;
        }else if( _this.html.indexOf("/authentication") != -1){
          _this.doNow = 7;
        }else if( _this.html.indexOf("/upProductImg") != -1){
          _this.doNow = 8;
        }else{
          _this.doNow = "";
        }
      })
    },
    methods:{
      go:function () {
        var _this = this;
      },
      goback:function () {
           var _this = this;
           androidIos.gobackFrom(_this);
      },
      setUpgo:function () {
        var _this = this;
        androidIos.addPageList();
        _this.$router.push({ path: "/setUp"});
      },
      orderScreen:function () {
        var _this = this;
        androidIos.addPageList();
        _this.$router.push({ path: "/orderScreen"});
      },
    }
  }
</script>
<style>
  @import "./css/myScroll.css";
  @import "./css/mobiscroll.css";
  @import "./css/mobiscroll_date.css";
  @import "./css/tankuang.css";
  @import "./css/style.css";
  @import "./css/swipeslider.css";
  input, button, select, textarea {
    outline: none;
    /* -webkit-appearance: none;*/
    border-radius: 0;
  }
  a,button,input,optgroup,select,textarea,span,div ,td,tr,table{

    -webkit-tap-highlight-color:rgba(0,0,0,0);

  }
  input::-webkit-input-placeholder{
    color: #BCBCBC;
  }
  input:-moz-placeholder {  /* Mozilla Firefox 4 to 18*/
    color:#BCBCBC;
  }
  input::-moz-placeholder {  /* Mozilla Firefox 19+*/
    　　color:#BCBCBC;
  }
  input:-ms-input-placeholder { /* Internet Explorer 10+*/
    　　color:#BCBCBC;
  }
  textarea::-webkit-input-placeholder{
    color: #BCBCBC;
  }
  textarea:-moz-placeholder {  /* Mozilla Firefox 4 to 18*/
    　　color:#BCBCBC;
  }
  textarea::-moz-placeholder {  /* Mozilla Firefox 19+*/
    　　color:#BCBCBC;
  }
  textarea:-ms-input-placeholder { /* Internet Explorer 10+*/
    　　color:#BCBCBC;
  }
  body,h1,p,h2,h3,h4,h5,h6{
    margin:0;
  }
  html,body{
    background-color: white!important;
    touch-action: none;
  }
  body ::-webkit-scrollbar{
    display: none;
  }
  h1,h2,h3,h4,h5,h6{
    font-weight:normal;
  }
  img{
    display:block;
    border:none;
  }
  a{
    text-decoration:none;
  }
  table, td  {
    border-collapse: collapse;
    padding: 5px 0;
  }
  *{
    margin: 0px;
    padding: 0px;
    font-family:'微软雅黑';
    border-color:transparent;
    border: #fff solid 0px;
    border-color:transparent;
    font-size:10px;
  }
  ul, li {
    list-style-type:none;
  }
  button{
    outline:none;
  }
  .clearBoth{
    clear:both;
  }
  [v-cloak] {
    display: none;
  }
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    position: absolute;
    width:100%;
    height: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
  }
  #app ::-webkit-scrollbar{
    display: none;
  }
  #title{
    display: none;
  }
  .absoluteTop{
    top:0!important;
  }
  #goback{
    width:100%;
    height: 0.8rem;
    background: #ff6666;
    color:white;
    font-size: 0.375rem;
    text-align: center;
    line-height: 0.8rem;
    letter-spacing: 0.3rem;
    z-index: 999;
  }


  #messageBombFirstBox{
    width:100%;
    height:100%;
    position:fixed;
    top:0;
    left:0;
    background:rgba(255,255,255,0);
    z-index:99999
  }
  #messageBombFirst{
    position:absolute;
    z-index:9999999;
    background:rgba(86,86,86,0.7);
    color:white;
    padding:0.13rem 0.2rem;
    border-radius:0.1rem;
    font-size:0.375rem;
    bottom: 1.2rem;
  }
  #appBox #carTitleBox{
    width:100%;
/*    position: absolute;*/
    z-index: 100;
    top:0;
    background: white;
  }
  #appBox .carTitleBox{
    width: 100%;
   /* height:1.21875rem;*/
    height: 1.3rem;
    background: white;
    position: relative;
    border-bottom: 1px solid #e0e0e0;
  }
  .carTitleback{
    position: absolute;
    left:0;
    top:0;
    bottom: 0;
    height: auto;
    width: 1.5rem;
    background-image: url("./images/titlejian.png");
    background-position: 35% 50%;
    background-repeat: no-repeat;
    background-size: 0.2rem 0.3714rem;
  }
  #appBox p{
    text-align: center;
    font-size: 0.48rem;
    line-height: 1.3rem;
    color:#333;
    letter-spacing: 0.0133rem;
  }
  .asd{
    text-align: right;
    font-size: 0.375rem;
    line-height: 1.3rem;
    color:#333;
    position: absolute;
    right: 0.3rem;
    top:0;
  }
  .asd span{
    font-size: 0.375rem;
    color:#333;
    padding:0.5rem 0rem 0.5rem 0.3rem;
  }
  .asd h5{
    font-size: 0.375rem;
    color:#333;
  }
  #share{
    text-align: right;
    font-size: 0.375rem;
    line-height: 1.25rem;
    color:#333;
    position: absolute;
    right:0.3rem;
    top:0;
  }
  #common-blackBox{
    width: 100%;
    position: fixed;
    z-index: 999;
    left: 0;
    top: 0;
    bottom:0;
    height: auto;
    background: transparent;
  }
  #common-black{
    width: 2rem;
    height: 2rem;
    text-align: center;
    font-size: 0.35rem;
    color:#f1f1f1;
    background: rgba(0,0,0,0.7);
    position: fixed;
    top: 45%;
    left: 50%;
    margin-top: -1rem;
    margin-left: -1rem;
    border-radius: 0.1rem;
    letter-spacing: 0.03125rem;
  }
  .common-imgbox{
    width:1rem;
    height: 1rem;
    background-image: url("./images/loading.gif");
    background-position: 50% 50%;
    background-size: cover;
    background-repeat: no-repeat;
    margin:10% auto 0 auto;
  }
  #errorwifeBox{
    position: fixed;
    z-index: 999;
    top:0rem;
    width:100%;
    bottom:0;
    height: auto;
    background:#f2f2f2;
  }
  #errorImgbox{
    width:4rem;
    height:4rem;
    background-image: url("./images/nowife.png");
    background-position: 0 0;
    background-repeat: no-repeat;
    background-size: cover;
    margin: 3.48611rem auto 0.3rem auto;
  }
  #errorwifeBox p{
    text-align:  center;
    font-size: 0.375rem;
    color:#333;
  }
  #errorwifeBox button{
    display: block;
    margin: 0.4rem auto 0 auto;
    width:2.67rem;
    height:0.93rem;
    border-radius: 0.47rem;
    background:#292e5b ;
    color:white;
    font-size: 0.35rem;
    letter-spacing: 0.02rem;
  }
  .mescroll-downwarp .downwarp-progress{
    background-image: url("./images/down.gif");
    background-size: cover;
    background-repeat: no-repeat;
    background-position: 0 0;
  }
  .mescroll-upwarp .upwarp-progress {
    background-image: url("./images/up.gif");
    background-size: cover;
    background-repeat: no-repeat;
    background-position: 0 0;
  }
  #erweimaLook{
    position: absolute;
    right:0.3rem;
    width:0.7rem;
    top:0.25rem;
  }
  #setUp{
    position: absolute;
    right:0.3rem;
    width:1rem;
    top:0rem;
    height: 100%;
    background-image: url("./images/setUp.png");
    background-position: 100% 50%;
    background-size: 0.4rem;
    background-repeat: no-repeat;
  }
  #orderScreenTitle{
    position: absolute;
    right:0.3rem;
    width:1rem;
    top:0rem;
    height: 100%;
    background-image: url("./images/orderScreen.png");
    background-position: 100% 50%;
    background-size: 0.4rem;
    background-repeat: no-repeat;
  }
  #siteCar{
    background-image: url("./images/sitechoosesite.png");
    height: 1.3rem;
    width:1rem;
    background-size: 0.7rem;
    background-repeat: no-repeat;
    background-position: 100% 50%;
  }
  #iphoneXX{
     width:100%;
     height: 0;
  }
</style>
