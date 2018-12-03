<template>
    <div id="findProHis" style="top:1.3rem;">
      <div id="title" v-title data-title="找货记录"></div>
      <div id="setHis">
        <ul>
          <li :i="index" v-for="(item,index) in list" :class="item.check ? 'checked':''">
            <div class="imgBox" :class="item.check ? 'checked':''" :style="{backgroundImage:'url('+item.logo+')'}"></div>
            {{item.name}}
          </li>
          <div clas="clearBoth"></div>
        </ul>
      </div>
      <div v-for="(item,index) in list" :id="'mescroll' + index" :class="index != tabShow ? 'hide' :''" class="mescroll">
        <ul :id="'dataList' + index" class="data-list">
          <li v-for="(items,indexs) in item.prolist" @click="lookTrackMore(items)">
            <img v-if="items.ifUrgent == 'Y'" class="jinjiOrder" src="../../images/jiaji.png">
            <div class="proBox">
              <div class="qiangRobbing" :style="{color : items.resultType == 1 ? '#1869A9' : '#999999'}" v-html="items.resultType == 1 ? '抢单成功' : '订单失效'"></div>
              <p class="startEnd"><span class="startEndSpan">{{items.deliAddr}}<img src="../../images/addressImg.png">{{items.arriAddr}}</span><div class="clearBoth"></div></p>
              <div class="proBoxList transType">{{items.transType}}/{{items.goodCode}}</div>
              <div class="proBoxList wvolume"><span>{{items.num}}件</span><span  v-if="items.weight*1 > 0">/{{items.weight*1}}吨</span><span v-if="items.volume*1 > 0">/{{items.volume*1}}立方米</span></div>
              <div class="proBoxList menu"  v-html="items.memo == '' || items.memo == null ? '暂无备注' : items.memo "></div>
              <div class="proBoxList deliDateTime">{{items.deliAddr.time}}&nbsp;装货</div>
              <div class="proBoxList callTel" @click.stop="tel(items.phone)">{{items.phone}}</div>
              <div class="clearBoth"></div>
            </div>
            <div class="qdTime">抢单时间：{{items.billTime}}<br>{{items.billMemo}}</div>
          </li>
        </ul>
      </div>
    </div>
</template>

<script>
  import MeScroll from '../../js/mescroll'
  import AMap from 'AMap'
  import {bomb} from "../../js/zujian";
  import {iscroll} from '../../js/iscroll'
  import {androidIos} from "../../js/app";
  import bridge from '../../js/bridge';
  import  "../../js/markingSystem";
  import "../../js/swipeslider"
    export default {
        name: "find-pro-his",
      data(){
          return{
            list:[{
              name:"今日抢单",
              number:0,
              prolist:[],
              logo:require("../../images/jinri-3.png"),
              check:false,
            },{
              name:"历史抢单",
              number:0,
              prolist:[],
              logo:require("../../images/lishi-3.png"),
              check:false
            }],
            tabShow:0,
            ajax1:null,
          }
      },
      mounted:function () {
        var _this = this;
        androidIos.judgeIphoneX("findProHis",2);
        var findProHisTab = sessionStorage.getItem("findProHisTab");
        if(findProHisTab != null){
          _this.tabShow = findProHisTab;
          sessionStorage.removeItem("findProHisTab");
        }
        _this.list[_this.tabShow].check = true;
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
            $("#setHis li").click(function(){
              var i=Number($(this).attr("i"));
              _this.tabShow = i;
              for(var x = 0 ; x < _this.list.length;x++){
                _this.list[x].check = false;
              }
              _this.list[i].check = true;
              sessionStorage.setItem("findProHisTab",i);
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
                    icon: require("../../images/nojilu.png"),
                    tip: "暂无订单", //提示
                  },
                  clearEmptyId: clearEmptyId, //相当于同时设置了clearId和empty.warpId; 简化写法;默认null; 注意vue中不能配置此项
                  toTop:{ //配置回到顶部按钮
                    src :require("../../images/scrollTop.png"), //默认滚动到1000px显示,可配置offset修改
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
                _this.ajax1 = $.ajax({
                  type: "POST",
                  url: androidIos.ajaxHttp() + "/order/getGrabResult",
                  data:JSON.stringify({
                    page:pageNum,
                    size:pageSize,
                    type:curNavIndex == 0 ? 1 : "",
                    userCode:sessionStorage.getItem("token"),
                    source:sessionStorage.getItem("source"),
                  }),
                  contentType: "application/json;charset=utf-8",
                  dataType: "json",
                  timeout: 30000,
                  success: function (loadEntrust) {
                    if (loadEntrust.success == "1") {
                      for(var i = 0; i < loadEntrust.list.length;i++){
                        loadEntrust.list[i].billMemo = loadEntrust.list[i].billMemo == "" ? "暂无原因" : loadEntrust.list[i].billMemo;
                      }
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
        lookTrackMore:function (item) {
          var _this = this;
          androidIos.addPageList();
          _this.$router.push({ path: '/robbingYesNo',query:{pk:item.pkSegment,type:item.resultType}});
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
  @import "../../css/mescroll.css";
  @import "../../css/scroll.css";
  #findProHis .hide, .mescroll-totop{
    display: none!important;
  }
</style>
<style scoped>
    #findProHis{
      position: absolute;
      top:1.3rem;
      bottom:0;
      height: auto;
      background: #f6f6f6;
      width:100%;
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
      color:#999;
      float: left;
      width:5rem;
      background-size:0.93rem ;
      background-position: 90% 50%;
      background-repeat: no-repeat;
      box-sizing: border-box;
      text-align: center;
    }
    #setHis li:nth-child(2){
      border-left:1px solid #f5f5f5 ;
    }
  .imgBox{
    width:0.72rem;
    height:0.72rem;
    overflow: hidden;
    background-size: 0.72rem;
    background-position: 0 0;
    background-repeat: no-repeat;
    margin:0.347rem auto 0.15rem auto ;
  }
  .checked{
    color:#1869A9!important;
    background-position: 0 100%;
  }
    .mescroll{
      position: absolute;
      top:2.1rem;
      bottom:0rem;
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
      background-image: url("../../images/pickmessage.png");
    }
    .arriDateTime{
      background-image: url("../../images/arrmessage.png");
    }
    .proBox{
      width:8.3rem;
      padding: 0rem 0.55rem 0 0;
      margin: 0.2rem 0 0.2rem 0.55rem;
      border-radius: 0.1rem;
      position: relative;
      border-bottom: 1px solid #F5F5F5;
    }
    .qiangRobbing{
      position: absolute;
      right:0.5rem;
      color:#1869A9;
      top:50%;
      margin-top: -0.7rem;
      border-radius: 50%;
      line-height: 1.4rem;
      text-align: center;
      font-size: 0.53rem;
    }
    .startEndSpan{
      float: left;
      font-size: 0.42rem;
      line-height: 0.56rem;
      color:#333;
      margin-bottom: 0.25rem;

    }
    .transType{
      background-image: url("../../images/robbingiocn1.png");
      background-size: 0.5rem;
      background-repeat: no-repeat;
      background-position: 0 0.02rem;
      padding-left: 0.65rem;
    }
    .wvolume{
      background-image: url("../../images/weight.png");
      background-size: 0.5rem;
      background-repeat: no-repeat;
      background-position :0 0.02rem;
      padding-left: 0.65rem;
    }
    .deliDateTime{
      background-image: url("../../images/trackListshijian.png");
      background-size: 0.5rem;
      background-repeat: no-repeat;
      background-position :0 0.02rem;
      padding-left: 0.65rem;
    }
    .callTel{
      background-image: url("../../images/trackListdianhua.png");
      background-size: 0.5rem;
      background-repeat: no-repeat;
      background-position :0 0.02rem;
      padding-left: 0.65rem;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space:nowrap;
      height: 0.5rem;
    }
    .menu{
      background-image: url("../../images/trackListbeizhu.png");
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
  .qdTime{
    width:8.3rem;
    padding: 0rem 0.55rem 0 0;
    margin: 0.2rem 0 0rem 0.55rem;
    font-size: 0.347rem;
    color:#999;
    line-height: 0.6rem;
  }
</style>
