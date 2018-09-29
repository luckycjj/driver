<template>
  <div id="setup">
    <div id="title" v-title data-title="设置"></div>
    <ul>
      <li @click="urlGo(item.url)" v-for="(item,index) in tabList" :class="index % 2 == 0 ? (tabList.length -1 == index ? 'marTop' : 'marTop borderShow') : ''">
        <p>{{item.name}}</p>
        <h1>{{item.message}}</h1>
        <div class="lookMore" v-if="item.message == ''"></div>
        <div class="clearBoth"></div>
      </li>
    </ul>
    <button @click="loginOut()">退出登录</button>
  </div>
</template>

<script>
  import {androidIos} from "../../js/app";
  import {bomb} from "../../js/zujian";
  import bridge from '../../js/bridge';
    export default {
        name: "setup",
        data(){
          return{
             tabList:[{
               name:"修改密码",
               url:"/changePassword",
               message:""
             },{
               name:"当前版本",
               url:"",
               message:"1.0.0"
             },]
          }
        },
        mounted:function () {
          var _this = this;
          androidIos.bridge(_this);
        },
        methods:{
           go:function () {

           },
          urlGo:function (url) {
             var _this = this;
             if(url != ""){
               androidIos.addPageList();
               _this.$router.push({path:url})
             }
          },
          loginOut:function () {
             var _this = this;
             androidIos.first("确定要退出吗?");
            $(".tanBox-yes").unbind('click').click(function(){
              $(".tanBox-bigBox").remove();
              sessionStorage.setItem("addPageList",0);
              _this.$router.push({path:"/login"});
            });
          },
        }
    }
</script>

<style scoped>
  #setup{
    position:absolute;
    top:1.3rem;
    bottom:0;
    height: auto;
    width:100%;
    background: #f6f6f6;
  }
  ul{
    width:100%;
  }
  li{
    background: white;
    position: relative;
  }
  li p {
    float: left;
    line-height: 1.3rem;
    color:#373737;
    font-size: 0.375rem;
    margin-left: 0.27rem;
  }
  li h1 {
    float: right;
    line-height: 1.3rem;
    color:#373737;
    font-size: 0.375rem;
    margin-right: 0.38rem;
  }
  .marTop{
    margin-top: 0.27rem;
  }
  .borderShow{
    border-bottom: 1px solid #E5E5E5;
  }
  .lookMore{
    width:10%;
    height: 100%;
    position: absolute;
    background-image: url("../../images/lookMore.png");
    right: 4%;
    top:0;
    background-repeat: no-repeat;
    background-position: 100% 50%;
    background-size:0.25rem;
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
    margin-top: 0.8rem;
  }
</style>
