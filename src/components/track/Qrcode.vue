<template>
   <div id="qrcode">
     <div id="title" v-if="ty == '0'" v-title data-title="交接二维码"></div>
     <div id="title" v-if="ty == '1'" v-title data-title="签收二维码"></div>
     <div id="title" v-if="ty == '2'" v-title data-title="订单二维码"></div>
     <canvas id="canvas"></canvas>
    <!-- <input type="file"  id="newfile" @change="jiexi($event)">-->
   </div>
</template>

<script>
  import QRCode from 'qrcode'
  import {androidIos} from "../../js/app";
  import reqrcode from  '../../js/reqrcode'
  export default {
        name: "qrcode",
    data(){
      return{
        QueryDetail:sessionStorage.getItem("orderPk"),
        ty:0,
      }
    },
    beforeMount:function () {
      var _this = this;
      _this.ty = _this.$route.query.ty;
    },
    mounted:function () {
      var _this = this;
      androidIos.bridge(_this);
    },
    methods:{
      go:function () {
        var _this = this;
        _this.ty = _this.$route.query.ty;
        _this.useqrcode();
      },
      jiexi:function (e) {
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
        console.log(getObjectURL(e.target.files[0]));// newfile[0]是通过input file上传的二维码图片文件
        reqrcode.decode(getObjectURL(e.target.files[0]));
        reqrcode.callback = function (imgMsg) {
          alert("二维码解析：" + imgMsg)
        }
      },
     useqrcode:function(){
       //生成的二维码内容，可以添加变量
       // 0 交接二维码 1签收二维码 2订单二维码
       var json = {
         pk:this.QueryDetail,
         type:this.$route.query.ty,
         time:(new Date()).getTime()
       };
       json = JSON.stringify(json);
       var canvas = document.getElementById('canvas');
       QRCode.toCanvas(canvas, json, function (error) {
       })
     }
   }
  }
</script>

<style scoped>
  #canvas{
    width: 80%!important;
    height: auto!important;
    margin: 1rem auto;
  }
</style>
