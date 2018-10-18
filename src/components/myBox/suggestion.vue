<template>
  <div id="suggestion">
    <div id="title" v-title data-title="建议反馈"></div>
    <div id="textarea">
       <textarea @keyup="changeGo()" placeholder="请写下您遇到的问题..." :maxlength="maxlength" v-model="suggest"></textarea>
       <p>{{suggest.length}}/{{maxlength}}</p>
      <div class="clearBoth"></div>
    </div>
    <button @click="submitGo()">提交</button>
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
  #textarea{
    width:94%;
    margin: 0.5rem auto;
    display: block;
    border: 1px solid #dadada;
    background: white;
  }
  textarea{
    font-size: 0.375rem;
    color:#666;
    resize:none;
    min-height: 3rem;
    padding: 3%;
    width:94%;
  }
  p{
    float: right;
    padding: 0.3rem 0.2rem;
    color:#999;
  }
  button{
    width:9.1rem;
    background: -webkit-linear-gradient(left, #00C4FF , #0074FF); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(right, #00C4FF, #0074FF); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(right, #00C4FF, #0074FF); /* Firefox 3.6 - 15 */
    background: linear-gradient(to right, #00C4FF , #0074FF); /* 标准的语法 */
    color:white;
    display: block;
    margin: 0 auto;
    line-height: 1.2rem;
    font-size: 0.4rem;
    border-radius: 0.2rem;
  }
</style>
