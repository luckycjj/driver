<template>
    <div id="authentication">
      <div id="title" v-title data-title="认证"></div>
      <ul id="step">
        <li v-for="(item,index) in step" :class="nowStep == ( index + 1) ? 'stepNowColor' : nowStep > (index + 1) ? 'stepBeforeColor' : nowStep < (index + 1) ? 'stepAfterColor' : '' ">
          <div class="stepNumber">
            <div :class="nowStep == ( index + 1) ? 'stepNow' : nowStep > (index + 1) ? 'stepBefore' : nowStep < (index + 1) ? 'stepAfter' : '' " class="line" style="margin-left: 0.05rem;" :style="{opacity: index == 0 ? '0' : '1'}"></div>
            <div :class="nowStep == ( index + 1) ? 'stepNow' : nowStep > (index + 1) ? 'stepBefore' : nowStep < (index + 1) ? 'stepAfter' : '' " class="circle">{{ index + 1}}</div>
            <div :class="nowStep == ( index + 1) ? 'stepNow' : nowStep > (index + 1) ? 'stepBefore' : nowStep < (index + 1) ? 'stepAfter' : '' " class="line" :style="{opacity: index == step.length - 1 ? '0' : '1'}"></div>
            <div class="clearBoth"></div>
          </div>
            {{item}}
        </li>
        <div class="clearBoth"></div>
      </ul>
        <div id="stepF" v-if="nowStep == 1">
          <div class="stepTtop">
            <p>请拍摄五官清晰头像照</p>
            <div class="fileup3" @click="BAIDURENLIAN()">
              <img src="../../images/addImg.png" v-if="message.first.people.bendi == ''">
             <!-- <input type="file" @change="fileImgUp($event,1)"  accept="firstimage/*"  capture = "user">-->
              <img :onerror="errorlogo" class="fileImg3" :src="message.first.people.bendi" v-if="message.first.people.bendi != ''">
              <h6 v-if="message.first.people.bendi == ''">点击拍照</h6>
            </div>
            <div class="SFZLook">
              <img src="../../images/ALEX.png"    @click="lookImg($event,require('../../images/ALEX.png'))">
              <span>样例</span>
            </div>
            <div class="clearBoth"></div>
          </div>
          <div class="stepTtop">
            <p>请拍摄本人身份证正面照</p>
            <div class="fileup2">
              <img src="../../images/addImg.png" v-if="message.first.idCardZ.bendi == ''">
              <input type="file" @change="fileImgUp($event,2)"  accept="image/*"  capture = "camera">
              <img :onerror="errorlogo" class="fileImg2" :src="message.first.idCardZ.bendi" v-if="message.first.idCardZ.bendi != ''">
              <h6 v-if="message.first.idCardZ.bendi == ''">点击拍照</h6>
            </div>
            <div class="SFZFLook">
              <img src="../../images/SFZZ.png"    @click="lookImg($event,require('../../images/SFZZ.png'))">
              <span>样例</span>
            </div>
            <div class="clearBoth"></div>
          </div>
          <div class="stepTtop">
            <p>请拍摄本人身份证反面照</p>
            <div class="fileup2">
              <img src="../../images/addImg.png" v-if="message.first.idCardF.bendi == ''">
              <input type="file" @change="fileImgUp($event,3)"  accept="image/*"  capture = "camera">
              <img :onerror="errorlogo" class="fileImg2" :src="message.first.idCardF.bendi" v-if="message.first.idCardF.bendi != ''">
              <h6 v-if="message.first.idCardF.bendi == ''">点击拍照</h6>
            </div>
            <div class="SFZFLook">
              <img src="../../images/SFZF.png"    @click="lookImg($event,require('../../images/SFZZ.png'))">
              <span>样例</span>
            </div>
            <div class="clearBoth"></div>
          </div>
          <div class="stepTbottom">
            <ul>
              <li>
                <span>邀请码：</span>
                <input type="text" placeholder="请输入邀请码" v-model="message.first.nvitationodeIC" maxlength="6"/>
                <div class="clearBoth"></div>
              </li>
              <li>
                <span>姓名：</span>
                <input type="text" placeholder="请输入姓名" v-model="message.first.name" maxlength="50"/>
                <div class="clearBoth"></div>
              </li>
              <li class="borderno">
                <span>身份证号：</span>
                <input type="text" placeholder="请真实填写" v-model="message.first.idCode" maxlength="18"/>
                <div class="clearBoth"></div>
              </li>
            </ul>
          </div>
        </div>
        <div id="stepS" v-if="nowStep == 2">
          <div class="stepStop">
            <p>请上传驾驶证</p>
            <div class="fileup2">
              <img src="../../images/addImg.png" v-if="message.second.driverLicense.bendi == ''">
              <input type="file" @change="fileImgUp($event,4)"  accept="image/*"  capture = "camera">
              <img  :onerror="errorlogo" class="fileImg2" :src="message.second.driverLicense.bendi" v-if="message.second.driverLicense.bendi != ''">
              <h6 v-if="message.second.driverLicense.bendi == ''">点击拍照</h6>
            </div>
            <div class="SFZFLook">
              <img src="../../images/JSZ.png"    @click="lookImg($event,require('../../images/JSZ.png'))">
              <span>样例</span>
            </div>
            <div class="clearBoth"></div>
          </div>
          <div class="stepSbottom">
            <ul>
              <li>
                <span>驾驶证等级：</span>
                <p id="Z00" :class="message.second.licType != '' ? 'blackColor' : '' " v-html="message.second.licType == '' ? '请选择驾驶证等级' : message.second.licType"></p>
                <div class="clearBoth"></div>
              </li>
            </ul>
          </div>
        </div>
        <h5 class="calltel">有问题请联系客服</h5>
        <button id="gonext" @click="goNext()" v-html="nowStep == 1 ? '下一步': '提交'"></button>
        <div v-if="baiduhuotiBox" id="baiduhuotiBox">
            <div id="baiduhuoti">
               <div id="baiduhuotiTop">
                 <img src="../../images/baiduhuoti.png">
                 <img src="../../images/closed.png" class="closedBaidu" @click="BAIDURENLIANLosed()">
                 <h6>正面平视手机、保证光线充足<br>请勿遮挡面部</h6>
               </div>
               <div id="baiduhuotiBottom">
                 <div class="prompt-box">
                   <div class="prompt-box-text">
                     <span class="prompt-box-text-number">1</span>
                     <span class="prompt-box-text-content">牢记验证码，点击开始录制</span>
                     <span class="prompt-box-text-border"></span>
                   </div>
                   <div class="prompt-box-text">
                     <span class="prompt-box-text-number">2</span>
                     <span class="prompt-box-text-content">开启前置摄像头，用普通话朗读数字</span>
                     <span class="prompt-box-text-border"></span>
                   </div>
                   <div class="prompt-box-text">
                     <span class="prompt-box-text-number">3</span>
                     <span class="prompt-box-text-content">完成录制，等待验证结果</span>
                     <!---->
                   </div>
                   <button @click="baidudumaNumber()">下一步</button>
                 </div>
               </div>
            </div>
        </div>
        <div v-if="baidudumaBox" id="baidudumaBox">
            <div id="baiduduma">
              <p>请牢记以下验证码</p>
              <h1>此验证码将于<span>{{daojishi}}</span>秒后过期<br>用普通话朗读数字，视频时长<span>3-8</span>秒最佳</h1>
               <h2>{{baidudumaHaoma}}</h2>
              <div id="fileVideo">
                <button>记住了，开始录制</button>
                <input type="file" accept="video/*"  capture = "camcorder" @change="video($event)">
              </div>
            </div>
            <img @click="baidunumberClosed()" src="../../images/icon_close.png">
        </div>
    </div>
</template>

<script>
  import {androidIos} from "../../js/app";
  import {bomb} from "../../js/zujian";
  import bridge from '../../js/bridge';
  import PinchZoom from "../../js/pinchzoom";
  import  {provinceCityArea} from "../../js/provinceCityArea"
    export default {
        name: "authenticationS",
        data(){
          return{
             step:["个人信息","个人资料"],
             nowStep:1,
             tranTypeList:[],
             tranTypeBox:false,
             baiduhuotiBox:false,
             baidudumaBox:false,
             baidudumaHaoma:"",
             message:{
                first:{
                  people:{
                    bendi:"",
                    http:"",
                  },
                 idCardZ:{
                   bendi:"",
                   http:"",
                 },
                 idCardF:{
                   bendi:"",
                   http:"",
                 },
                 name:"",
                 idCode:"",
                 nvitationodeIC:""
               },
               second:{
                 driverLicense:{
                   bendi:"",
                   http:"",
                 },
                 licType:"",
               }
             },
            daojishi:0,
            setTime:null,
            errorlogo: 'this.src="' + require('../../images/timg.jpg') + '"',
          }
        },
      watch:{
        message:{
          handler:function(val,oldval){
            var _this = this;
            _this.message.first.name = _this.message.first.name.replace(/[^\a-\z\A-\Z\u4E00-\u9FA5]/g,'');
            _this.message.first.idCode = _this.message.first.idCode.replace(/[^\X0-9\x]/g,'');
            _this.message.first.nvitationodeIC =  _this.message.first.nvitationodeIC.replace(/[^\a-\z\A-\Z0-9]/g,'');
            var type = _this.$route.query.type;
            if(type != undefined){
              localStorage.setItem("DRIVERSFETMESSAGE",JSON.stringify(_this.message));
            }
          },
          deep:true
        }
      },
      mounted:function () {
        var _this = this;
        var type = _this.$route.query.type;
        if(type != undefined){
           var DRIVERSFETMESSAGE = localStorage.getItem("DRIVERSFETMESSAGE");
           if(DRIVERSFETMESSAGE != undefined){
             _this.message = JSON.parse(DRIVERSFETMESSAGE);
           }
        }else{
          $.ajax({
            type: "POST",
            url: androidIos.ajaxHttp() + "/driver/findDriverInfo",
            data: JSON.stringify({
              userCode:sessionStorage.getItem("token"),
              source:sessionStorage.getItem("source")
            }),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            timeout:10000,
            success: function(getCarrAndCompanyInfo){
              if(getCarrAndCompanyInfo.success == "1"){
               _this.message = {
                 first:{
                   people:{
                     bendi:getCarrAndCompanyInfo.ftpUrl + getCarrAndCompanyInfo.photo,
                     http:getCarrAndCompanyInfo.photo,
                   },
                   idCardZ:{
                     bendi:getCarrAndCompanyInfo.ftpUrl + getCarrAndCompanyInfo.idCardPos,
                     http:getCarrAndCompanyInfo.idCardPos,
                   },
                   idCardF:{
                     bendi:getCarrAndCompanyInfo.ftpUrl + getCarrAndCompanyInfo.idCardNeg,
                     http:getCarrAndCompanyInfo.idCardNeg,
                   },
                   name:getCarrAndCompanyInfo.driverName,
                   idCode:getCarrAndCompanyInfo.idCardNum,
                   nvitationodeIC:getCarrAndCompanyInfo.inviteCode
                 },
                 second:{
                   driverLicense:{
                     bendi:getCarrAndCompanyInfo.ftpUrl + getCarrAndCompanyInfo.driverLic,
                     http:getCarrAndCompanyInfo.driverLic,
                   },
                   licType:getCarrAndCompanyInfo.licType,
                   licTypeCode:getCarrAndCompanyInfo.licType,
                 }
               }
              }else{
                androidIos.second(getCarrAndCompanyInfo.message);
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
        }
        androidIos.bridge(_this);
      },
       methods:{
          go:function(){
             var _this = this;
             _this.$nextTick(function () {
                 _this.showBefore();
             })
          },
         video:function (e) {
           var _this = this;
           var file =   e.target.files[0];
           var reader = new FileReader();
           reader.readAsDataURL(file);
           reader.onload = function(event) {
             androidIos.loading("正在上传");
             $.ajax({
               type: "POST",
               url: "https://aip.baidubce.com/rest/2.0/face/v1/faceliveness/verify",
               data:{
                 "access_token":"24.05638c6fcadcd3a62711c6f9ca49c3b1.2592000.1542524863.282335-11688876",
                 "video_base64":reader.result.split(",")[1],
               },
               contentType: "application/x-www-form-urlencoded",
               dataType: "json",
               timeout: 30000,
               success: function (json) {
                   if(json.result.score > 0.95){
                     clearInterval(_this.setTime);
                     _this.baidudumaHaoma = "";
                     _this.daojishi = 0;
                     $.ajax({
                       type: "POST",
                       url: androidIos.ajaxHttp() + "/uploadFile",
                       data:JSON.stringify({
                         type:  "USER",
                         name:"",
                         file:json.result.pic_list[1].pic,
                         userCode:sessionStorage.getItem("token"),
                         source:sessionStorage.getItem("source")
                       }),
                       contentType: "application/json;charset=utf-8",
                       dataType: "json",
                       timeout: 30000,
                       success: function (uploadFile) {
                         if (uploadFile.success == "1") {
                             _this.message.first.people.bendi = "data:image/jpeg;base64," + json.result.pic_list[1].pic;
                             _this.message.first.people.http = uploadFile.path;
                         } else{
                           androidIos.second(uploadFile.message);
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
                     $("#common-blackBox").remove();
                      androidIos.second("检测失败");
                   }
                  _this.baiduhuotiBox  = false;
                  _this.baidudumaBox = false;
               },
               complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
                 if (status == 'timeout') { //超时,status还有success,error等值的情况
                   androidIos.second("当前状况下网络状态差，请检查网络！")
                 } else if (status == "error") {
                   androidIos.errorwife();
                 }
               }
             });
           }
         },
         BAIDURENLIAN:function () {
           var _this = this;
           _this.baiduhuotiBox  = true;
         },
         BAIDURENLIANLosed:function () {
           var _this = this;
           _this.baiduhuotiBox  = false;
         },
         ajaxBaidu:function () {
            var _this = this;
           $.ajax({
             type: "POST",
             url: "https://aip.baidubce.com/rest/2.0/face/v1/faceliveness/sessioncode?access_token=24.2337ae84cff9e9a6e1dbc5cea10eb5cc.2592000.1542533645.282335-11688876",
             data:{
               "appid":"n69EmEIilvv4K9B0eDDMIEot",
             },
             success: function (json) {
               _this.baidudumaHaoma = json.result.code;
               _this.daojishi = 60;
             },
             complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
               if (status == 'timeout') { //超时,status还有success,error等值的情况
                 androidIos.second("当前状况下网络状态差，请检查网络！")
               } else if (status == "error") {
                 androidIos.errorwife();
               }
             }
           });
         },
         baidudumaNumber:function () {
           var _this = this;
           _this.baidudumaBox  = true;
           _this.setTime = setInterval(function () {
             if(_this.daojishi == 0){
               _this.ajaxBaidu();
             }else{
               _this.daojishi --;
             }
           },1000)

         },
         baidunumberClosed:function () {
           var _this = this;
           _this.baidudumaBox  = false;
           clearInterval(_this.setTime);
           _this.baidudumaHaoma = "";
           _this.daojishi = 0;
         },
         lic:function () {
            var _this = this;
           $.ajax({
             type: "GET",
             url: androidIos.ajaxHttp()+"/settings/getSysConfigList",
             data:{str:"lic_type",userCode:sessionStorage.getItem("token"),source:sessionStorage.getItem("source")},
             dataType: "json",
             timeout: 10000,
             success: function (getCarType) {
               var list = [];
               for(var i = 0; i<getCarType.length;i++){
                 var json = {
                   "code":getCarType[i].displayName,
                   "region":getCarType[i].value,
                 }
                 list.push(json)
               }
               var x = 0;
               for(var i = 0;i<list.length;i++){
                 if(list[i].region == _this.message.second.licType){
                   _this.message.second.licTypeCode = list[i].code;
                   x = i;
                 }
               }
               var area = new LArea();
               area.init({
                 'trigger': '#Z00',
                 'valueTo': '#Z00',
                 'keys': {
                   id: 'id',
                   name: 'name'
                 },
                 'type': 1,
                 'data': list
               });
               area.value = [x];
               area.addPointer = function (name) {
                 name = JSON.parse(name);
                 _this.message.second.licType =  name.firstVal;
                 _this.message.second.licTypeCode = name.firstCode;
               }
             },
             complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
               if(status=='timeout'){//超时,status还有success,error等值的情况
                 androidIos.second("网络请求超时");
               }else if(status=='error'){
                 androidIos.errorwife();
               }
             }
           });
         },
         tranTypeLook:function () {
           var _this = this;
           _this.tranTypeBox = true;
           if(_this.tranTypeList == 0){
             $.ajax({
               type: "GET",
               url: androidIos.ajaxHttp() + "/settings/getSysConfigList",
               data: {
                 str: "trans_type",
                 userCode: sessionStorage.getItem("token"),
                 source: sessionStorage.getItem("source")
               },
               dataType: "json",
               timeout: 30000,
               success: function (getSysConfigList) {
                 for(var i = 0 ;i < getSysConfigList.length ; i++){
                   getSysConfigList[i].choose = false;
                 }
                 _this.tranTypeList = getSysConfigList;
                 var list = _this.message.second.tranTypeNumber.split(",");
                 for(var x = 0 ; x < _this.tranTypeList.length ; x++){
                   _this.tranTypeList[x].choose = false;
                   for(var i = 0; i < list.length ; i++){
                     if(_this.tranTypeList[x].value - list[i] == 0){
                       _this.tranTypeList[x].choose = true;
                     }
                   }
                 }
               },
               complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
                 if (status == 'timeout') {//超时,status还有success,error等值的情况
                   androidIos.second("网络请求超时");
                 } else if (status == 'error') {
                   androidIos.errorwife();
                 }
               }
             })
           }else{
             var list = _this.message.second.tranTypeNumber.split(",");
             for(var x = 0 ; x < _this.tranTypeList.length ; x++){
               _this.tranTypeList[x].choose = false;
               for(var i = 0; i < list.length ; i++){
                 if(_this.tranTypeList[x].value - list[i] == 0){
                   _this.tranTypeList[x].choose = true;
                 }
               }
             }
           }
         },
         lookImg:function (even,imgurl) {
           var _this = this;
           if (even.target.className != "closed") {
             var img = imgurl;
             $("#imgBigbox").remove();
             $("body").append(
               "<div id='imgBigbox'><div class='pinch-zoom'><img onerror='"+ _this.errorlogo+"' id='zoomimg'  src='"+img+"' '></div><div id='zhezhaoImg'></div></div>"
             );
             $("#imgBigbox").css({
               width: "100%",
               height: "100%",
               position: "fixed",
               top: "0",
               left: "0",
               background: "rgb(0,0,0)",
               "z-index": "999",
               display: "block"
             });
             $("#zhezhaoImg").css({
               width: "100%",
               height: "100%",
               position: "absolute",
               background: "rgba(0,0,0,0)",
               "z-index": "999",
               top: "0",
               left: "0"
             });
             $("#imgBigbox img").css({ width: "100%", position: "absolute" });
             var image = document.getElementById("zoomimg");
             image.onload = function() {
               var height = $("#imgBigbox img").height();
               $("div.pinch-zoom").each(function() {
                 new PinchZoom($(this), {});
               });
               $(".pinch-zoom-container").css({
                 width: "100%",
                 height: "100%"
               });
               $("#imgBigbox img").css("top", "50%");
               $(".pinch-zoom").css({ width: "100%", height: "100%" });
               $("#imgBigbox img").css("margin-top", -height / 2 + "px");
               var setImgBox;
               var setImgBoxNumber = 10;
               setImgBox = setInterval(function() {
                 setImgBoxNumber--;
                 if (setImgBoxNumber < 9) {
                   clearInterval(setImgBox);
                   setImgBoxNumber = 10;
                   $("#zhezhaoImg").remove();
                 }
               }, 100);
             };
           }
         },
         showBefore:function () {
           var _this = this;
           if(_this.nowStep == 1){
             document.getElementById("authenticationTab").style.display = "none";
           }else{
             document.getElementById("authenticationTab").style.display = "block";
             document.getElementById("authenticationTab").onclick = function () {
               _this.nowStep --;
               _this.showBefore();
             };
           }
         },
         goNext:function () {
           var _this = this;
           if(_this.nowStep == 1){
             if(_this.message.first.people.bendi == "" || _this.message.first.people.http == ""){
               bomb.first("请拍摄头像照");
               return false;
             }
             if(_this.message.first.idCardZ.bendi == "" || _this.message.first.idCardZ.http == ""){
               bomb.first("请拍摄身份证正面");
               return false;
             }
             if(_this.message.first.idCardF.bendi == "" || _this.message.first.idCardF.http == ""){
               bomb.first("请拍摄身份证反面");
               return false;
             }
             if(_this.message.first.name == ""){
               bomb.first("请填写姓名");
               return false;
             }
             if(_this.message.first.nvitationodeIC == ""){
               bomb.first("请填写邀请码");
               return false;
             }
             if(!androidIos.idCardCheck(_this.message.first.idCode)){
               bomb.first("请填写正确的身份证号");
               return false;
             }
           }
           if(_this.nowStep == 2){
             if(_this.message.second.driverLicense.bendi == "" || _this.message.second.driverLicense.http == ""){
               bomb.first("请拍摄驾驶证");
               return false;
             }
             if(_this.message.second.licTypeCode == ""){
               bomb.first("请选择驾驶证等级");
               return false;
             }
           }
           if(_this.nowStep < 2){
             _this.nowStep ++ ;
             _this.showBefore();
             _this.$nextTick(function () {
               _this.lic();
             })
           }else if(_this.nowStep == 2){
             androidIos.loading("正在上传");
             var data = {
               inviteCode:(_this.message.first.nvitationodeIC).toUpperCase(),
               driverName:_this.message.first.name,
               idCardNum : _this.message.first.idCode,
               driverLic:_this.message.second.driverLicense.http,
               idCardPos:_this.message.first.idCardZ.http,
               idCardNeg:_this.message.first.idCardF.http,
               licType:_this.message.second.licTypeCode,
               source :sessionStorage.getItem("source"),
               userCode:sessionStorage.getItem("token"),
               photo:_this.message.first.people.http,
             }
             $.ajax({
               type: "POST",
               url: androidIos.ajaxHttp() + "/driver/uploadDriverInfo" ,
               data:  JSON.stringify(data),
               contentType: "application/json;charset=utf-8",
               dataType: "json",
               timeout:20000,
               success: function(data){
                 if(data.success=="1"){
                   _this.$cjj("上传成功");
                   localStorage.removeItem("DRIVERSFETMESSAGE");
                   setTimeout(function () {
                     androidIos.gobackFrom(_this);
                   },500)
                 }else if(data.success=="-1"){
                   androidIos.second(data.message);
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
           }
         },
         fileImgUp:function (e,type) {
           var _this = this;
           for (var i = 0; i < e.target.files.length; i++) {
             _this.compress(_this.getObjectURL(e.target.files[i]),"1000","1000",type);
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
             androidIos.loading("正在上传");
             $.ajax({
               type: "POST",
               url: androidIos.ajaxHttp() + "/uploadFile",
               data:JSON.stringify({
                 type: type == 0 ? "SQH" : type == 1 ? "USER" : type == 2 ? "SFZZ" : type == 3 ? "SFZF" : type == 4 ? "JSZ": type == 5 ? "XSZ" : type == 6 ? "DLYS" :"",
                 name:"",
                 file: base64.substr(23),
                 userCode:sessionStorage.getItem("token"),
                 source:sessionStorage.getItem("source")
               }),
               contentType: "application/json;charset=utf-8",
               dataType: "json",
               timeout: 30000,
               success: function (json) {
                 if (json.success == "1") {
                   if(type == 1){
                     _this.message.first.people.bendi = base64;
                     _this.message.first.people.http = json.path;
                   }else if(type == 2){
                     _this.message.first.idCardZ.bendi = base64;
                     _this.message.first.idCardZ.http = json.path;
                     $.ajax({
                       type: "POST",
                       url: "https://aip.baidubce.com/rest/2.0/ocr/v1/idcard?access_token=24.05638c6fcadcd3a62711c6f9ca49c3b1.2592000.1542524863.282335-11688876",
                       data:{
                         "detect_direction":"true",
                         "detect_risk":"true",
                         "id_card_side": "front",
                         "image":base64.substr(23),
                       },
                       contentType: "application/x-www-form-urlencoded",
                       dataType: "json",
                       timeout: 30000,
                       success: function (json) {
                             _this.message.first.name = json.words_result.姓名.words;
                             _this.message.first.idCode = json.words_result.公民身份号码.words;
                       },
                       complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
                         if (status == 'timeout') { //超时,status还有success,error等值的情况
                           androidIos.second("当前状况下网络状态差，请检查网络！")
                         } else if (status == "error") {
                           androidIos.errorwife();
                         }
                       }
                     });
                   }else if(type == 3){
                     _this.message.first.idCardF.bendi = base64;
                     _this.message.first.idCardF.http = json.path;
                   }else if(type == 4){
                     _this.message.second.driverLicense.bendi = base64;
                     _this.message.second.driverLicense.http = json.path;
                   }
                 } else{
                   androidIos.second(json.message);
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
           }
         },
       }
    }
</script>

<style scoped>
#authentication{
  position: absolute;
  top:1.3rem;
  bottom:0;
  background: #f6f6f6;
  height: auto;
  width:100%;
  overflow-y: scroll;
}
  #step{
    width:9.12rem;
    margin:0.56rem auto 0.48rem auto;
  }
#step li{
   width:4.56rem;
   float: left;
  text-align: center;
  color:#999;
  font-size: 0.35rem;
}
.stepNumber{
  margin-bottom: 0.467rem;
}
  #step .line{
     width:1.9rem;
     height:0.05rem;
     background: #e7e6e7;
     float: left;
     margin-top: 0.225rem;
  }
#step .circle{
  width:0.5rem;
  height:0.5rem;
  line-height: 0.5rem;
  background: #e7e6e7;
  color:white;
  border-radius: 50%;
  float: left;
  margin:0 0.1rem;
}
  .stepNow{
     background: #2c9cff!important;
  }
  .stepBefore{
    background: #90caf6!important;
  }
  .stepAfter{
    background: #e7e6e7!important;
  }
.stepNowColor{
  color: #2c9cff!important;
}
.stepBeforeColor{
  color: #90caf6!important;
}
.stepAfterColor{
  color: #999!important;
}
  .stepFtop,.stepStop,.stepTtop{
    width:76%;
    padding: 0.5rem 12%;
    background: white;
  }
  .stepFtop p,.stepFbottom  h5,.stepStop p,.stepTtop p{
    color:#999999;
    font-size:0.4rem ;
  }
  .fileup,.fileup2,.fileup3{
    width:2.53rem;
    height:3.67rem ;
    background:#F4F5F6 ;
    margin-top: 0.467rem;
    border:1px solid #fff;
    float: left;
    position: relative;
  }
  .fileImg{
    width:2.53rem!important;
    height:3.67rem ;
    position: relative;
    margin: 0 !important;
  }
  .fileImg3{
    width:2.53rem!important;
    height:2.53rem!important ;
    position: relative;
    margin: 0 !important;
  }
  .fileImg2{
    width:4.14rem!important;
    height:2.53rem!important ;
    position: relative;
    margin: 0 !important;
  }
.fileup input,.fileup2 input,.fileup3 input{
  position: absolute;
  width:100%;
  height: 100%;
  opacity: 0;
  top:0;
  left:0;
  z-index: 11;
}
  .fileup2{
    width:4.14rem;
    height:2.53rem ;
  }
.fileup3{
  width:2.53rem;
  height:2.53rem ;
}
.borderno{
  border:none!important;
}
.fileup img{
  width:1.17rem;
  margin:1.25rem auto 0 auto;
}
.fileup2 img,.fileup3 img{
  width:1.17rem;
  margin:0.6rem auto 0 auto;
}
.fileup h6{
  text-align: center;
  color:#999;
  font-size:0.3125rem ;
  margin-top: 0.47rem;
}
.fileup2 h6,.fileup3 h6{
  text-align: center;
  color:#999;
  font-size:0.3125rem ;
  margin-top: 0.21rem;
}
  .YYZZLook{
     float: left;
     width:2rem;
     margin-left: 0.56rem;
     margin-top:1.28rem;
    position: relative;
  }
.YYZZLook img{
  width:100%;
}
.YYZZLook span{
  position: absolute;
  top:0;
  right:0;
  background: black;
  color:white;
  padding: 0.04rem 0.1rem;
  font-size: 0.3125rem;
  border-bottom-left-radius: 0.1rem;
}
  .SFZLook{
    float: left;
    width:2rem;
    margin-left: 0.56rem;
    margin-top:1.28rem;
    position: relative;
  }
.SFZLook img{
  width:100%;
}
.SFZLook span{
  position: absolute;
  top:0;
  right:0;
  background: black;
  color:white;
  padding: 0.04rem 0.1rem;
  font-size: 0.3125rem;
  border-bottom-left-radius: 0.1rem;
}
  .SFZFLook{
    float: left;
    width:2.84rem;
    margin-left: 0.56rem;
    margin-top:1.0rem;
    position: relative;
  }
.SFZFLook img{
  width:100%;
}
.SFZFLook span{
  position: absolute;
  top:0;
  right:0;
  background: black;
  color:white;
  padding: 0.04rem 0.1rem;
  font-size: 0.3125rem;
  border-bottom-left-radius: 0.1rem;
}
  .calltel{
    font-size: 0.3125rem;
    text-align: center;
    color:#546C98;
    width: 2.7rem;
    padding-right: 0.5rem;
    display: block;
    margin: 0.21rem auto 0 auto;
    background-repeat: no-repeat;
    background-size: 0.4rem 0.4rem;
    background-position: 100% 50%;
    background-image: url("../../images/kefuicon.png");
    line-height: 0.5rem;
  }
  #gonext{
    width:9.1rem;
    display: block;
    color:white;
    border-radius: 0.2rem;
    margin:0.4rem auto;
    background: -webkit-linear-gradient(left, #00C4FF , #0074FF); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(right, #00C4FF, #0074FF); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(right, #00C4FF, #0074FF); /* Firefox 3.6 - 15 */
    background: linear-gradient(to right, #00C4FF , #0074FF); /* 标准的语法 */
    font-size: 0.427rem;
    line-height: 1.08rem;
  }
.stepSbottom,.stepTbottom,.stepFbottom{
   width:100%;
  background: white;
  margin-top: 0.24rem;
}
  .stepSbottom ul,.stepTbottom ul,.stepSbottom ul{
     width:100%;
  }
.stepSbottom ul li,.stepTbottom ul li,.stepFbottom ul li{
    height: 1.33rem;
   width:100%;
  border-bottom: 1px solid #e5e5e5;
}
.stepSbottom ul li span,.stepTbottom ul li span,.stepFbottom ul li span{
  float: left;
  line-height: 1.33rem;
   font-size:0.426rem ;
  color:#333;
  margin-left: 0.56rem;
}
.stepSbottom ul li input,.stepTbottom ul li input,.stepFbottom ul li input{
  float: right;
  line-height: 0.45rem;
  margin-top:0.4rem ;
  font-size:0.426rem ;
  color:#333;
  width:6.15rem;
  margin-right: 0.2rem;
}
  #X00{
    float: right;
    line-height: 0.45rem;
    margin-top:0.44rem ;
    font-size:0.426rem ;
    color:#BCBCBC;
    width:6.15rem;
    margin-right: 0.2rem;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .classCompanyName{
    float: right;
    line-height: 1.33rem;
    font-size:0.426rem ;
    color:#333;
    width:6.15rem;
    margin-right: 0.2rem;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  #tranTypeBigBox{
    float: right;
    line-height: 1.33rem;
    font-size:0.426rem ;
    color:#BCBCBC;
    width:6.15rem;
    margin-right: 0.2rem;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .blackColor{
    color: #333333!important;
  }
#tranTypeBox{
  position: fixed;
  width:100%;
  top:0;
  bottom:0;
  height: auto;
  z-index: 44;
  background: rgba(0,0,0,0.3);
}
#tranType{
  width: 100%;
  background: white;
  position: absolute;
  bottom:0;
}
#tranType button{
  width:90%;
  line-height: 1rem;
  background: #2c9cff;
  color:white;
  display: block;
  margin: 0.8rem auto 0.3rem auto;
  font-size: 0.375rem;
  border-radius: 0.2rem;
}
#tranType p{
  text-align: center;
  font-size: 0.375rem;
  color:#333;
  line-height: 1rem;
  border-bottom: 1px solid #e6e6e6;
}
.tranTypeBox{
  width:93%;
  margin: 0 auto;
  max-height: 10rem;
}
.tranType{
  margin-top: 0.3rem;
}
.chooseTrue{
  background:#2C9CFF!important;
  color:white!important;
}
.chooseLicType{
  float: right;
  font-size: 0.375rem;
  color:#333;
}
.tranTypeBox h6{
  font-size: 0.375rem;
  color:#333;
}
.tranTypeBox h6 span{
  color:#999;
  font-size: 0.35rem;
}
.tranType li{
  float: left;
  display: block;
  width: 18.5%;
  padding:0 1.375% ;
  text-align: center;
  line-height: 0.8rem;
  font-size: 0.35rem;
  background-color: #f3f3f3;
  color:#666;
  border-radius: 0.2rem;
  margin-top: 0.4rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-left: 3%;
}
.chooseTrue{
  background-color: #2c9cff!important;
  color:white!important;
}
#tranType img{
  position: absolute;
  width:1rem;
  z-index: 1;
}
  #stepBox{
    position: absolute;
    top:2.3rem;
    bottom:0;
    width:100%;
    height:auto;
    overflow-y: scroll;
  }
#Z00{
  float: right;
  line-height: 0.45rem;
  margin-top:0.44rem ;
  font-size:0.426rem ;
  color:#BCBCBC;
  width:6.15rem;
  margin-right: 0.2rem;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
  #baiduhuotiBox{
     position: fixed;
    top:0;
    bottom:0;
    z-index: 122;
    height: auto;
    width:100%;
    background: rgba(0,0,0,0.2);
  }
  #baiduhuoti{
     width:90%;
     margin: 1.3rem auto 0 auto;
    background: #f6f6f6;
    border-radius: 0.2rem;
    box-shadow: 0 0 10px #d2d2d2;
  }
#baiduhuoti img{
  width:50%;
  margin:0 auto;
}
#baiduhuotiTop{
  position: relative;
}
.closedBaidu{
  position: absolute;
  top:0;
  right:0;
  width:1rem!important;
}
#baiduhuotiTop h6{
  font-size: 0.35rem;
  color: #999;
  letter-spacing: 0;
  line-height: 0.6rem;
  text-align: center;
}
  #baiduhuotiBottom{
    width:100%;
    background: white;
  }
.prompt-box {
  padding: 1.33rem 0;
}
.prompt-box-text {
  margin: 0 auto 0.85312rem;
  height: 0.42688rem;
  line-height:0.42688rem;
  width: 7.52rem;
}
.prompt-box-text-number {
  -webkit-border-radius: 0.3rem;
  -moz-border-radius: 0.3rem;
  border-radius:  0.3rem;
  border: 1px solid #0073eb;
  text-align: center;
  color: #0073eb;
  display: inline-block;
  width: 0.42688rem;
  height:0.42688rem;
  line-height: 0.42688rem;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  font-size: 0.3125rem;
  margin-right: .26656rem;
  letter-spacing: 0;
  vertical-align: top;
}
.prompt-box-text-content {
  color: #333;
  letter-spacing: 0;
  white-space: nowrap;
  display: inline-block;
  font-size: 0.4rem;
}
.prompt-box-text-border {
  height:0.608rem;
  margin: .13344rem 0 .13344rem .1888rem;
  width: 0;
  border-left: 1px dotted #0073eb;
  display: block;
}
  #baiduhuoti button{
    width:90%;
    display: block;
    color:white;
    border-radius: 0.2rem;
    margin:0.4rem auto;
    background: -webkit-linear-gradient(left, #00C4FF , #0074FF); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(right, #00C4FF, #0074FF); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(right, #00C4FF, #0074FF); /* Firefox 3.6 - 15 */
    background: linear-gradient(to right, #00C4FF , #0074FF); /* 标准的语法 */
    font-size: 0.427rem;
    line-height: 1.08rem;
  }
  #fileVideo{
     width:90%;
    margin:0.4rem auto;
    position: relative;
  }
#baiduduma  input{
  width:100%;
  height:1.08rem;
  position: absolute;
  top:0;
  left:0;
  opacity: 0;
}
#baiduduma  button{
  width:100%;
  display: block;
  color:white;
  border-radius: 0.2rem;
  background: -webkit-linear-gradient(left, #00C4FF , #0074FF); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(right, #00C4FF, #0074FF); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(right, #00C4FF, #0074FF); /* Firefox 3.6 - 15 */
  background: linear-gradient(to right, #00C4FF , #0074FF); /* 标准的语法 */
  font-size: 0.427rem;
  line-height: 1.08rem;
}
  #baidudumaBox{
    position: fixed;
    top:0;
    bottom:0;
    z-index: 133;
    height: auto;
    width:100%;
    background: rgba(0,0,0,0.2);
  }
  #baiduduma{
    width:80%;
    margin: 1.3rem auto 0 auto;
    background: white;
    border-radius: 0.2rem;
    box-shadow: 0 0 10px #d2d2d2;
    border:1px solid white;
  }
  #baiduduma p{
    font-size: 0.4rem;
    color: #333;
    height: 0.42656rem;
    line-height: 0.42656rem;
    text-align: center;
    margin: 0.98656rem 0 0.4rem;
  }
#baiduduma h1{
  font-size: 0.37312rem;
  color: #666;
  text-align: center;
  margin-bottom: 0.5472rem;
  letter-spacing: 0;
}
#baiduduma h2{
  font-size: 0.45rem;
  color: #333;
  text-align: center;
  margin-bottom: 0.5472rem;
  letter-spacing: 0;
}
  #baidudumaBox img{
    width:1rem;
    margin:0.3rem auto 0 auto
  }
</style>
