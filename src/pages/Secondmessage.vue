<template>
  <div id="message" style="top:1.3rem;">
    <div id="title" v-title data-title="消息"></div>
    <div id="messageBox">
      <ul>
        <li v-for="(item,index) in messageList" @click="messageLook(item.type)">
          <div class="imgBox">
             <div class="messageCorner" v-if="item.number > 0">{{item.number}}</div>
             <img :src="item.icon">
          </div>
          <p>{{item.name}}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
    import {androidIos} from "../js/app";
    import {bomb} from "../js/zujian";
    import bridge from '../js/bridge';
    export default {
      name: "message",
      data(){
         return{
           messageList:[{
             name : "系统信息",
             type:2,
             icon:require("../images/systemInformation.png"),
             number:0,
           }]
         }
      },
      mounted:function () {
        var _this = this;
        androidIos.judgeIphoneX("message",2);
        androidIos.bridge(_this);
      },
      methods:{
          go:function () {
            var _this = this;
            _this.marginWidth();
          },
          messageLook:function (type) {
            var _this = this;
            androidIos.addPageList();
            _this.$router.push({ path: '/listMessage',query:{type:type}});
          },
          marginWidth:function () {
            var _this = this;
            var corner = document.getElementsByClassName("messageCorner");
            for(var i = 0; i< corner.length;i++){
              var width = corner[i].scrollWidth;
              corner[i].style.marginRight = - width / (2*(_this.htmlSize())) + 0.05+ "rem";
            }
          },
          htmlSize:function () {
            return document.getElementsByTagName("html")[0].style.fontSize.replace("px","");
          }
      }
    }
</script>

<style scoped>
  #message{
    background: #f6f6f6;
    position:absolute;
    top:1.3rem;
    bottom:0;
    height: auto;
    width:100%;
  }
  #messageBox ul{
     width:100%;
  }
  #messageBox li{
     background-image: url("../images/lookMore.png");
     background-position: 95% 50%;
    background-repeat: no-repeat;
    background-size:0.23rem  0.4rem ;
    background-color: white;
    margin-top: 0.1rem;
    height: 1.85rem;
  }
  #messageBox li p{
     line-height: 1.85rem;
     color:#606060;
     float: left;
     font-size: 0.35rem;
     margin-left: 0.24rem;
  }
  .imgBox{
    width:1.2rem;
    height: 1.2rem;
    margin:0.325rem 0 0.325rem 0.35rem ;
    position: relative;
    float: left;
  }
  .imgBox img{
     width:100%;
  }
  .messageCorner{
    background: #fc4243;
    font-size: 0.3125rem;
    color:white;
    position: absolute;
    top:0;
    right:0rem;
    padding: 0.01rem 0.13rem;
    border-radius: 0.2rem;
  }
</style>
