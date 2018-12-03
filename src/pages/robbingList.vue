<template>
    <div id="robbingList" style="top:0rem;">
      <div id="title" v-title data-title="找货"></div>
      <div id="top">
        找货
        <div class="messageLDbox" @touchend="lookMessage()">
          <div class="messageCorner" v-if="Messageshow"></div>
          <img src="../images/messageLD.png">
        </div>
      </div>
      <div id="setHis">
        <ul>
          <li :style="{backgroundImage:'url('+item.icon+')'}" v-for="(item,index) in setHis" @click="findProHis(item)">{{item.name}}</li>
          <div clas="clearBoth"></div>
        </ul>
      </div>
      <div v-for="(item,index) in list" :id="'mescroll' + index" :class="index != tabShow ? 'hide' :''" class="mescroll">
        <ul :id="'dataList' + index" class="data-list">
          <li v-for="(items,indexs) in item.prolist" @click="lookTrackMore(items)">
            <img v-if="items.ifUrgent == 'Y'" class="jinjiOrder" src="../images/jiaji.png">
            <div class="proBox">
              <div class="qiangRobbing">抢单</div>
              <div class="startEnd"><span class="startEndSpan">{{items.deliAddr}}<img src="../images/addressImg.png">{{items.arriAddr}}</span><div class="clearBoth"></div></div>
              <div class="proBoxList transType">{{items.transType}}/{{items.goodCode}}</div>
              <div class="proBoxList wvolume"><span>{{items.num}}件</span><span  v-if="items.weight*1 > 0">/{{items.weight*1}}吨</span><span v-if="items.volume*1 > 0">/{{items.volume*1}}立方米</span></div>
              <div class="proBoxList menu" v-html="items.memo == '' || items.memo == null ? '暂无备注' : items.memo "></div>
              <div class="proBoxList deliDateTime">{{items.deliDate | carrierTime}}</div>
              <div class="proBoxList callTel" @click.stop="tel('021-50929122')">021-50929122</div>
              <div class="clearBoth"></div>
            </div>
          </li>
        </ul>
      </div>
      <footComponent ref="footcomponent" :idx='driverType'></footComponent>
    </div>
</template>

<script>
  import {androidIos} from "../js/app";
  import {bomb} from "../js/zujian";
  import bridge from '../js/bridge';
  import MeScroll from '../js/mescroll'
  import {iscroll} from '../js/iscroll'
    export default {
        name: "robbing-list",
      data(){
          return{
             list:[{
               name:"抢单",
               number:0,
               prolist:[]
             }],
            setHis:[{
               name:"接单设置",
               icon:require("../images/robbingSet.png"),
              http:"/getOrderSet"
            },{
              name:"找货记录",
              icon:require("../images/robbingHis.png"),
              http:"/findProHis"
            }],
            mescrollArrList:null,
            tabShow:0,
            Messageshow:false,
            driverType:0,
            ajax1:null,
          }
      },
      mounted:function () {
        var _this = this;
        androidIos.judgeIphoneX("robbingList",2);
        androidIos.judgeIphoneX("mescroll",1);
        sessionStorage.removeItem("findProHisTab");
        _this.driverType = JSON.parse(sessionStorage.getItem("driverMessage")).driverType == 1 ? 1 : 2;
        $.ajax({
          type: "POST",
          url: androidIos.ajaxHttp()+"/settings/getBulletin",
          data:JSON.stringify({userCode:sessionStorage.getItem("token"),source:sessionStorage.getItem("source")}),
          contentType: "application/json;charset=utf-8",
          dataType: "json",
          timeout: 30000,
          success: function (getBulletin) {
            if (getBulletin.success == "1") {
              var newMessage = localStorage.getItem("newMessage" + sessionStorage.getItem("token"));
              if(newMessage != undefined){
                if(JSON.parse(newMessage).length < getBulletin.list.length){
                  _this.Messageshow = true;
                }
              }else{
                if(getBulletin.list.length > 0){
                  _this.Messageshow = true;
                }
              }
            }else{
              androidIos.second(getBulletin.message);
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
        androidIos.bridge(_this);
      },
      methods:{
        go:function () {
            var _this = this;
            var curNavIndex = _this.tabShow;//首页0; 奶粉1; 面膜2; 图书3;
            var mescrollArr=new Array(_this.list.length);//4个菜单所对应的4个mescroll对象
            //初始化首页
            mescrollArr[_this.tabShow]=initMescroll("mescroll" + _this.tabShow, "dataList" + _this.tabShow);
            _this.mescrollArrList = mescrollArr;
            /*初始化菜单*/
            $("#trackTab li").click(function(){
              var i=Number($(this).attr("i"));
              _this.tabShow = i;
              if(curNavIndex!=i) {
                //更改列表条件
                //隐藏当前列表和回到顶部按钮
                $("#mescroll"+curNavIndex).hide();
                mescrollArr[curNavIndex].hideTopBtn();
                //显示对应的列表
                $("#mescroll"+i).show();
                //取出菜单所对应的mescroll对象,如果未初始化则初始化
                if(mescrollArr[i]==null){
                  mescrollArr[i]=initMescroll("mescroll"+i, "dataList"+i);
                  _this.mescrollArrList = mescrollArr;
                }else{
                  //检查是否需要显示回到到顶按钮
                  var curMescroll=mescrollArr[i];
                  var curScrollTop=curMescroll.getScrollTop();
                  if(curScrollTop>=curMescroll.optUp.toTop.offset){
                    curMescroll.showTopBtn();
                  }else{
                    curMescroll.hideTopBtn();
                  }
                }
                //更新标记
                curNavIndex=i;
              }
            })

            /*创建MeScroll对象*/
            function initMescroll(mescrollId,clearEmptyId){
              //创建MeScroll对象,内部已默认开启下拉刷新,自动执行up.callback,刷新列表数据;
              var mescroll = new MeScroll(mescrollId, {
                //上拉加载的配置项
                up: {
                  callback: getListData, //上拉回调,此处可简写; 相当于 callback: function (page) { getListData(page); }
                  isBounce: false, //此处禁止ios回弹,解析(务必认真阅读,特别是最后一点): http://www.mescroll.com/qa.html#q10
                  noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
                  empty: {
                    icon: require("../images/nojilu.png"),
                    tip: "暂无订单", //提示
                  },
                  clearEmptyId: clearEmptyId, //相当于同时设置了clearId和empty.warpId; 简化写法;默认null; 注意vue中不能配置此项
                  toTop:{ //配置回到顶部按钮
                    src :require("../images/scrollTop.png"), //默认滚动到1000px显示,可配置offset修改
                    //offset : 1000
                  },
                  lazyLoad: {
                    use: true // 是否开启懒加载,默认false
                  }
                }
              });
              return mescroll;
            }

            /*联网加载列表数据  page = {num:1, size:10}; num:当前页 从1开始, size:每页数据条数 */
            function getListData(page){
              //联网加载数据
              var dataIndex=curNavIndex; //记录当前联网的nav下标,防止快速切换时,联网回来curNavIndex已经改变的情况;
              getListDataFromNet(dataIndex, page.num, page.size, function(pageData){
                mescrollArr[dataIndex].endSuccess(pageData.length);
                setListData(pageData,dataIndex);
              }, function(){
                //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
                mescrollArr[dataIndex].endErr();
              });
            }
            function setListData(pageData,dataIndex){
              for (var i = 0; i < pageData.length; i++) {
                _this.list[dataIndex].prolist.push(pageData[i]);
              }
            }
            function getListDataFromNet(curNavIndex,pageNum,pageSize,successCallback,errorCallback) {
              //延时一秒,模拟联网
              setTimeout(function () {
                if(pageNum == 1){
                  _this.$refs.footcomponent.go();
                }
                var GETORDERSETUSER = localStorage.getItem("GETORDERSETUSER" + sessionStorage.getItem("token") );
                if(GETORDERSETUSER != undefined){
                  GETORDERSETUSER = JSON.parse(GETORDERSETUSER);
                   if(!GETORDERSETUSER.getOrderYes){
                     successCallback([]);
                     return false;
                   }
                }
                var deliTime = [],carType = [],carModel = [],carLength = [],lootLines = [];
                if(GETORDERSETUSER != undefined) {
                  for (var i = 0; i < GETORDERSETUSER.timeType.length; i++) {
                    deliTime.push(GETORDERSETUSER.timeType[i].value);
                  }
                  for(var i = 0 ; i < GETORDERSETUSER.proList.length;i++){
                    carType.push(GETORDERSETUSER.proList[i].value);
                  }
                  for(var i = 0 ; i < GETORDERSETUSER.carModel.length;i++){
                    carModel.push(GETORDERSETUSER.carModel[i].value);
                  }
                  for(var i = 0 ; i < GETORDERSETUSER.carLength.length;i++){
                    carLength.push(GETORDERSETUSER.carLength[i].value);
                  }
                  for(var i = 0 ;i <GETORDERSETUSER.addressList.length;i++ ){
                    var json = {
                      province:GETORDERSETUSER.addressList[i].startList[0] == undefined ? "" : GETORDERSETUSER.addressList[i].startList[0] ,
                      city:GETORDERSETUSER.addressList[i].startList[1] == undefined ? "" : GETORDERSETUSER.addressList[i].startList[1] ,
                      area:GETORDERSETUSER.addressList[i].startList[2] == undefined ? "" : GETORDERSETUSER.addressList[i].startList[2] ,
                      provinceId:GETORDERSETUSER.addressList[i].endList[0] == undefined ? "" : GETORDERSETUSER.addressList[i].endList[0] ,
                      cityId: GETORDERSETUSER.addressList[i].endList[1] == undefined ? "" : GETORDERSETUSER.addressList[i].endList[1] ,
                      areaId:GETORDERSETUSER.addressList[i].endList[2] == undefined ? "" : GETORDERSETUSER.addressList[i].endList[2]
                    }
                    lootLines.push(json);
                  }
                }
                _this.ajax1 = $.ajax({
                  type: "POST",
                  url: androidIos.ajaxHttp() + "/order/loadDriverSegment",
                  data:JSON.stringify({
                    page:pageNum,
                    size:pageSize,
                    userCode:sessionStorage.getItem("token"),
                    source:sessionStorage.getItem("source"),
                    lootLines:lootLines,
                    carModel:carModel.join(","),
                    carLength:carLength.join(","),
                    deliTime:deliTime.join(","),
                    carType:carType.join(",")
                  }),
                  contentType: "application/json;charset=utf-8",
                  dataType: "json",
                  timeout: 30000,
                  success: function (loadEntrust) {
                    if (loadEntrust.success == "1") {
                      successCallback(loadEntrust.list);
                    }else{
                      androidIos.second(loadEntrust.message);
                      successCallback([]);
                    }
                  },
                  complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
                    if (status == 'timeout') { //超时,status还有success,error等值的情况
                      androidIos.second("当前状况下网络状态差，请检查网络！");
                      successCallback([]);
                    } else if (status == "error") {
                      androidIos.errorwife();
                      successCallback([]);
                    }
                  }
                });
              },100)
            }
          },
        tel:function (tel) {
          androidIos.telCall(tel);
        },
        lookMessage:function () {
          var _this = this;
          androidIos.addPageList();
          _this.$router.push({path:'/Secondmessage'});
        },
        findProHis:function (item) {
          var _this = this;
          androidIos.addPageList();
          _this.$router.push({path:item.http});
        },
        lookTrackMore:function (item) {
          var _this = this;
          var driverMessage = sessionStorage.getItem("driverMessage");
          if(driverMessage != null){
            var status = JSON.parse(driverMessage);
            if(status.status == 1){
              androidIos.second("正在审核中，请耐心等待！");
            }else if(status.status == 0){
              androidIos.second("尚未认证，请认证上传资料！");
            }else if(status.status == 3){
              androidIos.second("资料已驳回，请重新上传资料！");
            }else if(status.status == 4){
              androidIos.second("账户已禁用！");
            }else if(status.status == 2){
              androidIos.addPageList();
              _this.$router.push({ path: '/robbingMore',query:{pk:item.pkSegment,type:_this.tabShow == 0 ? 1 : 2}});
            }
          }
        },
      },
      beforeDestroy:function () {
        var _this = this;
        _this.ajax1.abort();
      },
      destroy:function () {
        var _this = this;
        _this.ajax1.abort();
      }
    }
</script>
<style>
  @import "../css/mescroll.css";
  @import "../css/scroll.css";
  #robbingList .hide, .mescroll-totop{
    display: none!important;
  }
</style>
<style scoped>
 #robbingList{
   position: absolute;
   top:0;
   bottom:0;
   height: auto;
   background: #f6f6f6;
   width:100%;
 }
  #top{
    position: relative;
    width:100%;
    background: white;
    text-align: center;
    font-size: 0.48rem;
    line-height: 1.3rem;
    color: #333;
    letter-spacing: 0.0133rem;
  }
 #top .messageLDbox{
   position: absolute;
   width:0.375rem;
   right:0.73rem;
   top:50%;
   margin-top: -0.22rem;
 }
  .messageLDbox img{
    width:100%;
  }
 .jinjiOrder{
   position: absolute;
   font-size: 0.3125rem;
   right:0rem;
   top:0rem;
   width:1.07rem;
 }
  #setHis {
    width:100%;
    background: #F5F5F5;
    margin-top: 2px;
  }
 #setHis li{
   background: white;
   height: 2rem;
   font-size: 0.4rem;
   color:#373737;
   padding-left:0.52rem ;
   float: left;
   width:5rem;
   line-height: 2rem;
   background-size:0.93rem ;
   background-position: 90% 50%;
   background-repeat: no-repeat;
   box-sizing: border-box;
 }
 #setHis li:nth-child(2){
   border-left:1px solid #f5f5f5 ;
 }
 .mescroll{
   position: absolute;
   top:3.5rem;
   bottom:1.3rem;
   height: auto!important;
 }
 .data-list{
   width:100%;
 }
 .data-list li{
   width:94%;
   margin: 0.2rem auto 0.08rem;
   background: white;
   border-radius:0.16rem;
   padding:0.3rem 0 ;
   position: relative;
 }
 .data-list li h6{
   font-size:0.32rem ;
   color:#999;
   margin-left: 0.4rem;
   margin-bottom: 0.01rem;
   padding-left: 0.5rem;
   background-repeat: no-repeat;
   background-size:0.213rem 0.213rem ;
   background-position: 0 50%;
 }
 .data-list li h1{
   font-size:0.34rem ;
   color:#999;
   padding-top: 0.2rem;
   margin-left: 0.5rem;
 }
 .data-list li h3{
   position: absolute;
   width:2rem;
   font-size: 0.375rem;
   right:0;
   top:0.6rem;
 }
 .data-list li h3 span{
   font-size: 0.375rem;
   color:#f4a131;
 }
 .deliDateTime{
   background-image: url("../images/pickmessage.png");
 }
 .arriDateTime{
   background-image: url("../images/arrmessage.png");
 }
 .proBox{
   width:8.3rem;
   padding: 0rem 0.55rem;
   margin: 0.2rem auto;
   border-radius: 0.1rem;
   position: relative;
 }
 .qiangRobbing{
   position: absolute;
   right:1.1rem;
   width:1.4rem;
   height: 1.4rem;
   background-color: #1869A9;
   color:white;
   top:50%;
   margin-top: -0.7rem;
   border-radius: 50%;
   line-height: 1.4rem;
   text-align: center;
   font-size: 0.375rem;
 }
 .startEndSpan{
   float: left;
   font-size: 0.42rem;
   line-height: 0.56rem;
   color:#333;
   margin-bottom: 0.25rem;

 }
 .transType{
   background-image: url("../images/robbingiocn1.png");
   background-size: 0.5rem;
   background-repeat: no-repeat;
   background-position: 0 0.02rem;
   padding-left: 0.65rem;
 }
 .wvolume{
   background-image: url("../images/weight.png");
   background-size: 0.5rem;
   background-repeat: no-repeat;
   background-position :0 0.02rem;
   padding-left: 0.65rem;
 }
 .deliDateTime{
   background-image: url("../images/trackListshijian.png");
   background-size: 0.5rem;
   background-repeat: no-repeat;
   background-position :0 0.02rem;
   padding-left: 0.65rem;
   float: left;
 }
 .callTel{
   background-image: url("../images/trackListdianhua.png");
   background-size: 0.5rem;
   background-repeat: no-repeat;
   background-position :0 0.02rem;
   padding-left: 0.65rem;
   float: left;
   overflow: hidden;
   text-overflow:ellipsis;
   white-space:nowrap;
   height: 0.5rem;
   margin-left: 0.96rem;
 }
 .menu{
   background-image: url("../images/trackListbeizhu.png");
   background-size: 0.5rem;
   background-repeat: no-repeat;
   background-position :0 0.02rem;
   padding-left: 0.65rem;
   overflow: hidden;
   text-overflow:ellipsis;
   white-space:nowrap;
   height: 0.5rem;
 }
 .startEnd img{
   display: inline-block;
   margin:0rem 0.3rem 0.13rem 0.3rem;
   width:0.45rem;
 }
 .proBoxList{
   color:#666;
   font-size:0.35rem ;
   margin-top: 0.1rem;
   max-width: 6rem;
   margin-bottom: 0.25rem;
   min-width:1rem;
 }
 .proBoxList span{
   color:#666;
   font-size:0.35rem ;
 }
 .messageCorner{
   background: #fc4243;
   font-size: 0.3125rem;
   color:white;
   position: absolute;
   top:0;
   right:0rem;
   width:0.2rem;
   height:0.21rem;
   border-radius: 50%;
 }
</style>
