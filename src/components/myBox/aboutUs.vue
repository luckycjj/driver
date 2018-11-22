<template>
  <div id="aboutus" style="top:1.3rem;">
    <div id="title" v-title data-title="关于我们"></div>
    <img src="../../images/logo.png">
    <button @touchend="callT()">客服电话:021-50929122</button>
  </div>
</template>

<script>
  import {androidIos} from "../../js/app";
  import {bomb} from "../../js/zujian";
  import bridge from '../../js/bridge';
    export default {
        name: "about-us",
      mounted:function () {
        androidIos.judgeIphoneX("aboutus",2);
      },
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
    background: -webkit-linear-gradient(left, #00C4FF , #0074FF); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(right, #00C4FF, #0074FF); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(right, #00C4FF, #0074FF); /* Firefox 3.6 - 15 */
    background: linear-gradient(to right, #00C4FF , #0074FF); /* 标准的语法 */
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
