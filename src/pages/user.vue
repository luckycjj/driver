<template>
  <div id="user">
    <div id="title" v-title data-title="个人中心"></div>
    <div id="userBox">
       <div id="head">
         <div id="photo" class="imgBox">
           <img :src="message.photo"   :onerror="errorlogo">
           <input type="file" @change="imgChange($event)">
         </div>
         <p>{{message.name}}</p>
         <h1 v-html="message.status == '0' ? '未认证' :message.status == '1' ? '待审核' : message.status == '2' ? '已审核' : message.status == '3' ? '已驳回' : message.status == '4' ? '已禁用' : ''"></h1>
         <div class="lookMore"  @click="lookMore('/statusNow')"><span v-if="message.status == 0">去认证</span></div>
         <div class="clearBoth"></div>
       </div>
       <ul>
         <li @click="lookMore(item.url)" v-for="(item,index) in tabList" :class="index % 2 == 0 ? (tabList.length -1 == index ? 'marTop' : 'marTop borderShow') : ''">
           <div class="tableIcon" :style="{backgroundImage:'url(' + item.icon + ')'}"></div>
           <p>{{item.name}}</p>
           <div class="lookMore"></div>
           <div class="clearBoth"></div>
         </li>
       </ul>
    </div>
    <footComponent :idx='2'></footComponent>
  </div>
</template>

<script>
    import {androidIos} from "../js/app";
    import {bomb} from "../js/zujian";
    import bridge from '../js/bridge';
    export default {
        name: "user",
        data(){
           return{
              message:{
                 photo :null,
                 name : "",
                 status : "",
              },
             tabList:[{
               name:"分享",
               icon:require("../images/share.png"),
               url:""
             },{
               name:"建议反馈",
               icon:require("../images/feedback.png"),
               url:"/suggestion"
             },{
               name:"关于我们",
               icon:require("../images/aboutUs.png"),
               url:"/aboutUs"
             }],
             errorlogo: 'this.src="' + require('../images/userImg.png') + '"',
             httpurl:"",
           }
        },
      mounted:function () {
        var _this = this;
        var driverMessage = sessionStorage.getItem("driverMessage");
        if(driverMessage != null) {
          driverMessage = JSON.parse(driverMessage);
          _this.message.photo = driverMessage.photo;
          _this.message.name = driverMessage.name;
          _this.message.status = driverMessage.status;
        }
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
            success: function (getUserInfo) {
              if (getUserInfo.success == "1") {
                _this.message.photo =  getUserInfo.photo;
                _this.message.name =   getUserInfo.name;
                _this.message.status =   getUserInfo.status;
                sessionStorage.setItem("driverMessage",JSON.stringify({
                  licType: getUserInfo.licType,
                  name:  getUserInfo.name,
                  photo:  getUserInfo.photo,
                  status:  getUserInfo.status,
                  corpName:  getUserInfo.corpName,
                }));
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

        androidIos.bridge(_this);
      },
      methods:{
        go:function () {
          var _this = this;
          $.ajax({
            type: "POST",
            url: androidIos.ajaxHttp() + "/settings/findParamValueByName ",
            data: JSON.stringify({
              userCode:sessionStorage.getItem("token"),
              source:sessionStorage.getItem("source"),
              paramName:"resourcePath"
            }),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            timeout:30000,
            success: function(findParamValueByName){
              if(findParamValueByName.success == "1"){
                _this.httpurl = findParamValueByName.paramValue;
              }else{
                androidIos.second(findParamValueByName.message);
              }
            },
            complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
              if(status=='timeout'){//超时,status还有success,error等值的情况
                androidIos.second("当前状况下网络状态差，请检查网络！")
              }else if(status=="error"){
                androidIos.errorwife();
              }
            }
          });
        },
        lookMore:function (url) {
          var _this = this;
          if(url != ""){
            androidIos.addPageList();
            _this.$router.push({ path: url});
          }
        },
        imgChange:function (e) {
          var _this = this;
          androidIos.loading("正在上传");
          for (var i = 0; i < e.target.files.length; i++) {
              _this.compress(_this.getObjectURL(e.target.files[i]),"1000","1000",2);
          }
          e.target.value = "";
        },
        getObjectURL:function(file) {
          var url = null;
          if (window.createObjectURL != undefined) { // basic
            url = window.createObjectURL(file);
          } else if (window.URL != undefined) { // mozilla(firefox)
            url = window.URL.createObjectURL(file);
          } else if (window.webkitURL != undefined) { // webkit or chrome
            url = window.webkitURL.createObjectURL(file);
          }
          return url;
        },
        compress:function(img, MaximgW, MaximgH,type) {
          var _this = this;
          var image = new Image();
          image.src = img ;
          var imageWidth =  "";
          var imageHeight = "";
          image.onload = function () {
            var canvas = document.createElement('canvas');
            if (image.width < MaximgW && image.height < MaximgH) {
              imageWidth = image.width;
              imageHeight = image.height;
            } else {
              if (image.width > image.height) {
                imageWidth = MaximgW;
                imageHeight = MaximgW * (image.height / image.width);
              } else if (image.width < image.height) {
                imageHeight = MaximgH;
                imageWidth = MaximgH * (image.width / image.height);
              } else {
                imageWidth = MaximgW;
                imageHeight = MaximgH;
              }
            }
            canvas.width = imageWidth;
            canvas.height = imageHeight;
            var con = canvas.getContext('2d');
            con.clearRect(0, 0, canvas.width, canvas.height);
            con.drawImage(image, 0, 0, imageWidth, imageHeight);
            var base64 = canvas.toDataURL('image/jpeg', 0.5).substr(0);
            if(type == 2){
              var photoUrl = "";
              $.ajax({
                type: "POST",
                url: androidIos.ajaxHttp() + "/uploadFile",
                data:JSON.stringify({
                  type: "TX" ,
                  file: base64.substr(23),
                  userCode:sessionStorage.getItem("token"),
                  source:sessionStorage.getItem("source")
                }),
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                async:false,
                timeout: 30000,
                success: function (json) {
                  if (json.success == "1") {
                    photoUrl = json.path;
                  } else{
                    androidIos.second(json.message);
                  }
                },
                complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
                  if (status == 'timeout') { //超时,status还有success,error等值的情况
                    androidIos.second("当前状况下网络状态差，请检查网络！")
                  } else if (status == "error") {
                    androidIos.errorwife();
                  }
                }
              });
              $.ajax({
                type: "POST",
                url: androidIos.ajaxHttp() + "/uploadAvatar",
                data:JSON.stringify({
                  path:photoUrl,
                  userCode:sessionStorage.getItem("token"),
                  source:sessionStorage.getItem("source")
                }),
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                async:false,
                timeout: 30000,
                success: function (uploadAvatar) {
                  if (uploadAvatar.success == "1") {
                    _this.$cjj("上传成功");
                    _this.message.photo = _this.httpurl + photoUrl;
                    var driverMessage = sessionStorage.getItem("driverMessage");
                    if( driverMessage != null){
                      driverMessage = JSON.parse(driverMessage);
                      driverMessage.photo = _this.message.photo;
                      sessionStorage.setItem("driverMessage",JSON.stringify(driverMessage));
                    }
                  } else{
                    androidIos.second(uploadAvatar.message);
                  }
                },
                complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
                  $("#common-blackBox").remove();
                  if (status == 'timeout') { //超时,status还有success,error等值的情况
                    androidIos.second("当前状况下网络状态差，请检查网络！")
                  } else if (status == "error") {
                    androidIos.errorwife();
                  }
                }
              });
            }else{
              _this.message.photo = base64;
            }
          }
        },
      }
    }
</script>

<style scoped>
#user{
  position:absolute;
  top:1.3rem;
  bottom:0;
  height: auto;
  width:100%;
  background: #f6f6f6;
}
.imgBox img{
  width:1.6rem;
  height: 1.6rem;
}
  #head{
     width:100%;
    background: white;
    height: 2.3rem;
    border-top: 2px solid #E5E5E5;
    position: relative;
  }
  .imgBox{
    width:1.6rem;
    height: 1.6rem;
    position: relative;
    overflow: hidden;
    border-radius: 50%;
    float: left;
    margin: 0.35rem 0.5rem 0.35rem 0.44rem;
  }
  .imgBox img{
    width:100%;
  }
  .imgBox input{
     width:100%;
    height:100%;
    position: absolute;
    top:0;
    left:0;
    opacity: 0;
  }
  #head p{
    color:#373737;
    font-size: 0.4rem;
    margin-top: 0.5rem;
  }
#head h1{
  color:#999999;
  font-size: 0.3125rem;
}
  .lookMore{
    width:15%;
    height: 100%;
    line-height: 2.3rem;
    color:#999;
    position: absolute;
    font-size: 0.3125rem;
    background-image: url("../images/lookMore.png");
    right: 4%;
    top:0;
    background-repeat: no-repeat;
    background-position: 100% 50%;
    background-size:0.25rem;
  }
  ul{
    width:100%;
  }
  li{
   background: white;
    position: relative;
  }
  .tableIcon{
      width:0.43rem;
      height: 1.3rem;
      margin-left: 0.44rem;
    background-repeat: no-repeat;
    background-size: 0.43rem;
    background-position: 50% 50%;
    float: left;
  }
  li p {
     float: left;
    line-height: 1.3rem;
    color:#373737;
    font-size: 0.375rem;
    margin-left: 0.27rem;
  }
  .marTop{
     margin-top: 0.27rem;
  }
  .borderShow{
    border-bottom: 1px solid #E5E5E5;
  }
</style>
