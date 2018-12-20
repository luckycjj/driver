<template>
  <div id="searchDayOrder" style="top:0rem">
    <div id="title" v-title data-title="任务"></div>
    <div id="top">
      任务
      <div class="topImg" @click="messageGo()">
        <div class="redCor" v-if="messageLength > 0"></div>
      </div>
    </div>
    <div id="DayTime">
        <div class="li" v-for="(item,index) in dayList" :style="{width:10/ dayList.length + 'rem',color:item.clas ? '#666' : '#cccccc'}" @touchend="dayLook(index)">
          {{item.name}}<span :style="{color:item.number > 0  ? '#ff5b5b' : '#cccccc'}" v-html="item.number > 0 && item.clas ? '(' + item.number + ')' : item.number  == 0 && item.clas ? '(无)' : ''"></span>
        </div>
      <div class="clearBoth"></div>
    </div>
    <transition name="slide-fade">
      <div id="searchDateBox" v-if="searchDateBox">
        <div id="searchDate">
          <p>选择时间</p>
          <img src="../images/closed2.png" class="searchClosed"  @touchend="searchDateBox = false">
          <ul>
            <li v-for="(item,index) in searchList" :class="item.check ? 'timeCheck': ''" @touchend="circleChooese(index)" :style="{borderRight:index % 4 == 3 ? 'none':'1px solid #E9EFF3'}">
              <h1>{{item.name}}</h1>
              <h2 v-html="item.number > 0 ? item.number + '个任务' : '暂无任务'"></h2>
              <div class="clearBoth"></div>
            </li>
            <div class="clearBoth"></div>
          </ul>
          <button @touchend="searchDateGo()">确定</button>
        </div>
      </div>
    </transition>
    <div id="showBox">
      <div v-for="(item,index) in list" :id="'mescroll' + index" :class="index != tabShow ? 'hide' :''" class="mescroll">
        <ul :id="'dataList' + index" class="data-list">
          <li v-for="(items,indexs) in item.prolist" @click="lookTrackMore(items.pkInvoice)">
            <h3 :class="'trackList' + items.status" v-html="items.status == 0 ? '待确认' : items.status == 10 ? '已确认': items.status == 20 ? '司机出发': items.status == 31 ? '提货到达': items.status == 32 ? '开始装货': items.status == 33 ? '开始运输': items.status == 41 ? '运输到达': items.status == 42 ? '开始卸货': items.status == 43 ? '卸货完毕': items.status == 50 ? '已签收': items.status == 55 ? '已回单' : items.status == 60 ? '已拒绝': ''"></h3>
            <h1>运单编号：{{items.vbillno}}</h1>
            <div class="proBox">
              <img v-if="items.ifUrgent == 'Y'" class="jinjiOrder" src="../images/jiaji.png">
              <img v-if="items.expFlag == 'Y'" class="yichangOrder" src="../images/yichang.png">
              <p class="startEnd"><span class="startEndSpan">{{items.deliAddr}}<img src="../images/addressImg.png">{{items.arriAddr}}</span><div class="clearBoth"></div></p>
              <div class="proBoxList" v-for="(pro,proIndex) in items.itemDaos">{{items.transType}}/{{pro.goodsCode}}/{{pro.num}}件<span v-if="pro.weight*1 > 0">/{{pro.weight*1}}吨</span><span v-if="pro.volume*1 > 0">/{{pro.volume*1}}立方米</span></div>
            </div>
            <h6 class="meno" style="width:8rem;max-width:8rem;"  v-html="items.memo == '' || items.memo == null ? '暂无备注' : items.memo "></h6>
            <h6 class="deliDateTime">{{items.deliDate | carrierTime}}</h6>
            <h6 class="callTel" @click.stop="tel(items.arriMobile)">{{items.arriMobile}}</h6>
            <div class="clearBoth"></div>
          </li>
        </ul>
      </div>
    </div>
    <footComponent ref="footcomponent" :idx='0'></footComponent>
  </div>
</template>

<script>
  import "../js/navbarscroll";
  import {androidIos} from "../js/app";
  import {bomb} from "../js/zujian";
  import bridge from '../js/bridge';
  import MeScroll from '../js/mescroll'
  import {iscroll} from '../js/iscroll'
  export default {
    name: "searchDayOrder",
    data(){
      return{
        list:[{
          name:"全部",
          number:0,
          prolist:[]
        }],
        dayList:[{
          name:"前一天",
          number:0,
          clas:true,
        },{
          name:"",
          number:0,
          clas:true,
        },{
          name:"后一天",
          number:0,
          clas:true,
        }],
        searchList:[],
        zuizaoDay:"",
        zuiwanDay:"",
        searchDateBox:false,
        tabShow:0,
        driverType:0,
        mescrollArr:null,
        ajax1:null,
        settime:null,
        messageLength:0,
      }
    },
    mounted:function () {
      var _this = this;
      $.ajax({
        type: "POST",
        url: androidIos.ajaxHttp() + "/getUserInfo",
        data:JSON.stringify({
          userCode:sessionStorage.getItem("token"),
          source:sessionStorage.getItem("source")
        }),
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        timeout: 30000,
        async:false,
        success: function (getUserInfo) {
          if (getUserInfo.success == "1") {
            sessionStorage.setItem("driverMessage",JSON.stringify({
              licType: getUserInfo.licType,
              name:  getUserInfo.name,
              photo:  getUserInfo.photo,
              status:  getUserInfo.status,
              corpName:  getUserInfo.corpName,
              driverType:getUserInfo.type == 1 ? 2 : 1,
            }));
            androidIos.setcookie("MESSAGEDRIVER",JSON.stringify({
              token:sessionStorage.getItem("token"),
              status: getUserInfo.status,
              driverType:getUserInfo.type == 1 ? 2 : 1,
            }),80);
          }else{
            androidIos.second(getUserInfo.message);
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
      _this.driverType = JSON.parse(sessionStorage.getItem("driverMessage")).driverType == 1 ? 1 : 1;
      sessionStorage.removeItem("weh");
      sessionStorage.removeItem("nowOrderCartype");
      sessionStorage.removeItem("dataStart");
      sessionStorage.removeItem("dataEnd");
      sessionStorage.removeItem("orderPk");
      sessionStorage.removeItem("dispatchPK");
      sessionStorage.removeItem("carPKlistGo");
      sessionStorage.removeItem("driverPk");
      sessionStorage.removeItem("ORDERSCREEN");
      sessionStorage.removeItem("histroyTrackTap");
      androidIos.judgeIphoneX("mescroll",1);
      androidIos.judgeIphoneX("searchDayOrder",2);
      androidIos.bridge(_this);
    },
    methods:{
      tabColor:function () {
        var _this = this;
        if(_this.dayList[1].name == _this.searchList[0].value ){
            _this.dayList[0].clas = false;
        }else{
          _this.dayList[0].clas = true;
        }
        if(_this.dayList[1].name == _this.searchList[_this.searchList.length - 1].value ){
          _this.dayList[2].clas = false;
        }else{
          _this.dayList[2].clas = true;
        }
      },
      messageGo:function () {
        var _this = this;
        androidIos.addPageList();
        _this.$router.push({path:"/secondmessage"});
      },
      tabNumber:function () {
         var _this = this;
         var date = _this.dayList[1].name;
         var number = 0;
         for(var i = 0; i < _this.searchList.length;i++){
            if(date == _this.searchList[i].value){
               number = i;
            }
         }
         if(number == 0){
           _this.dayList[0].number = 0;
           _this.dayList[1].number = _this.searchList[number].number;
           _this.dayList[2].number = _this.searchList[number + 1].number;
         }else if(number >= _this.searchList.length - 1){
           _this.dayList[0].number = _this.searchList[number - 1].number;
           _this.dayList[1].number = _this.searchList[number].number;
           _this.dayList[2].number = 0;
         }else{
           _this.dayList[0].number = _this.searchList[number - 1].number;
           _this.dayList[1].number = _this.searchList[number].number;
           _this.dayList[2].number = _this.searchList[number + 1].number;
         }
      },
      dayLook:function (index) {
        var _this = this;
         if(index == 1){
           _this.searchDateBox = true;
           for(var i = 0;i < _this.searchList.length;i++){
              _this.searchList[i].check = false;
              if(_this.searchList[i].name ==_this.dayList[1].name ){
                _this.searchList[i].check = true;
              }
           }
         }else if(index == 0){
             var date = new Date(_this.dayList[1].name.replace(/-/g,'/'));
             var lastTime = _this.getTime(date.getTime() - 24*60*60*1000);
            if((new Date(lastTime.replace(/-/g,'/'))).getTime() >= (new Date(_this.zuizaoDay.replace(/-/g,'/'))).getTime()){
              _this.dayList[1].name = lastTime;
              sessionStorage.setItem("orderTime",_this.dayList[1].name);
              _this.jiaobiao();
              _this.tabColor();
              _this.mescrollArr[0].resetUpScroll();
            }
         }else if(index == 2){
           var date = new Date(_this.dayList[1].name.replace(/-/g,'/'));
           var nextTime = _this.getTime(date.getTime() + 24*60*60*1000);
           if((new Date(nextTime.replace(/-/g,'/'))).getTime() <= (new Date(_this.zuiwanDay.replace(/-/g,'/'))).getTime()){
             _this.dayList[1].name = nextTime;
             sessionStorage.setItem("orderTime",_this.dayList[1].name);
             _this.jiaobiao();
             _this.tabColor();
             _this.mescrollArr[0].resetUpScroll();
           }
         }
      },
      ten:function (number) {
        return number * 1 < 10 ? '0' + number : number;
      },
      searchDateGo:function () {
        var _this = this;
        for(var i = 0 ; i < _this.searchList.length ; i++){
          if(_this.searchList[i].check){
            _this.dayList[1].name = _this.searchList[i].value;
          }
        }
        _this.searchDateBox = false;
        _this.jiaobiao();
        _this.tabColor();
        _this.mescrollArr[0].resetUpScroll();
        sessionStorage.setItem("orderTime",_this.dayList[1].name);
      },
      circleChooese:function (index) {
        var _this = this;
        for(var i = 0 ; i < _this.searchList.length ; i++){
          _this.searchList[i].check = false;
        }
        _this.searchList[index].check = true;
      },
      timeList:function () {
        var _this = this;
        var date = new Date();
        var xingqi = date.getDay();
        var searchList = [];
        var number = 0;
        for(var i = xingqi - number ; i < 7 + xingqi ; i++){
          if(i == xingqi - number){
             _this.zuizaoDay = _this.getTime(date.getTime() - (xingqi - i)*24*60*60*1000);
          }
          if(i ==  6 + xingqi ){
            _this.zuiwanDay = _this.getTime(date.getTime() - (xingqi - i)*24*60*60*1000);
          }
            searchList.push({
              name:_this.getTime(date.getTime() - (xingqi - i)*24*60*60*1000),
              value:_this.getTime(date.getTime() - (xingqi - i)*24*60*60*1000),
              number:0,
              check:false,
            })
        }
        _this.searchList = searchList;
        _this.jiaobiao();
        _this.tabColor();
      },
      jiaobiao:function () {
        var _this = this;
        $.ajax({
          type: "POST",
          url: androidIos.ajaxHttp() + "/order/findOrderCountGroupbyDate",
          data:JSON.stringify({
            userCode:sessionStorage.getItem("token"),
            source:sessionStorage.getItem("source"),
            startTime: _this.searchList[0].value,
            endTime: _this.searchList[_this.searchList.length - 1].value,
          }),
          contentType: "application/json;charset=utf-8",
          dataType: "json",
          timeout: 30000,
          success: function (findOrderCountGroupbyDate) {
            if (findOrderCountGroupbyDate.success == "1") {
              for(var i = 0 ; i < _this.searchList.length ; i++){
                 for(var x = 0 ; x < findOrderCountGroupbyDate.list.length ; x++){
                    if(_this.searchList[i].value == findOrderCountGroupbyDate.list[x].date){
                      _this.searchList[i].number = findOrderCountGroupbyDate.list[x].count;
                      break;
                    }
                 }
              }
              _this.tabNumber();
            }else{
              androidIos.second(findOrderCountGroupbyDate.message);
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
        $.ajax({
          type: "POST",
          url: androidIos.ajaxHttp() + "/order/driverMessage",
          data:JSON.stringify({
            page:1,
            size:1,
            userCode: sessionStorage.getItem("token"),
            source:sessionStorage.getItem("source")
          }),
          contentType: "application/json;charset=utf-8",
          dataType: "json",
          timeout: 30000,
          success: function (loadInvoice) {
            if (loadInvoice.success == "1") {
              _this.messageLength = loadInvoice.total;
            }else{
              androidIos.second(loadInvoice.message);
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
      },
      getTime:function (time) {
        var _this = this;
         var date = new Date(time);
         return  date.getFullYear() + "-" + _this.ten(( date.getMonth() + 1 )) + "-" + _this.ten(date.getDate());
      },
      go:function () {
        var _this = this;
        /*  _this.corner();*/
        /*var trackTap = sessionStorage.getItem("trackTap");
        if(trackTap != undefined){
          _this.tabShow = trackTap*1;
        }*/
        var curNavIndex = _this.tabShow;
        _this.mescrollArr=new Array(_this.list.length);//4个菜单所对应的4个mescroll对象
        //初始化首页
        _this.mescrollArr[_this.tabShow]=initMescroll("mescroll" + _this.tabShow, "dataList" + _this.tabShow);

        /*初始化菜单*/
        $("#trackTab li").click(function(){
          var i=Number($(this).attr("i"));
          sessionStorage.setItem("trackTap",i);
          if(curNavIndex!=i) {
            //更改列表条件
            //隐藏当前列表和回到顶部按钮
            $("#mescroll"+curNavIndex).hide();
            _this.mescrollArr[curNavIndex].hideTopBtn();
            //显示对应的列表
            $("#mescroll"+i).show();
            //取出菜单所对应的mescroll对象,如果未初始化则初始化
            if(_this.mescrollArr[i]==null){
              _this.mescrollArr[i]=initMescroll("mescroll"+i, "dataList"+i);
            }else{
              //检查是否需要显示回到到顶按钮
              var curMescroll=_this.mescrollArr[i];
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
                tip: "暂无任务", //提示
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
            _this.mescrollArr[dataIndex].endSuccess(pageData.length);
            setListData(pageData,dataIndex);
          }, function(){
            //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
            _this.mescrollArr[dataIndex].endErr();
          });
        }
        function setListData(pageData,dataIndex){
          for (var i = 0; i < pageData.length; i++) {
            _this.list[dataIndex].prolist.push(pageData[i]);
          }
        }
        function getListDataFromNet(curNavIndex,pageNum,pageSize,successCallback,errorCallback) {
          //延时一秒,模拟联网
          _this.settime = setTimeout(function () {
            if(pageNum == 1){
              _this.$refs.footcomponent.go();
              var orderTime = sessionStorage.getItem("orderTime");
              if(orderTime != undefined){
                _this.dayList[1].name = orderTime;
              }else{
                var date = new Date();
                _this.dayList[1].name = date.getFullYear() + "-" + _this.ten(( date.getMonth() + 1 )) + "-" + _this.ten(date.getDate());
                sessionStorage.setItem("orderTime",_this.dayList[1].name);
              }
              _this.timeList();
            }
            var status = JSON.parse(sessionStorage.getItem("driverMessage")).status;
            if(status == 2){
              _this.ajax1 = $.ajax({
                type: "POST",
                url: androidIos.ajaxHttp() + "/order/loadEntrust",
                data:JSON.stringify({
                  page:pageNum,
                  size:pageSize,
                  type:1,
                  state:10,
                  date:_this.dayList[1].name,
                  userCode:sessionStorage.getItem("token"),
                  source:sessionStorage.getItem("source")
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
            }else{
              successCallback([]);
            }

          },200)
        }
      },
      lookTrackMore:function (pk) {
        var _this = this;
        androidIos.addPageList();
        _this.$router.push({ path: '/track/trackMore2',query:{pk:pk,pt:1}});
      },
      corner:function () {
        var _this = this;
        $.ajax({
          type: "POST",
          url: androidIos.ajaxHttp() + "/order/orderCount",
          data:JSON.stringify({
            userCode:sessionStorage.getItem("token"),
            source:sessionStorage.getItem("source"),
          }),
          contentType: "application/json;charset=utf-8",
          dataType: "json",
          timeout: 30000,
          success: function (carrOrderListHeaderIcon) {
            if (carrOrderListHeaderIcon.success == "1") {
              /* _this.list[0].number = carrOrderListHeaderIcon.waitTransport*1 + carrOrderListHeaderIcon.transporting*1 + carrOrderListHeaderIcon.alreadySign*1;
               _this.list[1].number = carrOrderListHeaderIcon.waitTransport*1;
               _this.list[2].number = carrOrderListHeaderIcon.transporting*1;
               _this.list[3].number = carrOrderListHeaderIcon.alreadySign*1;*/
            }else{
              androidIos.second(carrOrderListHeaderIcon.message);
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
      },
      tel:function (tel) {
        androidIos.telCall(tel);
      },
      orderScreen:function () {
        var _this = this;
        androidIos.addPageList();
        _this.$router.push({ path: "/orderScreen"});
      },
      histroy:function () {
        var _this = this;
        androidIos.addPageList();
        _this.$router.push({ path: "/histroyTrack"});
      }
    },
    beforeDestroy:function () {
      var _this = this;
      var body = document.getElementsByTagName("body")[0];
      var listDom=document.getElementsByClassName("mescroll-totop")[0];
      if(listDom != null){
        body.removeChild(listDom);
      }
      clearTimeout(_this.settime);
      if(_this.ajax1 != null){
        _this.ajax1.abort();
      }
    },
    destroy:function () {
      var _this = this;
      var body = document.getElementsByTagName("body")[0];
      var listDom=document.getElementsByClassName("mescroll-totop")[0];
      if(listDom != null){
        body.removeChild(listDom);
      }
      clearTimeout(_this.settime);
      if(_this.ajax1 != null){
        _this.ajax1.abort();
      }
    }
  }
</script>
<style>
  @import "../css/mescroll.css";
  @import "../css/scroll.css";
  #searchDayOrder .hide{
    display: none;
  }
</style>
<style scoped>
  #DayTime{
     width:100%;
    height:1.2rem;
    background: white;
  }
  #DayTime .li{
    width:33.3333%;
     float: left;
    font-size: 0.375rem;
    line-height: 1.2rem;
    height: 1.2rem;
    text-align: center;
  }
  #DayTime .li span{
    font-size: 0.35rem;
    color:#ff5b5b;
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
    width:0.427rem;
    right:0.72rem;
    top:50%;
    margin-top: -0.22rem;
  }
  .messageLDbox img{
    width:100%;
  }
  .proBoxList span{
    color: #999;
    font-size: 0.35rem;
  }
  #searchDayOrder{
    position:absolute;
    top:1.3rem;
    bottom:0;
    height: auto;
    width:100%;
    background: #f6f6f6;
  }
  .mescroll{
    position: absolute;
    top:0rem;
    bottom:0rem;
    height: auto!important;
  }
  #showBox{
    position: absolute;
    top:2.5rem;
    bottom: 1.3rem;
    height: auto;
    width:100%;
  }
  .wrapper {
    position:relative;
    height: 1rem;
    width: 100%;
    margin:0 auto;
    background:white;
    border-top: 2px solid #E5E5E5;
  }
  .wrapper .scroller {
    position:absolute;
  }
  .wrapper .scroller li {
    height: 1rem;
    color:#373737;
    float: left;
    line-height: 1rem;
    font-size: .4rem;
    text-align: center;
    width:2rem;
  }
  .wrapper .scroller li a{
    color:#999;
    display:block;
    font-size: 0.375rem;
    margin:0 0.1rem;
  }
  .wrapper .scroller li a span{
    color:#999;
    font-size: 0.3125rem;
  }
  .wrapper .scroller li.cur a{
    color:#1D68A8;
    border-bottom: 1px solid #1D68A8;
  }
  .wrapper .scroller li.cur a span{
    color:#1D68A8;
  }
  .data-list{
    width:100%;
  }
  .data-list li{
    width:94%;
    margin: 0.2rem auto 0.08rem;
    background: white;
    border-radius:0.16rem;
    padding:0.333rem 0 ;
    position: relative;
  }
  .data-list li h6{
    font-size:0.346rem ;
    color:#666;
    margin-left: 0.4rem;
    margin-bottom: 0.01rem;
    padding-left: 0.5rem;
    background-repeat: no-repeat;
    background-size:0.4rem ;
    background-position: 0 50%;
    float: left;
    max-width:3.6rem;
    min-width: 1rem;
    line-height: 0.5rem;
  }
  .data-list li h1{
    font-size:0.34rem ;
    color:#666;
    margin-left: 0.5rem;
  }
  .data-list li h3{
    position: absolute;
    font-size: 0.375rem;
    right:3%;
    top:0.28rem;
    padding-left: 0.72rem;
    background-repeat: no-repeat;
    background-position: 0 50%;
    background-size: 0.48rem;
  }
  .trackList0{
    background-image: url("../images/trackList1.png");
    color:#F48D20;
  }
  .trackList10{
    background-image: url("../images/trackList2.png");
    color:#1AB7FA;
  }
  .trackList20{
    background-image: url("../images/trackList3.png");
    color:#46B2E7;
  }
  .trackList31{
    background-image: url("../images/trackList4.png");
    color:#4681B4;
  }
  .trackList32{
    background-image: url("../images/trackList5.png");
    color:#3094E3;
  }
  .trackList33{
    background-image: url("../images/trackList6.png");
    color:#49C661;
  }
  .trackList41{
    background-image: url("../images/trackList7.png");
    color:#38A2FF;
  }
  .trackList42{
    background-image: url("../images/trackList8.png");
    color:#719CED;
  }
  .trackList43{
    background-image: url("../images/trackList9.png");
    color:#557DE0;
  }
  .trackList50{
    background-image: url("../images/trackList10.png");
    color:#C3D94D;
  }
  .trackList60{
    background-image: url("../images/trackList11.png");
    color:#1869A9;
  }
  .deliDateTime{
    background-image: url("../images/trackListshijian.png");
  }
  .callTel{
    background-image: url("../images/trackListdianhua.png");
  }
  .meno{
    background-image: url("../images/trackListbeizhu.png");
    overflow: hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
    height: 0.5rem;
  }
  .proBox{
    width:85%;
    padding: 0.5rem 0.45rem;
    margin: 0.333rem auto;
    border-radius: 0.1rem;
    box-shadow: 0 0 0.13rem #e2e2e2;
    border: 1px solid white;
    position: relative;
  }
  .startEndSpan{
    float: left;
    font-size: 0.44rem;
    font-weight:bold;
    line-height: 0.56rem;
    color:#333;
    margin-bottom: 0.25rem;

  }
  .startEnd img{
    display: inline-block;
    margin:0rem 0.3rem 0.13rem 0.3rem;
    width:0.45rem;
  }
  .proBoxList{
    color:#999;
    font-size:0.35rem ;
    margin-top: 0.1rem;
  }
  .jinjiOrder{
    position: absolute;
    font-size: 0.3125rem;
    right:0rem;
    top:0rem;
    width:0.64rem;
  }
  .yichangOrder{
    position: absolute;
    font-size: 0.3125rem;
    right:0.44rem;
    top:50%;
    margin-top:-0.30683rem ;
    width:0.667rem;
  }
  #searchDateBox{
    position: absolute;
    left:0;
    right:0;
    top:0;
    bottom:0;
    width:auto;
    height: auto;
    z-index:19;
    background-color: rgba(0,0,0,0);
  }
  #searchDate{
    position: absolute;
    width:10rem;
    left:0;
    background: white;
    top:2.5rem;
    box-shadow:0px 4px 4px 0px rgba(0,0,0,0.19);
  }
  #searchDate p {
    color:#373737;
    font-size: 0.43rem;
    text-align: center;
    line-height:1.547rem ;
    border-bottom: 1px solid #E9EFF3;
  }
  #searchDate li{
    width:25%;
    float: left;
    border-bottom: 1px solid #E9EFF3;
    box-sizing: border-box;
    border-right: 1px solid #E9EFF3;
    padding: 0.2rem 0 ;
  }
  #searchDate li h1{
 /*   float: left;*/
    color:#1D68A8;
    font-size: 0.35rem;
    text-align: center;
   /* margin-left: 0.6rem;*/
  }
  #searchDate li h2{
    color:#ff5b5b;
    font-size: 0.35rem;
    text-align: center;
  }
  .timeCheck{
     background: #1D68A8!important;
    color:white!important;
  }
  .timeCheck h1{
     color:white!important;
  }
  .timeCheck h2{
    color:white!important;
  }
  #searchDate li .circle{
    float: right;
    margin-right:0.54rem ;
    width:0.5rem;
    height: 0.5rem;
    border: 0.0625rem solid #1D68A8;
    border-radius: 50%;
    margin-top: 0.2725rem;
    position: relative;
  }
  #searchDate li .circle .circleTrue{
    width:0.26rem;
    height: 0.26rem;
    background: #1D68A8;
    position: absolute;
    border-radius: 50%;
    left:50%;
    top:50%;
    margin-left: -0.13rem;
    margin-top: -0.13rem;
  }
  #searchDate button{
    width:2.7rem;
    height:0.88rem;
    background: #1D68A8;
    color:white;
    border-radius:0.15rem ;
    margin: 0.6133rem auto;
    display: block;
    font-size: 0.375rem;
  }
  .searchClosed{
    position: absolute;
    width:0.3rem;
    right:0.36rem;
    top:0.36rem;
  }
  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .slide-fade-leave-active {
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateY(0.13rem);
    opacity: 0;
  }
  .topImg{
    position: absolute;
    width: 0.6rem;
    height:1.3rem;
    right: 0.72rem;
    top:0;
    background-image: url("../images/lingdang.png");
    background-position: 50% 50%;
    background-repeat: no-repeat;
    background-size: 0.6rem;
  }
  .redCor{
    width:0.18rem;
    height: 0.18rem;
    background:#fc4243 ;
    position: absolute;
    border-radius: 50%;
    top:0.4rem;
    right:0.1rem;
  }
</style>
