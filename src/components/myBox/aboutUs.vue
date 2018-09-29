<template>
  <div id="aboutus">
    <div id="title" v-title data-title="关于我们"></div>
    <img src="../../images/logo.png">
    <button @click="callT()">客服电话:021-50929122</button>
  </div>
</template>

<script>
  import {androidIos} from "../../js/app";
  import {bomb} from "../../js/zujian";
  import bridge from '../../js/bridge';
    export default {
        name: "about-us",
        methods:{
           callT:function () {
             androidIos.telCall('021-50929122')
           }
        }
    }
</script>

<style scoped>
  #aboutus{
    position:absolute;
    top:1.3rem;
    bottom:0;
    height: auto;
    width:100%;
    background: #f6f6f6;
  }
  img{
    width:2rem;
    margin:1rem auto  1rem auto;
  }
  button{
    width:9.1rem;
    background-image: url("../../images/backgroundJB.png");
    background-repeat:repeat-y;
    background-size:9.1rem;
    color:white;
    display: block;
    margin: 0 auto;
    line-height: 1.2rem;
    font-size: 0.4rem;
    border-radius: 0.2rem;
  }
  button a{
    color:white;
    font-size: 0.4rem;
  }
</style>
