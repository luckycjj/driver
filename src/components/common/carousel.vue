<template>
    <div id="carousel" v-if="show">
           <ul :style="{width:10 * imgList.length + 'rem',left:left + 'rem'}">
              <li v-for="(item,index) in imgList" :class="nowIndex == index ? 'in' : ''">
                <img :src="item"  @touchstart="liTouchstart($event)" @touchmove="liTouchmove($event)" @touchend="liTouchend($event)">
                <button v-if="index == imgList.length - 1 " @click="showFalse()">开启任务</button>
              </li>
             <li class="clearBoth"></li>
           </ul>
           <div id="circleBox">
             <div class="circle" v-for="(item,index) in imgList" :style="{marginRight:index < imgList.length - 1 ? '0.1rem' : ''}" :class="index == nowIndex ? 'circleTrue' : ''"></div>
           </div>
    </div>
</template>

<script>
  import {androidIos} from "../../js/app";
  export default {
        name: "carousel",
        data(){
           return{
             imgList:[require("../../images/img1.png"),require("../../images/img2.png"),require("../../images/img3.png")],
             nowIndex:0,
             startX:0,
             endX:0,
             startY:0,
             endY:0,
             left:0,
           }
        },
      props:['show'],
      methods:{
        showFalse:function () {
          this.$parent.showBox();
        },
        liTouchstart:function (event) {
          var _this = this;
          var touch = event.targetTouches[0];
          _this.startX = touch.pageX;
          _this.startY = touch.pageY;
        },
        liTouchmove:function (event) {
          var _this = this;
          var touch = event.targetTouches[0];
          _this.endX = touch.pageX;
          _this.endY = touch.pageY;
        },
        liTouchend:function (event) {
          var _this = this;
          var num = _this.endX - _this.startX;
          if(num < -75){
             if(_this.nowIndex < _this.imgList.length - 1){
               _this.nowIndex++ ;
               _this.Leftgo(1);
             }
          }else if(num > 75){
            if(_this.nowIndex > 0 ){
              _this.nowIndex --;
              _this.Leftgo(0);
            }
          }
        },
        Leftgo:function (type) {
           var _this = this;
           var setTime ;
           var time = 0;
           if(type == 0){
             setTime = setInterval(function () {
               if(time < 10){
                 time++;
                 _this.left ++ ;
               }else{
                 clearInterval(setTime);
               }
             },20)
           }else if(type == 1){
               setTime = setInterval(function () {
                   if(time < 10){
                       time++;
                      _this.left -- ;
                   }else{
                      clearInterval(setTime);
                   }
               },20)
           }
        }
      }
    }
</script>

<style scoped>
 #carousel{
   position: absolute;
   top:0;
   left:0;
   width:100%;
   height: 100%;
   z-index: 100;
   overflow: hidden;
 }
 ul{
   width:100%;
   position: absolute;
   height: 100%;
   top:0;
   left:0;
 }
 ul li{
   width:10rem;
   position: relative;
   height: 100%;
   float: left;
 }
 ul li img{
    width:100%;
   position: absolute;
   height: 100%;
   top:0;
   left:0;
 }
 li button{
   width:4rem;
   line-height: 1.3rem;
   color:white;
   border-radius: 0.1rem;
   border:1px solid #1a6bac;
   position: absolute;
   bottom:1.6rem;
   left:50%;
   margin-left: -2rem;
   background: #1a6bac;
   font-size: 0.4rem;

 }
  #circleBox{
    position: absolute;
    bottom:1rem;
    text-align: center;
    width:100%;
  }
 #circleBox .circle{
   width:0.3rem;
   height:0.3rem;
   border-radius: 50%;
   background: #cde8fd;
   display: inline-block;
   transition: all .2s ease-out;
 }
 #circleBox .circleTrue{
   background: #1a6bac;
 }
</style>
