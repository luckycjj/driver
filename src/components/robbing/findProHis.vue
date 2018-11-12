<template>
    <div id="findProHis" style="top:1.3rem;">
      <div id="title" v-title data-title="找货记录"></div>
      <div id="setHis">
        <ul>
          <li  v-for="(item,index) in list" :class="item.check ? 'checked':''" @click="findProHis(item)">
            <div class="imgBox" :style="{backgroundImage:'url('+item.logo+')'}"></div>
            {{item.name}}
          </li>
          <div clas="clearBoth"></div>
        </ul>
      </div>
    </div>
</template>

<script>
  import MeScroll from '../../js/mescroll'
  import AMap from 'AMap'
  import {bomb} from "../../js/zujian";
  import {iscroll} from '../../js/iscroll'
  import {androidIos} from "../../js/app";
  import bridge from '../../js/bridge';
  import  "../../js/markingSystem";
  import "../../js/swipeslider"
    export default {
        name: "find-pro-his",
      data(){
          return{
            list:[{
              name:"今日抢单",
              number:0,
              prolist:[],
              logo:require("../../images/jinri-3.png"),
              check:true,
            },{
              name:"历史抢单",
              number:0,
              prolist:[],
              logo:require("../../images/lishi-3.png"),
              check:false
            }],
          }
      },
      mounted:function () {
        var _this = this;
        androidIos.judgeIphoneX("findProHis",2);
        androidIos.bridge(_this);
      },
      methods:{
          go:function () {

          }
      }
    }
</script>

<style scoped>
    #findProHis{
      position: absolute;
      top:1.3rem;
      bottom:0;
      height: auto;
      background: #f6f6f6;
      width:100%;
    }
    #setHis {
      width:100%;
      background: #F5F5F5;
      margin-top: 2px;
    }
    #setHis li{
      background: white;
      height: 2rem;
      font-size: 0.4rem;
      color:#373737;
      float: left;
      width:5rem;
      background-size:0.93rem ;
      background-position: 90% 50%;
      background-repeat: no-repeat;
      box-sizing: border-box;
      text-align: center;
    }
    #setHis li:nth-child(2){
      border-left:1px solid #f5f5f5 ;
    }
</style>
