<template>
  <div id="login">
    <div id="title" v-title data-title="登陆"></div>
    <img src="../images/logo.png" id="logo">
    <div class="modelView">
      <span class="w3">手机号</span>
      <input type="tel" v-model="mobile" placeholder="请输入手机号" maxlength="11"/>
    </div>
    <div class="modelView">
      <span class="w2">密码</span>
      <input :type="lookPassWord ? 'text' : 'password' "  v-model="password" placeholder="请输入密码"/>
      <div id="lookPassWord" :class="lookPassWord ? 'lookPassWord' : '' " @click="lookpass()"></div>
    </div>
    <button @click="loginOn()">登录</button>
    <p class="newOwner"><span @click="registerGo(1)">新用户注册</span><span @click="registerGo(2)" class="fRight">忘记密码?</span><div class="clearBoth"></div></p>
  </div>
</template>

<script>
  import {androidIos} from "../js/app";
  import {bomb} from "../js/zujian";
  import bridge from '../js/bridge';
    export default {
      name: "login",
      data(){
          return{
             mobile:"",
             password:"",
             lookPassWord:false,
          }
      },
      mounted:function () {
          var _this = this;
          sessionStorage.removeItem("token");
          androidIos.delCookie("MESSAGEDRIVER");
          sessionStorage.removeItem("driverMessage");
          androidIos.bridge(_this);
      },
      methods:{
         go:function () {
           var _this = this;
           if( sessionStorage.getItem("tokenBefore") != null){
             _this.mobile = sessionStorage.getItem("tokenBefore");
           }
           document.getElementById("appBox").style.display = "none";
           document.getElementsByTagName("html")[0].style.backgroundColor = "white";
           document.getElementsByTagName("body")[0].style.backgroundColor = "white";
         },
        registerGo:function (type) {
          var _this = this;
          androidIos.addPageList();
          if(type == 1){
            _this.$router.push({path:'/register'});
          }else if(type == 2){
            _this.$router.push({path:'/forgetPassword'});
          }

        },
        loginOn:function () {
          var _this = this;
          if(_this.mobile == "" || _this.password == ""){
             bomb.first("请输入手机号或密码!");
             return false;
          }
          var check = androidIos.telCheck(_this.mobile);
          if(!check || _this.mobile.length < 11){
            bomb.first("请输入正确的手机号!");
            return false;
          };
          androidIos.loading("正在登录");
          $.ajax({
            type: "POST",
            url: androidIos.ajaxHttp() + "/login",
            data:JSON.stringify({
                loginId : _this.mobile,
                userPassword : _this.password
            }),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            timeout: 30000,
            success: function (login) {
              if (login.success == "1") {
                sessionStorage.setItem("token",login.data.userCode);
                sessionStorage.setItem("tokenBefore",login.data.userCode);
                androidIos.setcookie("MESSAGEDRIVER",JSON.stringify({
                   token:login.data.userCode,
                }),80);
                _this.$cjj("登录成功");
                setTimeout(function () {
                  _this.$router.push({ path: '/trackList'});
                },500)
              }else{
                androidIos.second(login.message);
              }
            },
            complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
              $("#common-blackBox").remove();
              if (status == 'timeout') { //超时,status还有success,error等值的情况
                androidIos.second("当前状况下网络状态差，请检查网络！");
              } else if (status == "error") {
                androidIos.errorwife();
              }
            }
          });
        },
        lookpass:function () {
          var _this = this;
          _this.lookPassWord = !_this.lookPassWord;
        },
      },
      beforeDestroy:function () {
        document.getElementById("appBox").style.display = "block";
        document.getElementsByTagName("html")[0].style.backgroundColor = "#f6f6f6";
        document.getElementsByTagName("body")[0].style.backgroundColor = "#f6f6f6";
      },
      destroy:function () {
        document.getElementById("appBox").style.display = "block";
        document.getElementsByTagName("html")[0].style.backgroundColor = "#f6f6f6";
        document.getElementsByTagName("body")[0].style.backgroundColor = "#f6f6f6";
      }
    }
</script>

<style scoped>
  #logo{
    width:2rem;
    margin:2.14rem auto  1.88rem auto;
  }
  .modelView{
    width:9rem;
    border-bottom: 2px solid #E9EEF3;
    margin: 0 auto 0.5rem auto;
    height:1rem;
    position: relative;
  }
  .modelView span{
     line-height: 1rem;
    color:#333;
    font-size:0.375rem ;
  }
  .modelView input{
     width:5rem;
    height: 0.5rem;
    margin-top: 0.25rem;
    font-size: 0.375rem;
    margin-left: 0.65rem;
  }
  .w2{
    letter-spacing:1em; /*如果需要y个字两端对齐，则为(x-y)/(y-1),这里是（4-2）/(2-1)=2em */
    margin-right:-1em;
  }
  .w3{
    letter-spacing:0em; /*如果需要y个字两端对齐，则为(x-y)/(y-1),这里是（4-2）/(2-1)=2em */
    margin-right:0em;
  }
  #lookPassWord{
    width: 10%;
    position: absolute;
    right: 1%;
    top:0;
    height: 100%;
    background-image: url("../images/passwordNolock.png");
    background-repeat: no-repeat;
    background-size: 0.6rem;
    background-position: 50% 50%;
  }
  .lookPassWord{
    background-image: url("../images/passwordLock.png")!important;
  }
  button{
     width:8.5rem;
    margin:1.04rem auto 0 auto ;
    display: block;
    background-image: url("../images/backgroundJB.png");
    background-repeat:repeat-y;
    background-size:8.5rem;
    color:white;
    font-size: 0.48rem;
    letter-spacing: 2px;
    height: 1.3rem;
    box-shadow: 0 0 10px #80d6ff;
    border-radius: 0.2rem;
  }
  .newOwner{
     width:8.5rem;
    display: block;
    margin: 0.4rem auto;
  }
  .newOwner span{
    color:#999;
    font-size: 0.37rem;
    float: left;
  }
  .fRight{
    float: right!important;
  }
</style>
