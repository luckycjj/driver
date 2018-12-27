<template>
  <div id="register" style="top:0rem;">
    <div id="title" v-title data-title="注册"></div>
    <div id="top">
       <img id="topImg" src="../../images/register-top.png" style="height:3.78rem;">
       <img id="gobackImg" src="../../images/register-goback.png" style="top:0.9rem" @touchend="goback()">
    </div>
    <div id="registerBody">
      <div class="modelView img1">
        <input @input="filterInput()"  type="tel" v-model="mobile" placeholder="请输入手机号" maxlength="11"/>
      </div>
      <div class="modelView img5">
        <input @input="filterInput()"  type="tel" v-model="verification" placeholder="请输入验证码" maxlength="6"/>
        <span class="verificationCome" @touchend="verificationCome()">{{name}}</span>
        <div class="clearBoth"></div>
      </div>
      <div class="modelView img2">
        <input @input="filterInput()"  :type="lookPassWord ? 'text' : 'password' "  maxlength="25"  v-model="password" placeholder="请输入密码"/>
        <div id="lookPassWord" :class="lookPassWord ? 'lookPassWord' : '' " @touchend="lookpass(1)"></div>
        <div class="clearBoth"></div>
      </div>
      <div class="modelView img3">
        <input @input="filterInput()"  :type="lookPassWord1 ? 'text' : 'password' "  maxlength="25"  v-model="passwordSure" placeholder="请确认密码"/>
        <div id="lookPassWord1" :class="lookPassWord1 ? 'lookPassWord' : '' " @touchend="lookpass(2)"></div>
        <div class="clearBoth"></div>
      </div>
      <div class="modelView img4">
        <input @input="filterInput()"  type="text" v-model="invitation" placeholder="请输入邀请码" maxlength="6"/>
      </div>
    </div>
    <button @touchend="registerOn()">注册</button>
    <div class="checkBox">
      <div class="checked" @touchend="checked = !checked" :class="checked ? 'checkedTrue' : '' "></div>
      <span>我同意用户协议及声明</span>
      <div class="clearBoth"></div>
    </div>
  </div>
</template>

<script>
  import {androidIos} from "../../js/app";
  import {bomb} from "../../js/zujian";
  import bridge from '../../js/bridge';
    export default {
        name: "register",
      data(){
          return{
             mobile:"",
             password:"",
             passwordSure:"",
             invitation :"",
             verification:"",
             checked:false,
             lookPassWord:false,
             lookPassWord1:false,
             name:"获取验证码",
             nameSet:null,
          }
      },
      mounted:function () {
        var _this = this;
        androidIos.judgeIphoneX("topImg",5);
        androidIos.judgeIphoneX("gobackImg",2);
        androidIos.judgeIphoneX("checkBox",1);
        androidIos.bridge(_this);
      },
      methods:{
          go:function () {

          },
        goback:function () {
          var _this = this;
          androidIos.gobackFrom(_this);
        },
        filterInput:function () {
          var _this = this;
          _this.mobile =  _this.mobile.replace(/[^\0-9]/g,'');
          _this.invitation =  _this.invitation.replace(/[^\a-\z\A-\Z0-9]/g,'');
          _this.verification =  _this.verification.replace(/[^\0-9]/g,'');
          _this.password =  _this.password.replace(/[\u4E00-\u9FA5]/g,'');
          _this.password =  _this.password.replace(/<script>/g,'');
          _this.passwordSure =  _this.passwordSure.replace(/[\u4E00-\u9FA5]/g,'');
          _this.passwordSure =  _this.passwordSure.replace(/<script>/g,'');
        },
          lookpass:function (type) {
            var _this = this;
            if(type == 1){
              _this.lookPassWord = !_this.lookPassWord;
            }else{
              _this.lookPassWord1 = !_this.lookPassWord1;
            }
          },
          verificationCome:function () {
            var _this = this;
            if(_this.name.indexOf("获取") != -1){
              if(!androidIos.telCheck(_this.mobile)){
                bomb.first("请输入正确的手机号");
                return false;
              }
               _this.name = 60;
               _this.nameSet = setInterval(function () {
                   _this.name --;
                   if(_this.name <= 0){
                     _this.name = "获取验证码";
                      clearInterval(_this.nameSet);
                   }
               },1000);
              $.ajax({
                type: "POST",
                url: androidIos.ajaxHttp() + "/sendVerification",
                data:JSON.stringify({
                  userPhone : _this.mobile,
                  source:sessionStorage.getItem("source")
                }),
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                timeout: 30000,
                success: function (sendVerification) {
                  if (sendVerification.success == "1") {

                  }else{
                    androidIos.second(sendVerification.message);
                    _this.name = "获取验证码";
                    clearInterval(_this.nameSet);
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
        registerOn:function () {
          var _this = this;
          if(!androidIos.telCheck(_this.mobile)){
             bomb.first("请输入正确的手机号");
             return false;
          }
          if(_this.password.length < 6){
            bomb.first("密码不得小于6位");
            return false;
          }
          if(_this.password != _this.passwordSure){
            bomb.first("两次密码输入不相同");
            return false;
          }
          if(_this.verification.length < 4){
            bomb.first("请输入正确的验证码");
            return false;
          }
          if(!_this.checked){
            bomb.first("请同意用户协议及声明");
            return false;
          }
          androidIos.loading("正在注册");
          $.ajax({
            type: "POST",
            url: androidIos.ajaxHttp() + "/userRegister",
            data:JSON.stringify({
              userPhone : _this.mobile,
              password : _this.password,
              checkCode : _this.verification,
              repassword:_this.passwordSure,
              inviteCode : _this.invitation,
              source:sessionStorage.getItem("source")
            }),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            timeout: 30000,
            success: function (userRegister) {
              if (userRegister.success == "1") {
                 _this.$cjj("注册成功");
                 sessionStorage.setItem("tokenBefore",_this.mobile);
                 setTimeout(function () {
                   androidIos.gobackFrom(_this);
                 },500)
              }else{
                androidIos.second(userRegister.message);
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
      }
    }
</script>

<style scoped>
  #register{
    position: absolute;
    top:0rem;
    bottom:0;
    background: white;
    height: auto;
    width:100%;
  }
  #top{
    width:100%;
    position: relative;
  }
  #top  #gobackImg{
      position: absolute;
     width:0.253rem;
    left:0.4rem;
    top:0.9rem;
  }
  #top #topImg{
    width:100%;
    height: 3.78rem;
  }
 #registerBody{
   width:100%;
   background: white;
   margin: 0.27rem auto;
 }
 .modelView{
   width:7.6rem;
   border-bottom: 1px solid #E5E5E5;
  margin-left:auto;
   margin-right: auto;
   height:1.2rem;
   position: relative;
   background-size:0.53rem ;
   background-repeat: no-repeat;
   background-position: 0.13rem 50%;
 }
 .modelView span{
   line-height: 1.2rem;
   color:#333;
   font-size:0.375rem ;
 }
 .modelView input{
   width:4.2rem;
   height: 0.5rem;
   margin-top: 0.35rem;
   font-size: 0.375rem;
   margin-left: 1.06rem;
 }
.img1{
  background-image: url("../../images/register-user.png");
}
  .img2{
    background-image: url("../../images/register-mima.png");
  }
  .img3{
    background-image: url("../../images/register-queren.png");
  }
  .img4{
    background-image: url("../../images/register-yaoqingma.png");
  }
  .img5{
    background-image: url("../../images/register-yanzhengma.png");
  }
 #lookPassWord,#lookPassWord1{
   width: 10%;
   position: absolute;
   right: 0.4rem;
   top:0;
   height: 100%;
   background-image: url("../../images/passwordNolock.png");
   background-repeat: no-repeat;
   background-size: 0.6rem;
   background-position: 50% 50%;
 }
 .lookPassWord{
   background-image: url("../../images/passwordLock.png")!important;
 }
 button{
   width:7.8rem;
   margin:0.74rem auto 0 auto ;
   display: block;
   background:#1D69A8;
   color:white;
   font-size: 0.42rem;
   letter-spacing: 2px;
   height: 1.37rem;
   border-radius: 0.1rem;
 }
  .verificationCome{
    float: right;
    color:#1869A9!important;
    font-size: 0.32rem!important;
    margin-right: 0.42rem;
  }
  .checkBox{
    width:4.7rem;
    position: absolute;
    bottom:0.58rem;
    left:50%;
    margin-left: -2.2rem;
  }
  @media (max-height: 400px) {
    　.checkBox {
      display: none;
    }
  }
  .checked{
    width:0.34rem;
    height: 0.34rem;
    border: 1px solid #999999;
    border-radius: 0.0625rem;
    margin-top: 0.08rem;
    float: left;
  }
  .checkedTrue{
    background-image: url("../../images/checkTrue.png");
    background-repeat: no-repeat;
    background-position: 50% 50%;
    background-size:0.3rem ;
  }
 .checkBox span{
   line-height: 0.53rem;
   margin-left:0.16rem ;
   color:#999;
   font-size:0.375rem ;
   float: left;
 }
</style>
