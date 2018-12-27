<template>
  <div id="login">
    <div id="title" v-title data-title="登陆"></div>
    <img src="../images/logo2.png" id="logo">
    <div class="modelView">
      <input autocomplete="off"  @keyup="filterInput()" type="tel" v-model="mobile" placeholder="请输入手机号" maxlength="11"/>
    </div>
    <div class="modelView">
      <input autocomplete="off"  @keyup="filterInput()" :type="lookPassWord ? 'text' : 'password' "  v-model="password" placeholder="请输入密码"/>
      <div id="lookPassWord" :class="lookPassWord ? 'lookPassWord' : '' " @touchend="lookpass()"></div>
    </div>
    <button @touchend="loginOn()">登录</button>
    <p class="newOwner"><span @touchend="registerGo(1)">新用户注册</span><span @touchend="registerGo(2)" class="fRight">忘记密码?</span><div class="clearBoth"></div></p>
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

          sessionStorage.removeItem("driverMessage");
          localStorage.removeItem("DRIVERSFETMESSAGE");
          sessionStorage.removeItem("trackTap");
          sessionStorage.removeItem("histroyTrackTap");
          sessionStorage.removeItem("driverBottomIcon");
          localStorage.removeItem("PEOPLEPHOTO");
          localStorage.removeItem("newMessage");
          androidIos.bridge(_this);
      },
      methods:{
         go:function () {
           var _this = this;
           if( sessionStorage.getItem("tokenBefore") != null){
             _this.mobile = sessionStorage.getItem("tokenBefore");
           }
           /*document.getElementById("appBox").style.display = "none";*/
           document.getElementsByTagName("html")[0].style.backgroundColor = "white";
           document.getElementsByTagName("body")[0].style.backgroundColor = "white";
         },
        filterInput:function () {
          var _this = this;
          _this.mobile =  _this.mobile.replace(/[^\0-9]/g,'');
          _this.password =  _this.password.replace(/[\u4E00-\u9FA5]/g,'');
          _this.password =  _this.password.replace(/<script>/g,'');
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
          var userCodeFirst,status,driverType;
          $.ajax({
            type: "POST",
            url: androidIos.ajaxHttp() + "/login",
            data:JSON.stringify({
                loginId : _this.mobile,
                userPassword : _this.password,
                source:sessionStorage.getItem("source")
            }),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            timeout: 30000,
            async:false,
            success: function (login) {
              if (login.success == "1") {
                sessionStorage.setItem("token",login.data.userCode);
                sessionStorage.setItem("tokenBefore",login.data.userCode);
                userCodeFirst = login.data.userCode;
                androidIos.jianting(login.data.userCode);
                $.ajax({
                  type: "POST",
                  url: androidIos.ajaxHttp() + "/getUserInfo",
                  data:JSON.stringify({
                    userCode:sessionStorage.getItem("token"),
                    source:sessionStorage.getItem("source")
                  }),
                  contentType: "application/json;charset=utf-8",
                  dataType: "json",
                  timeout: 30000,
                  async:false,
                  success: function (getUserInfo) {
                    if (getUserInfo.success == "1") {
                      sessionStorage.setItem("driverMessage",JSON.stringify({
                        licType: getUserInfo.licType,
                        name:  getUserInfo.name,
                        photo:  getUserInfo.photo,
                        status:  getUserInfo.status,
                        corpName:  getUserInfo.corpName,
                        driverType:getUserInfo.type == 1 ? 2 : 1,
                      }));
                      driverType = getUserInfo.type == 1 ? 2 : 1;
                      status =   getUserInfo.status;
                    }else{
                      androidIos.second(getUserInfo.message);
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
                androidIos.setcookie("MESSAGEDRIVER",JSON.stringify({
                  token:userCodeFirst,
                  status:status,
                  driverType:driverType
                }),80);
                _this.$cjj("登录成功");
                setTimeout(function () {
                  if(JSON.parse(sessionStorage.getItem("driverMessage")).driverType == 2){
                    _this.$router.push({ path: '/searchDayOrder'});
                  }else{
                    _this.$router.push({ path: '/taskMoreHomePage'});
                  }
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
  input::-webkit-input-placeholder{
    color: #A4B9E0!important;
  }
  input:-moz-placeholder {  /* Mozilla Firefox 4 to 18*/
    color:#A4B9E0!important;
  }
  input::-moz-placeholder {  /* Mozilla Firefox 19+*/
    　　color:#A4B9E0!important;
  }
  input:-ms-input-placeholder { /* Internet Explorer 10+*/
    　　color:#A4B9E0;
  }
  #login{
    position: relative;
    top:0;
    bottom:0;
    height: 100%;
    border-top: 1px solid #535DAD;
    box-sizing: border-box;
    width:100%;
    background: -webkit-linear-gradient(135deg, #535DAD , #2A82CC); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(135deg, #535DAD, #2A82CC); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(135deg, #535DAD, #2A82CC); /* Firefox 3.6 - 15 */
    background: linear-gradient(135deg, #535DAD , #2A82CC); /* 标准的语法 */
  }
  @media (max-height: 400px) {
    　#login {
      box-sizing: content-box;
      padding-bottom: 3.68rem ;
    }
  }
  #logo{
    width:5.33rem;
    margin:3.68rem auto  1.28rem auto;
  }
  .modelView{
    width:7.8rem;
    margin: 0 auto 0.5rem auto;
    height:1.37rem;
    position: relative;
    background: rgba(255,255,255,0.2);
    border-radius: 0.16rem;
  }
  .modelView input{
     width:5.84rem;
    height: 0.5rem;
    margin-top: 0.435rem;
    background: transparent;
    font-size: 0.42rem;
    margin-left: 0.48rem;
    color:white;
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
    right: 0.3rem;
    top:0;
    height: 100%;
    background-image: url("../images/passwordNolock2.png");
    background-repeat: no-repeat;
    background-size: 0.6rem;
    background-position: 50% 50%;
  }
  .lookPassWord{
    background-image: url("../images/passwordLock2.png")!important;
  }
  button{
     width:7.8rem;
    margin:0.46rem auto 0 auto ;
    display: block;
    background:transparent;
    color:#F7F9FD;
    font-size: 0.4267rem;
    letter-spacing: 2px;
    height: 1.37rem;
    border: 2px solid #5D92D1;
    border-radius: 0.2rem;
  }
  .newOwner{
     width:7.8rem;
    display: block;
    margin: 0.4rem auto;
  }
  .newOwner span{
    color:#F7F9FD;
    font-size: 0.37rem;
    float: left;
  }
  .fRight{
    float: right!important;
  }
</style>
