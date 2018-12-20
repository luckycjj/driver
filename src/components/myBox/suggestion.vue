<template>
  <div id="suggestion" style="top:1.3rem;">
    <div id="title" v-title data-title="建议反馈"></div>
    <p class="title">问题描述</p>
    <div id="textarea">
      <textarea @input="changeGo()" placeholder="请写下您遇到的问题..." :maxlength="maxlength" v-model="suggest"></textarea>
      <p>{{suggest.length}}/{{maxlength}}</p>
      <div class="clearBoth"></div>
    </div>
    <button @touchend="submitGo()">提交</button>
  </div>
</template>

<script>
  import {androidIos} from "../../js/app";
  import {bomb} from "../../js/zujian";
  import bridge from '../../js/bridge';
  export default {
    name: "suggestion",
    data(){
      return{
        suggest:"",
        maxlength:200,
      }
    },
    mounted:function () {
      var _this = this;
      androidIos.judgeIphoneX("suggestion",2);
      androidIos.bridge(_this);
    },
    methods:{
      go:function () {
        var _this = this;
      },
      changeGo:function () {
        var _this = this;
        _this.suggest = _this.suggest.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\,\，\.\。\;\!\[\]\【\】]/g,'');
      },
      submitGo:function () {
        var _this = this;
        if(_this.suggest == ""){
          bomb.first("请描述你的问题");
          return false;
        }
        _this.$cjj("提交成功");
        setTimeout(function () {
          androidIos.gobackFrom(_this);
        },500)
      },
    }
  }
</script>

<style scoped>
  #suggestion{
    position:absolute;
    top:1.3rem;
    bottom:0;
    height: auto;
    width:100%;
    background: #f6f6f6;
  }
  .title{
    margin-left: 4.5%;
    font-size: 0.375rem;
    color:#333;
    line-height:1.253rem ;
  }
  #textarea{
    width:91%;
    margin: 0rem auto 0.5rem auto;
    display: block;
    background: white;
    border-radius: 0.2rem;
    position: relative;
  }
  textarea{
    font-size: 0.32rem;
    color:#666;
    resize:none;
    height: 4.1rem;
    padding: 0.3rem;
    width:94%;
    border-radius: 0.2rem;
  }
  #textarea p{
    position: absolute;
    padding: 0.3rem 0.2rem;
    color:#999;
    font-size: 0.3125rem;
    right:0.2rem;
    bottom:0.1rem;
  }
  button{
    width:9.1rem;
    background:#1D68A8;
    color:white;
    display: block;
    margin: 0 auto;
    line-height: 1.2rem;
    font-size: 0.4rem;
    border-radius: 0.2rem;
  }
</style>
