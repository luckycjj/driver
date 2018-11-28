<template>
    <div id="drawname">
      <div id="title" v-title data-title="电子签名"></div>
      <div id="canvas"></div>
      <div id="button">
        <button @click="clean()" class="shanchu"> 删除</button>
        <button @click="baocun()">保存</button>
      </div>
      <img :src="img" v-if="img != ''" id="scream">
    </div>
</template>

<script>
  import {androidIos} from "../../js/app";
  import {bomb} from "../../js/zujian";
    export default {
        name: "drawname",
        data(){
           return{
             canvasHeight:0,
             canvas:null,
             cxt:null,
             img:"",
           }
        },
        mounted:function () {
          var _this = this;
          androidIos.bridge(_this);
        },
        methods:{
           go:function () {
             var _this = this;
             androidIos.lineCanvas({
               el : document.getElementById("canvas"),//绘制canvas的父级div,
               that:_this
             });
             var peopleName = sessionStorage.getItem("peopleName");
             if(peopleName != null){
               _this.img = peopleName;
               _this.$nextTick(function () {
                 var img=document.getElementById("scream");
                 _this.cxt.drawImage(img,0,0);
               })

             }
           },
          clean:function () {
             var _this = this;
            _this.cxt.clearRect(0, 0, _this.canvas.width, _this.canvas.height);
          },
          baocun:function () {
            var _this = this;
            var imgBase64 = _this.canvas.toDataURL();
            sessionStorage.setItem("peopleName",imgBase64);
            androidIos.gobackFrom(_this);
          }
        }
    }
</script>
<style>
  #drawname{
    position: absolute;
    top:0;
    left:0;
    height:100%;
    width:100%;
  }
  #drawname #canvas{
    width: 100%;
    height: 80%;
    top:0;
    position: absolute;
    background: white;
  }
  #drawname #canvas canvas{
    display: block;
  }
  #drawname #clearCanvas{
    width: 50%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    position: absolute;
    bottom: 0;
    left: 0;
    border: 1px solid #DEDEDE;
    z-index: 1;
  }
  #drawname #saveCanvas{
    width: 50%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    position: absolute;
    bottom: 0;
    right: 0;
    border: 1px solid #DEDEDE;
    z-index: 1;
  }
  </style>
<style scoped>
  #drawname #button{
    position: absolute;
    bottom:0;
    width:10rem;
    height: 1.2rem;
  }
  #drawname #button button{
    float: left;
    width:50%;
    background: #1869A9;
    color:white;
    font-size: 0.4rem;
    height: 1.2rem;
  }
  .shanchu{
    background: #eaeaea!important;
    color:#1869A9!important;
  }
  </style>
