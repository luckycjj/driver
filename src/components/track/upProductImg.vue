<template>
    <div id="upProductImg" style="top:1.3rem;">
      <div id="title" v-title data-title="上传货品信息"></div>
      <div id="imgFileBox">
        <h2>上传货品名称</h2>
        <h1 >请拍摄/上传清晰的照片，以便核实货品数量，可传{{imgListLength}}张货品信息</h1>
        <div id="imgBigBox">
          <div class="imgBox"  v-for="(item,index) in imgList">
            <img :src="item.file" :onerror="errorlogo"  @click="lookImg($event,item.file)">
            <div class='closed' @click="removeImg(index)"></div>
          </div>
          <div class="addImgFirst" v-if="imgList.length < imgListLength">
            <img src="../../images/addImgP.png">
            <input type="file" multiple accept=".jpg,.png" id="imgFileS" @change="inputChange($event)">
            <p v-html="imgList.length == 0 ? '添加图片':imgList.length + '/' + imgListLength"></p>
          </div>
          <div class="clearBoth"></div>
        </div>
      </div>
    </div>
</template>

<script>
  import {androidIos} from "../../js/app";
  import {bomb} from "../../js/zujian";
  import PinchZoom from "../../js/pinchzoom";
    export default {
        name: "up-product-img",
        data(){
          return{
            imgList:[],
            imgListLength:6,
            errorlogo: 'this.src="' + require('../../images/timg.jpg') + '"'
          }
        },
      mounted:function () {
        var _this = this;
        androidIos.judgeIphoneX("upProductImg",2);
        androidIos.bridge(_this);
      },
      methods:{
           go:function () {
             var _this = this;
             $.ajax({
               type: "POST",
               url: androidIos.ajaxHttp() + "/order/findMyUpload",
               data: JSON.stringify({
                 userCode:sessionStorage.getItem("token"),
                 source:sessionStorage.getItem("source"),
                 originType:_this.$route.query.type,
                 vbillno:_this.$route.query.pk
               }),
               contentType: "application/json;charset=utf-8",
               dataType: "json",
               timeout:30000,
               success: function(findMyUpload){
                 if(findMyUpload.success == "1"){
                   for(var i = 0 ; i < findMyUpload.list.length;i++){
                     if(i == 0){
                       var list = findMyUpload.list[i].url.split(",");
                       for(var x = 0;x < list.length;x++){
                         _this.imgList.push({
                           file:findMyUpload.list[i].def1 + list[x],
                           httpfile:list[x],
                         })
                       }
                     }
                   }
                 }else{
                   androidIos.second(findMyUpload.message);
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
             document.getElementById("upProductImgEnter").onclick = function () {
               if( _this.imgList.length == 0){
                  bomb.first("请添加图片");
                  return false;
               }
               var list = [];
               for(var i = 0 ;i < _this.imgList.length;i++){
                  list.push(_this.imgList[i].httpfile);
               }
               androidIos.loading("正在上传");
               $.ajax({
                 type: "POST",
                 url: androidIos.ajaxHttp() + "/order/uploadGoodsImage",
                 data: JSON.stringify({
                   userCode:sessionStorage.getItem("token"),
                   source:sessionStorage.getItem("source"),
                   originType:_this.$route.query.type,
                   entrustVbillno:_this.$route.query.pk,
                   images:list.join(",")
                 }),
                 contentType: "application/json;charset=utf-8",
                 dataType: "json",
                 timeout:30000,
                 success: function(uploadGoodsImage){
                   if(uploadGoodsImage.success == "1"){
                      _this.$cjj("上传成功");
                      setTimeout(function () {
                        androidIos.gobackFrom(_this);
                      },500)
                   }else{
                     androidIos.second(uploadGoodsImage.message);
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
           },
        removeImg:function (index) {
          var _this = this;
          androidIos.first("确认删除吗?");
          $(".tanBox-yes").unbind('click').click(function(){
            $(".tanBox-bigBox").remove();
            _this.imgList.splice(index,1);
          });
        },
        inputChange:function (e) {
          var _this = this;
          for (var i = 0; i < e.target.files.length; i++) {
            if( i < _this.imgListLength - _this.imgList.length){
              _this.compress(_this.getObjectURL(e.target.files[i]),"1000","1000");
            }
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
        compress:function(img, MaximgW, MaximgH) {
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
            _this.imgList.push({
              file:base64,
              httpfile:base64,
            });
            $.ajax({
              type: "POST",
              url: androidIos.ajaxHttp() + "/uploadFile",
              data:JSON.stringify({
                type: "productImg",
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
                  _this.imgList.push({
                    file:base64,
                    httpfile:json.path,
                  });
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
      }
    }
</script>

<style scoped>
  #upProductImg{
    position: absolute;
    top:1.3rem;
    bottom:0;
    height: auto;
    background: #f6f6f6;
    width:100%;
  }
  .imgBox{
    width:2.2rem ;
    height: 2.2rem;
    float: left;
    border:1px solid white;
    margin-right: 0.12rem;
    margin-bottom:0.12rem;
    position: relative;
  }
  .imgBox img{
    width: 2.2rem;
    height: 2.2rem;
    overflow: hidden;
  }
  .addImgFirst{
    width:2.2rem;
    height:2.2rem;
    overflow: hidden;
    position: relative;
    float: left;
    border: 1px dashed #999;
  }
  .addImgFirst img{
    width:0.7rem ;
    margin:0.54rem auto 0.25rem auto;
  }
  .addImgFirst input{
    position: absolute;
    width:100%;
    top:0;
    bottom: 0;
    height: auto;
    opacity: 0;
  }
  .addImgFirst p {
    text-align: center;
    font-size: 0.3125rem;
    color:#999;
  }
  .closed{
    z-index:4;
    position:absolute;
    right:-0.2rem;
    top:-0.2rem;
    color:white;
    width:0.6rem;
    height: 0.6rem;
    background-image: url("../../images/ImglistHide.png");
    background-repeat: no-repeat;
    background-position: 50% 50%;
    background-size:cover;
  }
  #imgFileBox{
    width:8.5rem;
    padding: 0 0.75rem;
    margin-top: 2px;
    background: white;
    border-top: 1px solid white;
    border-bottom: 1px solid white;
  }
  #imgFileBox h2{
    font-size: 0.427rem;
    color:#373737;
    margin: 0.32rem 0;
  }
  #imgFileBox h1{
    font-size: 0.3467rem;
    color:#999;
  }
  #imgBigBox{
    width:7.2rem;
    margin:0.84rem auto ;
  }
</style>
