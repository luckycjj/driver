<template>
  <div id="user" style="top:0rem;">
    <div id="title" v-title data-title="个人中心"></div>
    <div id="userBox">
      <div id="headBox">
        <img src="../images/setUp.png" id="setUpGo" @click="setUpgo()">
        <div class="clearBoth"></div>
        <div id="head">
          <div id="photo" class="imgBox">
            <img :src="message.photo"   :onerror="errorlogo">
            <input type="file" @change="imgChange($event)">
          </div>
          <div style="float: left;width:50%;">
            <p>{{message.name}} <span v-html="message.status == '0' ? '未认证' :message.status == '1' ? '待审核' : message.status == '2' ? '已审核' : message.status == '3' ? '已驳回' : message.status == '4' ? '已禁用' : ''"></span></p>
          </div>
          <div class="lookMore"  style="height: 2.16rem" @click="renzhen()"><span v-if="message.status == 0">去认证</span></div>
          <div class="clearBoth"></div>
          <ul id="fuwuList">
            <li v-for="(item,index) in fuwuList" :style="{width:100/fuwuList.length + '%'}">
              <img :src="item.icon">
              {{item.name}}
            </li>
            <div class="clearBoth"></div>
          </ul>
        </div>
      </div>
       <ul id="labelBox">
         <li @click="lookMore(item)" v-for="(item,index) in tabList" :class="index % 2 == 0 ? (tabList.length -1 == index ? 'marTop' : 'marTop borderShow') : ''">
           <div class="tableIcon" :style="{backgroundImage:'url(' + item.icon + ')'}"></div>
           <p>{{item.name}}</p>
           <div class="lookMore"></div>
           <div class="clearBoth"></div>
           <input type="file" class="saoyisao"  @change="jiexi($event)" v-if="(item.name).indexOf('扫') != -1">
         </li>
       </ul>
    </div>
    <footComponent :idx='driverType'></footComponent>
    <transition name="slide-fade">
        <div id="shareBox" v-if="shareListTrue">
          <div id="shareBody">
            <div id="shareBodyTab">
              <p>分享至...</p>
              <label :style="{width:100 / shareList.length + '%'}" v-for="(item,index) in shareList">
                <img :src="item.icon" @click="shareType(index)">
                <h6>{{item.name}}</h6>
              </label>
              <div class="clearBoth"></div>
            </div>
            <button @click="shareYes(false)">取消</button>
          </div>
        </div>
    </transition>
  </div>
</template>

<script>
    import {androidIos} from "../js/app";
    import {bomb} from "../js/zujian";
    import bridge from '../js/bridge';
    import reqrcode from  '../js/reqrcode'
    export default {
        name: "user",
        data(){
           return{
              message:{
                 photo :null,
                 name : "",
                 status : "",
              },
             driverType:0,
             fuwuList:[{
               name:"违章查询",
               icon:require("../images/fuwu1.png"),
             },{
               name:"运费计算",
               icon:require("../images/fuwu2.png"),
             },{
               name:"优惠加油",
               icon:require("../images/fuwu3.png"),
             }],
             shareList:[{
                 name:"微信",
                 icon:require("../images/weChat.png"),
             },{
               name:"朋友圈",
               icon:require("../images/friendCircle.png"),
             },{
               name:"短信",
               icon:require("../images/shortMessage.png"),
             }],
             tabList:[{
               name:"扫一扫",
               icon:require("../images/saoyisao.png"),
               url:""
             },{
               name:"邀请码",
               icon:require("../images/icon-yaoqingma.png"),
               url:""
             },{
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
             shareListTrue:false,
           }
        },
      mounted:function () {
        var _this = this;
        _this.driverType = JSON.parse(sessionStorage.getItem("driverMessage")).driverType == 1 ? 2 : 2;
        if(JSON.parse(sessionStorage.getItem("driverMessage")).driverType == 1 ){
          _this.tabList.unshift({
            name:"结算中心",
            icon:require("../images/icon-userMoney.png"),
            url:"/settlementCenter"
          });
        }
        var PEOPLEPHOTO = localStorage.getItem("PEOPLEPHOTO");
        if(PEOPLEPHOTO != undefined){
          _this.message.photo =  PEOPLEPHOTO;
        }
        var driverMessage = sessionStorage.getItem("driverMessage");
        androidIos.judgeIphoneX("userBox",1);
        androidIos.judgeIphoneX("headBox",0);
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
                var PEOPLEPHOTO = localStorage.getItem("PEOPLEPHOTO");
                if(PEOPLEPHOTO != undefined){
                    androidIos.imgLoad(getUserInfo.photo,_this);
                }else{
                  _this.message.photo =  getUserInfo.photo;
                  if(getUserInfo.photo != ""){
                    androidIos.imgLoad(getUserInfo.photo,_this);
                  }
                }
                _this.message.name =   getUserInfo.name;
                _this.message.status =   getUserInfo.status;
                sessionStorage.setItem("driverMessage",JSON.stringify({
                  licType: getUserInfo.licType,
                  name:  getUserInfo.name,
                  photo:  getUserInfo.photo,
                  status:  getUserInfo.status,
                  corpName:  getUserInfo.corpName,
                  driverType:getUserInfo.type == 1 ? 2 : 1,
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
          renzhen:function () {
            var _this = this;
            androidIos.addPageList();
            _this.$router.push({path:'/statusNow'});
          },
        setUpgo:function () {
          var _this = this;
          androidIos.addPageList();
          _this.$router.push({ path: "/setUp"});
        },
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
        lookMore:function (item) {
          var _this = this;
          if(item.url != ""){
            androidIos.addPageList();
            _this.$router.push({ path: item.url});
          }else{
            if(item.name.indexOf("扫") == -1){
              _this.shareListTrue = true;
            }
          }
        },
        jiexi:function (enevt) {
          androidIos.loading("正在扫描");
          var getObjectURL = function (file) {
            var url = null;
            if (window.createObjectURL != undefined) { // basic
              url = window.createObjectURL(file);
            } else if (window.URL != undefined) { // mozilla(firefox)
              url = window.URL.createObjectURL(file);
            } else if (window.webkitURL != undefined) { // webkit or chrome
              url = window.webkitURL.createObjectURL(file);
            }
            return url;
          }
          reqrcode.decode(getObjectURL(enevt.target.files[0]));
          reqrcode.callback = function (imgMsg) {
            enevt.target.value = "";
            var img;
            try {
              img = JSON.parse(imgMsg);
            } catch (e) {
              img = "";
            }
            $("#common-blackBox").remove();
            if(img == ""){
               androidIos.second("扫描二维码失败,请重试!");
            }else{
               if(img.type != 0){
                 androidIos.second("请扫描交接二维码!");
               }else{
                 androidIos.first("确定交接吗？");
                 $(".tanBox-yes").unbind('click').click(function(){
                   $(".tanBox-bigBox").remove();
                   androidIos.loading("正在交接");
                   $.ajax({
                     type: "POST",
                     url: androidIos.ajaxHttp() + "/order/handover",
                     data: JSON.stringify({
                       userCode:sessionStorage.getItem("token"),
                       source:sessionStorage.getItem("source"),
                       pk:img.pk,
                       transPlace:"",
                     }),
                     contentType: "application/json;charset=utf-8",
                     dataType: "json",
                     timeout:30000,
                     success: function(handover){
                       if(handover.success == "1"){
                         _this.$cjj("交接成功");
                       }else{
                         androidIos.second(handover.message);
                       }
                     },
                     complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
                       $("#common-blackBox").remove();
                       if(status=='timeout'){//超时,status还有success,error等值的情况
                         androidIos.second("当前状况下网络状态差，请检查网络！")
                       }else if(status=="error"){
                         androidIos.errorwife();
                       }
                     }
                   });
                 });
               }
            }
          }
        },
        shareYes:function (type) {
          var _this = this;
          _this.shareListTrue = type;
        },
        shareType:function (index) {
          var _this = this;
          if(index == 0){

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
  #userBox{
    overflow: scroll;
    margin-bottom: 1.4rem;
  }
#user{
  position:absolute;
  top:0rem;
  bottom:0;
  height: auto;
  width:100%;
  background: #f6f6f6;
}
.saoyisao{
  position: absolute;
  left:0;
  top:0;
  bottom:0;
  height:auto;
  width:100%;
  opacity: 0;
}
.imgBox img{
  width:1.6rem;
  height: 1.6rem;
}
#headBox{
  width:100%;
  background: #46B2E7;
  height: 2.7rem;
}
  #head{
     width:96.4%;
    background: white;
    position: relative;
    margin:0.32rem auto 0 auto;
    border-radius: 0.2rem;
  }
  .imgBox{
    width:1.4rem;
    height: 1.4rem;
    position: relative;
    overflow: hidden;
    border-radius: 50%;
    float: left;
    margin: 0.41rem 0.5rem 0.35rem 0.44rem;
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
    font-size: 0.42rem;
    margin-top: 0.8rem;
  }
  #head p span{
    color:#999;
    font-size: 0.3125rem;
  }
#head h1{
  color:#999999;
  font-size: 0.3125rem;
}
  .lookMore{
    width:50%;
    height: 100%;
    line-height: 2.16rem;
    color:#999;
    position: absolute;
    font-size: 0.3125rem;
    background-image: url("../images/lookMore.png");
    right: 4%;
    top:0;
    background-repeat: no-repeat;
    background-position: 100% 50%;
    background-size:0.25rem;
    text-align: right;
  }
  .lookMore span{
    margin-right: 0.5rem;
    font-size: 0.3125rem;
  }
  #labelBox{
    width:100%;
    margin-top: 2.8rem;
  }
  #labelBox li{
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
  #shareBox{
    position: fixed;
    top:0;
    bottom: 0;
    left:0;
    right:0;
    height:auto;
    width:auto;
    background-color: rgba(0,0,0,0.6);
  }
  #shareBody{
    position: absolute;
    bottom:0;
    width:92%;
    left:4%;
  }
#shareBody button{
   width:100%;
  margin: 0.2rem 0;
  line-height: 1rem;
  font-size: 0.35rem;
  letter-spacing: 2px;
  background:#ebebeb ;
  border-radius: 0.2rem;
}
  #shareBodyTab{
     background:#ebebeb ;
     padding: 0.2rem 0 0.3rem 0;
    border-radius: 0.2rem;
  }
#shareBodyTab p{
  text-align: center;
  font-size: 0.35rem;
  color:#333;
  line-height: 1rem;
}
#shareBodyTab label{
  float: left;
}
#shareBodyTab label img{
   width:30%;
  margin: 0.3rem auto 0.15rem auto;
}
#shareBodyTab label h6{
   font-size: 0.3125rem;
  color:#333;
  text-align: center;
}
/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateY(0.13rem);
  opacity: 0;
}
  #fuwuList{
    width:100%;
    padding-bottom: 0.375rem;
  }
  #fuwuList li{
    float: left;
    text-align: center;
    font-size: 0.34rem;
    color:#373737;
  }
  #fuwuList li img{
    width:0.8rem;
    display: block;
    margin:0.18rem auto 0.1rem auto ;
  }
  #setUpGo{
    float: right;
    margin-top: 0.44rem;
    margin-right: 0.65rem;
    width:0.453rem
  }
</style>
