<template>
  <div id="forgetPassword">
    <div id="title" v-title data-title="忘记密码"></div>
    <div id="registerBody">
      <div class="modelView">
        <span class="w3">手机号</span>
        <input type="tel" v-model="mobile" placeholder="请输入手机号" maxlength="11"/>
      </div>
      <div class="modelView">
        <span class="w3">新密码</span>
        <input :type="lookPassWord ? 'text' : 'password' "  v-model="password" placeholder="请输入密码"/>
        <div id="lookPassWord" :class="lookPassWord ? 'lookPassWord' : '' " @click="lookpass()"></div>
        <div class="clearBoth"></div>
      </div>
      <div class="modelView" style="border:none">
        <span class="w3">验证码</span>
        <input type="tel" v-model="verification" placeholder="请输入验证码" maxlength="6"/>
        <span class="verificationCome" @click="verificationCome()">{{name}}</span>
        <div class="clearBoth"></div>
      </div>
    </div>
    <button @click="registerOn()">提交</button>
  </div>
</template>

<script>
  import {androidIos} from "../../js/app";
  import {bomb} from "../../js/zujian";
  import bridge from '../../js/bridge';
  export default {
    name: "forgetPassword",
    data(){
      return{
        mobile:"",
        password:"",
        verification:"",
        lookPassWord:false,
        name:"获取验证码",
        nameSet:null,
      }
    },
    mounted:function () {
      var _this = this;
      androidIos.bridge(_this);
    },
    methods:{
      go:function () {

      },
      lookpass:function () {
        var _this = this;
        _this.lookPassWord = !_this.lookPassWord;
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
        if(_this.password == ""){
          bomb.first("请输入密码");
          return false;
        }
        if(_this.verification.length < 4){
          bomb.first("请输入正确的验证码");
          return false;
        }
        androidIos.loading("正在修改");
        $.ajax({
          type: "POST",
          url: androidIos.ajaxHttp() + "/retrievePassword",
          data:JSON.stringify({
            userCode : _this.mobile,
            password : _this.password,
            checkCode : _this.verification,
            source:sessionStorage.getItem("source")
          }),
          contentType: "application/json;charset=utf-8",
          dataType: "json",
          timeout: 30000,
          success: function (userRegister) {
            if (userRegister.success == "1") {
              _this.$cjj("修改成功");
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
  #registerBody{
    width:100%;
    background: white;
    margin: 0.27rem auto;
  }
  .modelView{
    width:9.6rem;
    border-bottom: 1px solid #E5E5E5;
    margin-left:0.4rem;
    height:1.2rem;
    position: relative;
  }
  .modelView span{
    line-height: 1.2rem;
    color:#333;
    font-size:0.375rem ;
  }
  .modelView input{
    width:5rem;
    height: 0.5rem;
    margin-top: 0.35rem;
    font-size: 0.375rem;
    margin-left: 0.65rem;
  }
  .w2{
    letter-spacing:2em; /*如果需要y个字两端对齐，则为(x-y)/(y-1),这里是（4-2）/(2-1)=2em */
    margin-right:-2em;
  }
  .w3{
    letter-spacing:0.5em; /*如果需要y个字两端对齐，则为(x-y)/(y-1),这里是（4-3）/(3-1)=2em */
    margin-right:-0.5em;
  }
  #lookPassWord{
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
    width:9.2rem;
    margin:0.74rem auto 0 auto ;
    display: block;
    background-image: url("../../images/backgroundJB.png");
    background-repeat:repeat-y;
    background-size:9.2rem;
    color:white;
    font-size: 0.42rem;
    letter-spacing: 2px;
    height: 1.08rem;
    box-shadow: 0 0 10px #80d6ff;
    border-radius: 0.1rem;
  }
  .verificationCome{
    float: right;
    color:#0091FF!important;
    font-size: 0.32rem!important;
    margin-right: 0.42rem;
  }
  .checkBox{
    width:9.2rem;
    margin:0.37rem auto 0 auto ;
  }
  .checked{
    width:0.53rem;
    height: 0.53rem;
    border: 1px solid #333;
    border-radius: 0.0625rem;
    float: left;
  }
  .checkedTrue{
    background-image: url("../../images/checkTrue.png");
    background-repeat: no-repeat;
    background-position: 50% 50%;
    background-size:0.38rem ;
  }
  .checkBox span{
    line-height: 0.53rem;
    margin-left:0.32rem ;
    color:#999;
    font-size:0.375rem ;
    letter-spacing: 1px;
    float: left;
  }
</style>
