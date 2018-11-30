<template>
    <div id="lookImg" style="top:1.3rem">
      <div id="title" v-title data-title="货物图片"></div>
      <ul v-if="imgList1.list.length > 0">
        <p>{{imgList1.name}}</p>
        <h1>{{imgList1.time}}</h1>
        <div class="clearBoth"></div>
        <li v-for="(item,index) in imgList1.list" :style="{marginRight:index % 3 != 2 ? '0.22rem': '0rem'}">
            <img :src="item.img"  :onerror="errorlogo "    @touchend="lookImg($event,item.img)">
        </li>
        <div class="clearBoth"></div>
      </ul>
      <ul v-if="imgList2.list.length > 0">
        <p>{{imgList2.name}}</p>
        <h1>{{imgList1.time}}</h1>
        <div class="clearBoth"></div>
        <li v-for="(item,index) in imgList2.list" :style="{marginRight:index % 3 != 2 ? '0.22rem': '0rem'}">
          <img :src="item.img"  :onerror="errorlogo"    @touchend="lookImg($event,item.img)">
        </li>
        <div class="clearBoth"></div>
      </ul>
      <div class="noImg"  v-if="imgList1.list.length == 0 && imgList2.list.length == 0">
        <img src="../../images/tupian-2.png">
        <p>暂无图片</p>
      </div>
    </div>
</template>

<script>
  import {androidIos} from "../../js/app";
  import {bomb} from "../../js/zujian";
  import bridge from '../../js/bridge';
  import PinchZoom from "../../js/pinchzoom";
    export default {
        name: "look-img",
        data(){
           return{
              imgList1:{
                 list:[],
                 name:"装货图片",
                 time:""
              },
             imgList2:{
               list:[],
               name:"卸货图片",
               time:""
             },
             errorlogo: 'this.src="' + require('../../images/timg.jpg') + '"',
           }
        },
        mounted:function () {
          var _this = this;
          androidIos.judgeIphoneX("lookImg",2);
          $.ajax({
            type: "POST",
            url: androidIos.ajaxHttp()+"/order/findMyUpload",
            data:JSON.stringify({vbillno:_this.$route.query.vbillno,originType:0,userCode:sessionStorage.getItem("token"),source:sessionStorage.getItem("source")}),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            timeout: 20000,
            success: function (findMyUpload) {
              if (findMyUpload.success == "1") {
                  for(var i = 0 ; i < findMyUpload.list.length;i++){
                     var list = findMyUpload.list[i].url.split(",");
                     for(var x = 0; x < list.length ; x++){
                       var json = {
                         img:findMyUpload.list[i].def1 + list[x]
                       }
                       _this.imgList1.time = findMyUpload.list[i].createTime.split(" ")[0];
                       _this.imgList1.list.push(json);
                     }
                  }
              }else{
                androidIos.second(findMyUpload.message);
              }

            },
            complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
              if(status=='timeout'){//超时,status还有success,error等值的情况
                androidIos.second("网络请求超时");
              }else if(status=='error'){
                androidIos.errorwife();
              }
            }
          })
          $.ajax({
            type: "POST",
            url: androidIos.ajaxHttp()+"/order/findMyUpload",
            data:JSON.stringify({vbillno:_this.$route.query.vbillno,originType:1,userCode:sessionStorage.getItem("token"),source:sessionStorage.getItem("source")}),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            timeout: 20000,
            success: function (findMyUpload) {
              if (findMyUpload.success == "1") {
                for(var i = 0 ; i < findMyUpload.list.length;i++){
                  var list = findMyUpload.list[i].url.split(",");
                  for(var x = 0; x < list.length ; x++){
                    var json = {
                      img:findMyUpload.list[i].def1 + list[x]
                    }
                    _this.imgList2.time = findMyUpload.list[i].createTime.split(" ")[0];
                    _this.imgList2.list.push(json);
                  }
                }
              }else{
                androidIos.second(findMyUpload.message);
              }

            },
            complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
              if(status=='timeout'){//超时,status还有success,error等值的情况
                androidIos.second("网络请求超时");
              }else if(status=='error'){
                androidIos.errorwife();
              }
            }
          })
        },
      methods:{
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
  #lookImg{
    position:absolute;
    top:1.3rem;
    bottom:0;
    height: auto;
    width:100%;
    background: #f6f6f6;
  }
  ul{
     width:8.6rem;
    padding: 0.2rem 0.7rem;
    background: white;
    margin-bottom: 0.2rem;
    margin-top: 1px;
  }
  ul p {
    font-size: 0.43rem;
   margin-top: 0.1rem;
    color:#373737;
    float: left;
  }
  ul h1 {
    font-size: 0.32rem;
    margin-top: 0.1rem;
    color:#999;
    float: right;
  }
  ul li{
    width:2.72rem;
    float: left;
    margin-top: 0.24rem;
  }
  ul li img{
     width:100%;
    height:2.72rem;
  }
  .noImg{
    position: absolute;
    width:2.46rem;
    left:50%;
    margin-left: -1.23rem;
    top:33%;
  }
  .noImg img{
    width:2.46rem;
  }
  .noImg p {
    font-size:0.43rem;
    margin-top:0.7rem ;
    text-align: center;
    color:#C8C8C8;
  }
</style>
