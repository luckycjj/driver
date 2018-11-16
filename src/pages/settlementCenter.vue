<template>
    <div id="settlementCenter">
      <div id="title" v-title data-title="结算中心"></div>
      <div id="topBox">
        <div id="top">
          <img id="gobackImg" src="../images/register-goback.png"  @click="goback()">
          结算中心
          <h3>明细</h3>
        </div>
        <div class="price">
          <p>账户余额（元）</p>
          <h1>{{price | toThousands}}</h1>
        </div>
      </div>
      <ul id="tabList">
        <li @click="lookUrl(item.url)" v-for="(item,index) in tabList" :style="{backgroundImage:'url('+item.icon+')',marginBottom:index % 2 == 0 ? '1px' : '0.32rem'}">
          <p>{{item.name}}</p>
        </li>
      </ul>
      <footComponent ref="footcomponent" :idx='2'></footComponent>
    </div>
</template>

<script>
  import {androidIos} from "../js/app";
  import {bomb} from "../js/zujian";
    export default {
      name: "settlement-center",
      data(){
          return{
              price:1911.44,
              tabList:[{
                 icon:require("../images/icon-tixian.png"),
                 name:"提现",
                 url:"",
              },{
                icon:require("../images/icon-priceYes.png"),
                name:"已收款",
                url:"/settlementYes",
              },{
                icon:require("../images/icon-priceNo.png"),
                name:"未收款",
                url:"",
              }]
          }
      },
      mounted:function () {
        var _this = this;
        androidIos.judgeIphoneX("topBox",0);
        androidIos.bridge(_this);
      },
      methods:{
        go:function () {

        },
        goback:function () {
          var _this = this;
          androidIos.gobackFrom(_this);
        },
        lookUrl:function (url) {
          var _this = this;
          if(url != ""){
             androidIos.addPageList();
             _this.$router.push({path:url});
          }else{
             androidIos.second("功能正在开发!");
          }
        }
      }
    }
</script>

<style scoped>
   #settlementCenter{
     position:absolute;
     top:0rem;
     bottom:0;
     height: auto;
     width:100%;
     background: #f6f6f6;
   }
   #topBox{
     width:100%;
     background: #1869A9;
     padding-bottom: 0.36rem;
   }
   #top{
     position: relative;
     width:100%;
     text-align: center;
     font-size: 0.48rem;
     line-height: 1.3rem;
     color: #fff;
     letter-spacing: 0.0133rem;
   }
   #top h3{
     text-align: right;
     font-size: 0.375rem;
     line-height: 1.3rem;
     color: #fff;
     position: absolute;
     right: 0.3rem;
     top: 0;
   }
  .price{
     width:92%;
    margin:0.64rem auto 0 auto ;
  }
   .price p{
      font-size: 0.32rem;
     color:white;
   }
   .price h1{
     font-size: 1.73rem;
     color:white;
     line-height: 2.42rem;
     margin: 0.26rem 0 0 0;
   }
  #tabList{
    width:100%;
  }
  #tabList li {
     background-repeat: no-repeat;
    background-position: 0.4rem 50%;
    background-size:0.45rem ;
    height:1.28rem ;
    width:100%;
    background-color: white;
  }
   #tabList li p{
     font-size: 0.375rem;
     color:#373737;
     line-height: 1.28rem;
     margin-left: 1.12rem;
     background-image: url("../images/lookMore2.png");
     background-position: 90% 50%;
     background-repeat: no-repeat;
     background-size:0.23rem ;
   }
   #gobackImg{
     position: absolute;
     width:0.253rem;
     left:0.4rem;
     top:50%;
     margin-top: -0.213rem;
   }
</style>
