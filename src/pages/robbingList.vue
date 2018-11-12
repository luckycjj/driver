<template>
    <div id="robbingList" style="top:0rem;">
      <div id="title" v-title data-title="找货"></div>
      <div id="top">
        找货
        <div class="messageLDbox">
          <img src="../images/messageLD.png">
        </div>
      </div>
      <footComponent ref="footcomponent" :idx='0'></footComponent>
    </div>
</template>

<script>
  import {androidIos} from "../js/app";
  import {bomb} from "../js/zujian";
  import bridge from '../js/bridge';
  import MeScroll from '../js/mescroll'
  import {iscroll} from '../js/iscroll'
    export default {
        name: "robbing-list",
      data(){
          return{
             list:[],
          }
      },
      mounted:function () {
        var _this = this;
        androidIos.judgeIphoneX("robbingList",2);
        androidIos.bridge(_this);
      },
      methods:{
          go:function () {

          }
      }
    }
</script>

<style scoped>
 #robbingList{
   position: absolute;
   top:0;
   bottom:0;
   height: auto;
   background: #f6f6f6;
   width:100%;
 }
  #top{
    position: relative;
    width:100%;
    background: white;
    text-align: center;
    font-size: 0.48rem;
    line-height: 1.3rem;
    color: #333;
    letter-spacing: 0.0133rem;
  }
 #top .messageLDbox{
   position: absolute;
   width:0.375rem;
   right:0.73rem;
   top:50%;
   margin-top: -0.22rem;
 }
  .messageLDbox img{
    width:100%;
  }
</style>
