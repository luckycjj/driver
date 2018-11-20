<template>
  <div id="footer">
    <ul>
      <li :style="{width:100 /  (items.length) + '%'}" v-for='(item,index) of items' :class='[{on:index === idx} ]' @click="$router.push(item.push)">
        <div class="imgBox"  :class='[ item.cls , {imgSure:index === idx} ]'><div :style="{marginRight:item.marginRight}" class="corner" v-show="index == 0&& item.number > 0">{{item.number}}</div></div>
        <div id="footerUserTX" v-if="index == items.length - 1" :style="{display: item.show ? 'block' : 'none'}"></div>
        {{item.name}}
      </li>
      <div class="clearBoth"></div>
    </ul>
  </div>
</template>

<script>
    import {androidIos} from "../../js/app";
  import {bomb} from "../../js/zujian";
    export default {
        name: "footer",
        data() {
          return {
            items: null,
            type:1,
          }
        },
        props: ['idx'],
        beforeMount:function () {
          var _this = this;
          var json;
          var type= JSON.parse(sessionStorage.getItem("driverMessage")).driverType;
         _this.type = type;
          if(type == 1){
             json = [{
               number:0,
               marginRight:0,
               cls: "track",
               name: "任务",
               push: "/taskMoreHomePage"
             },{
               number:0,
               marginRight:0,
               cls: "robbing",
               name: "找货",
               push: "/robbingList"
             },{
                 number:0,
                 marginRight:0,
                 cls: "user",
                 name: "我的",
                 push: "/user"
             }]
          }else{
            json = [{
              number:0,
              marginRight:0,
              cls: "track",
              name: "任务",
              push: "/taskMoreHomePage"
            },{
              number:0,
              marginRight:0,
              cls: "robbing",
              name: "找货",
              push: "/robbingList"
            },{
                number:0,
                marginRight:0,
                cls: "user",
                name: "我的",
                push: "/user"
              }]
          }
          _this.items = json;
        },
        mounted:function () {
          var _this = this;
          androidIos.judgeIphoneX("footer",1);
          var driverBottomIcon = sessionStorage.getItem("driverBottomIcon");
          if(driverBottomIcon != undefined && JSON.parse(driverBottomIcon).length == _this.items.length){
            _this.items = JSON.parse(driverBottomIcon);
          }
          androidIos.bridge(_this);

        },
      methods:{
          go:function () {
            var _this = this;
            var driverMessage = sessionStorage.getItem("driverMessage");
            var status = JSON.parse(driverMessage).status;
            if(status != 0 && sessionStorage.getItem("token") != undefined){
              if(_this.type == 1){
                _this.items[2].show = false;
              }else{
                _this.items[2].show = false;
              }
              $.ajax({
                type: "POST",
                url: androidIos.ajaxHttp() + "/driver/driverBottomIcon",
                data:JSON.stringify({
                  userCode:sessionStorage.getItem("token"),
                  source:sessionStorage.getItem("source")
                }),
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                timeout: 30000,
                success: function (driverBottomIcon) {
                  if (driverBottomIcon.success == "1") {
                      _this.items[0].number = driverBottomIcon.orderCount*1;
                    _this.$nextTick(function () {
                      _this.marginWidth();
                      sessionStorage.setItem("driverBottomIcon",JSON.stringify(_this.items));
                    })
                  }else{
                    androidIos.second(driverBottomIcon.message);
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
            }else{
              if(_this.type == 1){
                _this.items[2].show = true;
                _this.items[0].number = 0;
              }else{
                _this.items[2].show = true;
                _this.items[0].number = 0;
              }
              _this.$nextTick(function () {
                _this.marginWidth();
                sessionStorage.setItem("driverBottomIcon",JSON.stringify(_this.items));
              })
            }

          },
        marginWidth:function () {
          var _this = this;
          var corner = document.getElementsByClassName("corner");
          for(var i = 0; i< corner.length;i++){
            var width = corner[i].scrollWidth;
            _this.items[i].marginRight = - width / (2*(_this.htmlSize())) + 0.05+ "rem";
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
     #footer{
       position:fixed;
       bottom: 0;
       left:0;
       width:100%;
       background: white;
     }
     #footer ul{
       width:100%;
     }
     .imgBox{
       width:0.67rem;
       height: 0.67rem;
       margin: 0.12rem  auto 0 auto;
       background-position: 0 0;
       background-size: 0.67rem 1.34rem;
       background-repeat: no-repeat;
       position: relative;
     }
     .corner{
       background: #fc4243;
       font-size: 0.3125rem;
       color:white;
       position: absolute;
       top:0;
       right:0rem;
       padding: 0.01rem 0.2rem;
       border-radius: 0.3rem;
     }
     .robbing{
       background-image: url("../../images/robbing.png");
     }
     .track{
       background-image: url("../../images/track.png");
     }
     .price{
       background-image: url("../../images/priceJie.png");
     }
     .message{
       background-image: url("../../images/message.png");
     }
     .user{
       background-image: url("../../images/user.png");
     }
     .imgSure{
       background-position: 0 100%!important;
     }
     .on{
       color:#1D68A8!important;
     }
    #footer ul li {
      float: left;
      text-align: center;
      height: 1.3rem;
      color:#666;
      font-size: 0.3125rem;
      background: white;
      position: relative;
    }
     #footerUserTX{
       position: absolute;
       width:0.18rem;
       height: 0.18rem;
       border-radius: 50%;
       background: #E1473C;
       top:0.2rem;
       right:40%;
     }
</style>
