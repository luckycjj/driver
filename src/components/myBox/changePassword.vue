<template>
  <div id="changePassword" style="top:1.3rem;">
    <div id="title" v-title data-title="修改密码"></div>
    <ul>
      <li class="border">
         <input @keyup="filterInput()" type="password" placeholder="请输入旧密码" maxlength="25" v-model="oldPass"/>
      </li>
      <li class="border">
        <input @keyup="filterInput()" type="password" placeholder="请输入新密码（6-25位字符，区分大小写）"  maxlength="25" v-model="newPass"/>
      </li>
      <li>
        <input @keyup="filterInput()" type="password" placeholder="请确认新密码"  maxlength="25" v-model="newPassAgain"/>
      </li>
    </ul>
    <button @touchend="saveGo()">保存</button>
  </div>
</template>

<script>
  import {androidIos} from "../../js/app";
  import {bomb} from "../../js/zujian";
  import bridge from '../../js/bridge';
    export default {
      name: "change-password",
      data(){
          return{
            oldPass:"",
            newPass:"",
            newPassAgain:"",

          }
      },
      mounted:function () {
        var _this = this;
        androidIos.judgeIphoneX("changePassword",2);
        androidIos.bridge(_this);
      },
      methods:{
        go:function () {
          var _this = this;
        },
        filterInput:function () {
          var _this = this;
          _this.oldPass =  _this.oldPass.replace(/[\u4E00-\u9FA5]/g,'');
          _this.oldPass =  _this.oldPass.replace(/<script>/g,'');
          _this.newPass =  _this.newPass.replace(/[\u4E00-\u9FA5]/g,'');
          _this.newPass =  _this.newPass.replace(/<script>/g,'');
          _this.newPassAgain =  _this.newPassAgain.replace(/[\u4E00-\u9FA5]/g,'');
          _this.newPassAgain =  _this.newPassAgain.replace(/<script>/g,'');
        },
        saveGo:function () {
          var _this = this;
          if(_this.oldPass.length < 6){
             bomb.first("旧密码不得小于6位");
             return false;
          }
          if(_this.newPass.length < 6){
            bomb.first("新密码不得小于6位");
            return false;
          }
          if(_this.newPassAgain == ""){
            bomb.first("请再次输入新密码");
            return false;
          }
          if(_this.newPass != _this.newPassAgain){
            bomb.first("新密码两次输入不同,请重新输入");
            return false;
          }
          androidIos.loading("正在修改");
          $.ajax({
            type: "POST",
            url: androidIos.ajaxHttp() + "/resetPassword",
            data:JSON.stringify({
              userPassword : _this.oldPass,
              newPassword : _this.newPass,
              userCode : sessionStorage.getItem("token"),
              source : sessionStorage.getItem("source")
            }),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            timeout: 30000,
            success: function (resetPassword) {
              if (resetPassword.success == "1") {
                _this.$cjj("修改成功");
                setTimeout(function () {
                   androidIos.gobackFrom(_this);
                },500)
              }else{
                androidIos.second(resetPassword.message);
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
        }
      }
    }
</script>

<style scoped>
  #changePassword{
    position:absolute;
    top:1.3rem;
    bottom:0;
    height: auto;
    width:100%;
    background: #f6f6f6;
  }
  ul{
    width: 100%;
    background: white;
    margin-top: 0.24rem;
  }
  li{
    height: 1.3rem;
    width:92%;
    padding: 0 4%;
  }
  li input{
    color:#333;
    font-size:0.375rem ;
    height: 0.5rem;
    margin-top: 0.4rem;
    width:85%;
  }
  .border{
     border-bottom: 1px solid #E5E5E5;
  }
  button{
    width:9.1rem;
    background:#1D69A8;
    color:white;
    display: block;
    margin: 0 auto;
    line-height: 1.2rem;
    font-size: 0.4rem;
    border-radius: 0.2rem;
    margin-top: 0.8rem;
  }
</style>
