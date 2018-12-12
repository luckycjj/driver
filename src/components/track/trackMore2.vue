<template>
  <div id="trackMore">
    <div id="title" v-title data-title="任务详情"></div>
    <div id="container"></div>
    <div id="panel"></div>
    <div id="tabList" style="top:2.5rem;">
      <ul>
        <li @click="tabClick(item.value)" v-for="(item,index) in tabList" :style="{backgroundImage:'url('+item.icon+')'}">
          {{item.name}}
          <div v-if="index != tabList.length - 1" class="hengxian"></div>
        </li>
      </ul>
    </div>
    <div id="carrierDriver" v-if="showMap" style="top:0.64rem">
      <div id="titleGoback"  @click="goback()" ></div>
      <div class="carrierDriver"  v-for="car in carList">
        <div class="carrierDriverBox">
          <h2 v-html="car.length < 1 ? car.length * 1000 + '米' : car.length + '公里'"></h2>
          <h3 v-html="type == 0 || type == 1 || type == 2 ? '距提货点' : '距目的地'"></h3>
        </div>
        <div class="carrierDriverBox">
          <h2>明日到达</h2>
          <h3 v-html="type == 0 || type == 1 || type == 2 ? '预计发货时间' : '预计收货时间'"></h3>
        </div>
        <div class="clearBoth"></div>
      </div>
    </div>
    <div  v-if="boxShow" id="mescroll" class="mescroll" @touchstart="liTouchstart($event)" @touchmove="liTouchmove($event)" :style="{top:Ultop+'rem'}">
      <ul id="dataList" class="data-list">
        <li v-for="item in pdlist">
          <div class="top" v-if="!showMap">
            <p v-if="!showMap">车辆信息</p>
            <p v-if="showMap">查看规划路线<img src="../../images/lookMore2.png"></p>
            <div class="carNumber" v-for="car in carList" @click="mapGo(car)">
              <h1 class="carFloatLeft">{{car.carno}}<br>{{car.carHangNo}}</h1>
              <div class="carFloatRight">
                <h3 v-html="type == 0 || type == 1 || type == 2 ? '距离提货点' : '距离目的地'"></h3> <h2 v-html="car.length < 1 ? car.length * 1000 + '米' : car.length + '公里'"></h2>
                <div class="clearBoth"></div>
                <h3 v-html="type == 0 || type == 1 || type == 2 ? '预计发货时间' : '预计收货时间'"></h3> <h2>明日到达</h2>
                <div class="clearBoth"></div>
              </div>
              <div class="clearBoth"></div>
            </div>
          </div>
          <!--<div class="waitForTime" v-if="(type == 3 || type == 6)&& timeShowF != ''">
            {{timeShowF}}
          </div>-->
          <div class="message">
            <div class="proStatus">
              <p :style="{backgroundImage: 'url(' + require('../../images/trackMoreIcon'+ type +'.png') + ')' }">{{item.orderValue}}</p>
              <!--<div class="startEnd"><span class="startEndSpan">{{item.goodsmessage.startAddress}}<img src="../../images/addressImg.png">{{item.goodsmessage.endAddress}}</span><div class="clearBoth"></div></div>-->
              <ul>
                <li v-for="pro in item.goodsmessage.productList">{{item.goodsmessage.tranType}}/{{pro.goods}}&nbsp;&nbsp;&nbsp;{{pro.number}}件<span v-if="pro.weight.replace(/[^0-9]/g,'')*1 > 0 ">/{{pro.weight}}</span><span  v-if="pro.volume.replace(/[^0-9]/g,'')*1 > 0">/{{pro.volume}}</span></li>
                <li :style="{backgroundImage:'url('+require('../../images/trackListbeizhu.png')+')'}">{{item.pickPay.remark}}</li>
                <li style="background-image: none;" v-for="abnormalaEventVo in item.abnormalaEventVo">{{abnormalaEventVo.createTime}} {{abnormalaEventVo.memo}}</li>
              </ul>
              <div class="price">
                <h1>发货时间: {{item.goodsmessage.startTime}}</h1>
                <h1 style="margin-right: auto">收货时间: {{item.goodsmessage.endTime}}</h1>
                <div class="clearBoth"></div>
              </div>
              <div id="sure">
                <div class="go gogogo" id="gogogo" v-if="peopleType==1">
                  <button v-if="type==0" @click="tongyi()">同意</button>
                  <button v-if="type==0"  class="upImg" @click="jvjue()">拒绝</button>
                  <button v-if="type==1" @click="chufa()">出发</button>
                  <button v-if="type==2" @click="daoda(31)">提货到达</button>
                  <button v-if="type==3" @click="daoda(32)">开始装货</button>
                  <button v-if="type==4" @click="daoda(33)">装货完毕</button>
                  <button v-if="type==4"  class="upImg" @click="upImg(0)">上传货品</button>
                  <button v-if="type==5" @click="daoda(41)">运输到达</button>
                  <button v-if="type==6" @click="daoda(42)">开始卸货</button>
                  <button v-if="type==7"  @click="daoda(43)">卸货完毕</button>
                  <button v-if="type==7"  class="upImg" @click="upImg(1)">上传货品</button>
                  <button v-if="type==8 && endtype == '0' && actFlag == 'Y'" @click="qianshou(endtype)">交接</button>
                  <button v-if="type==8 && endtype == '1'" @click="qianshou(endtype)">签收</button>
                  <button v-if="type==9 && pdlist[0].exp_sign == 1" @click="uploadbill(1)">确认异常</button>
                  <button v-if="type==9 && pdlist[0].exp_sign == 0"  @click="upImg(3)">上传单据</button>
                  <button v-if="type==9 && pdlist[0].exp_sign == 0"  class="upImg" style="background-image: none;" @click="uploadbill(2)">电子回单</button>
                  <div class="clearBoth"></div>
                </div>
                <div class="go"  v-else>
                  <button v-if="type==1" @touchend="genghuan()">更换车辆</button>
                </div>
              </div>
            </div>
            <div class="topStatus" style="margin-top: 0.27rem;">
              <p>联系人信息</p>
              <ul>
                <li>
                  <img  @click="telphone('021-50929122')" src="../../images/robbingTel2.png">
                  发货人{{item.pickMessage.name | nameCheck}}
                </li>
                <li >
                  <img @click="telphone(item.endMessage.tel)" src="../../images/robbingTel1.png">
                  收货人{{item.endMessage.name | nameCheck}}
                </li>
                <div class="clearBoth"></div>
              </ul>
              <div class="address">
                <h1><h6 >发货地址：</h6><h6 style="width:7rem;">{{item.pickMessage.address}}</h6><div class="clearBoth"></div></h1>
                <h1><h6>收货地址：</h6><h6 style="width:7rem;">{{item.endMessage.address}}</h6><div class="clearBoth"></div></h1>
              </div>
            </div>
            <div class="proStatus">
            </div>
          </div>
          <div class="errorBox" v-if="type > 1 && type < 8 && showMap">
            <div class="error">
              <div class="errorFirst" @click="errorFirst()">
                异常反馈
              </div>
              <div class="errorSecond" @click="errorSecond()">
                费用反馈
              </div>
              <div class="clearBoth"></div>
            </div>
          </div>
          <div class="number">
            运单编号：{{item.number}}<br>
            下单时间：{{item.time}}
          </div>
        </li>
      </ul>
    </div>
    <div id="lookOrderMore" v-if="!boxShow"  @touchend="boxShow = true">
      查看
    </div>
    <transition name="slide-fade">
      <div id="errorAbnormalBox" v-if="errorAbnormalBox">
        <div id="errorAbnormal">
          <div id="errorabnormalTitle">
            <img src="../../images/closed.png" @touchend="errorAbnormalClosed()">
            <p>选择异常事故</p>
          </div>
          <ul class="errorUl">
            <li v-for="(item,index) in errorAbnormal" :class="index%2==0?'errorAbnormalLeft':'errorAbnormalRight'" @touchend="errorAbnormalClick($event)">
              {{item.displayName}}
            </li>
            <div class="clearBoth"></div>
            <input type="text"   @keyup="filterInput()" placeholder="其他异常" maxlength="100" v-model="errorabnormal">
          </ul>
          <button @touchend="errorAbnormalChange()"  class="gogogo" id="gogogo2">提交</button>
        </div>
      </div>
      <div id="errorPriceBox" v-if="errorPriceBox">
        <div id="errorPrice">
          <div id="errorpriceTitle">
            <img src="../../images/closed.png" @touchend="errorPriceClosed()">
            <p>填写费用</p>
          </div>
          <ul style="border: none;" class="errorUl">
            <li v-for="(item,index) in errorPriceList" :class="index%2==0?'errorAbnormalLeft':'errorAbnormalRight'" @touchend="errorPriceListListClick($event)">
              {{item.displayName}}
            </li>
            <div class="clearBoth"></div>
            <input  @keyup="filterInput()" type="text" placeholder="填写原因" maxlength="40" style="margin-bottom: 0;" v-model="errorPricetype"/>
            <input type="text" placeholder="金额" maxlength="40" v-model="errorPrice"/>
          </ul>
          <button @touchend="errorPriceChange()" id="gogogo4" class="gogogo">提交</button>
        </div>
      </div>
      <div id="driverResultBox" v-if="driverResultBox">
        <div id="driverResult">
          <div id="driverResultTitle">
            <img src="../../images/closed.png" @touchend="driverResultClosed()">
            <p>选择拒绝理由</p>
          </div>
          <ul class="errorUl">
            <li v-for="(item,index) in driverResult" :class="index%2==0?'errorAbnormalLeft':'errorAbnormalRight'" @touchend="driverResultClick($event)">
              {{item.displayName}}
            </li>
            <div class="clearBoth"></div>
            <input type="text"   @keyup="filterInput()" placeholder="其他理由" maxlength="100" v-model="driverresult">
          </ul>
          <button @touchend="driverResultChange()"  class="gogogo" id="gogogo2">提交</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import MeScroll from '../../js/mescroll'
  import {iscroll} from '../../js/iscroll'
  import {androidIos} from "../../js/app";
  import {bomb} from "../../js/zujian";
  import bridge from '../../js/bridge';
  import  "../../js/markingSystem";
  import "../../js/swipeslider"
  var thisThat;
  var pdlist = []
  export default {
    name: "trackMore2",
    data(){
      return{
        carloading:true,
        type:"",
        pick:true,
        logisticsOk:false,
        errorBiglistOk:false,
        pdlist:[],
        peopleType:0,
        errorAbnormalBox:false,
        errorPriceBox:false,
        driverResultBox:false,
        errorAbnormal:[],
        errorPriceList:[],
        driverResult:[],
        errorabnormal:"",
        errorPricetype:"",
        driverresult:"",
        errorPrice:"",
        mescroll:"",
        endtype:0,
        carList:[],
        httpurl:"",
        carpeoList:[],
        actFlag:"Y",
        errorlogo: 'this.src="' + require('../../images/carpeople.png') + '"',
        setTimeGoF:null,
        timeShowF:"",
        showMap:false,
        map:null,
        setTime:null,
        Ultop:0,
        boxShow:true,
        tabList:[{
          icon:require("../../images/telTrackMore.png"),
          name:"联系客服",
          value:0,
        },{
          icon:require("../../images/lookImgTrackMore.png"),
          name:"查看图片",
          value:1,
        }],
      }
    },
    watch:{
      errorPrice:{
        handler:function(val,oldval){
          var _this = this;
          _this.errorPrice=(_this.errorPrice.match(/\d+(\.\d{0,2})?/)||[''])[0];
        },
        deep:true
      }
    },
    mounted:function () {
      var _this = this;
      sessionStorage.removeItem("peopleName");
      _this.showMap = JSON.parse(sessionStorage.getItem("driverMessage")).driverType == 2 ? true : false;

      androidIos.bridge(_this);
    },
    methods:{
      tabClick:function (index) {
        var _this = this;
            if(index == 0){
              androidIos.telCall("021-50929122");
            }else if(index == 1){
              androidIos.addPageList();
              _this.$router.push({path:"/lookImg",query:{vbillno:_this.pdlist[0].number}});

            }
      },
      liTouchstart:function (event) {
        var _this = this;
        var touch = event.targetTouches[0];
        _this.startX = touch.pageX;
        _this.startY = touch.pageY;
        _this.jisuan = false;
      },
      liTouchmove:function (event) {
        var _this = this;
        var touch = event.targetTouches[0];
        if(_this.jisuan){
          _this.startX = _this.endX;
          _this.startY = _this.endY;
        }
        _this.jisuan = true;
        _this.endX = touch.pageX;
        _this.endY = touch.pageY;
        _this.Ultop = _this.Ultop +(_this.endY -  _this.startY) / document.getElementsByTagName("html")[0].style.fontSize.replace("px","");
        var height = document.getElementById("mescroll").offsetHeight;
        var height1 = document.getElementById("trackMore").offsetHeight;
        var height2 =  document.getElementsByClassName("proStatus")[0].offsetHeight;
        var top =  (height1 - height) / document.getElementsByTagName("html")[0].style.fontSize.replace("px","");
        if(top > _this.Ultop){
          _this.Ultop = top;
        }
        if(_this.Ultop > (height1 - height2) / document.getElementsByTagName("html")[0].style.fontSize.replace("px","")){
          _this.Ultop = (height1 - height2) / document.getElementsByTagName("html")[0].style.fontSize.replace("px","");
        }
      },
      liTouchend:function (event) {
        var _this = this;
      },
      go:function () {
        var self = this;
        thisThat = self;
        androidIos.judgeIphoneX("carrierDriver",2);
        androidIos.judgeIphoneX("tabList",2);
        self.map = new AMap.Map("container", {});
        self.map.on("click",function () {
          self.boxShow = false;
        })
        $.ajax({
          type: "POST",
          url: androidIos.ajaxHttp() + "/settings/findParamValueByName ",
          data: JSON.stringify({
            userCode:sessionStorage.getItem("token"),
            source:sessionStorage.getItem("source"),
            paramName:"resourcePath"
          }),
          contentType: "application/json;charset=utf-8",
          dataType: "json",
          async:false,
          timeout:30000,
          success: function(findParamValueByName){
            if(findParamValueByName.success == "1"){
              self.httpurl = findParamValueByName.paramValue;
            }else{
              androidIos.second(findParamValueByName.message);
            }
          },
          complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
            if(status=='timeout'){//超时,status还有success,error等值的情况
              androidIos.second("当前状况下网络状态差，请检查网络！")
            }else if(status=="error"){
              androidIos.errorwife();
            }
          }
        });
        sessionStorage.removeItem("changeCarpeople");
        sessionStorage.removeItem("changeCarFupeople");
        sessionStorage.removeItem("nowOrderCartype");
        self.peopleType = self.$route.query.pt == undefined ? 0 :self.$route.query.pt;

        self.ajaxProMore();
        self.setTime = setInterval(function () {
          self.ajaxProMore();
        },20000)
      },
      filterInput:function () {
        var _this = this;
        _this.errorPricetype =  _this.errorPricetype.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\,\，\.\。\;\!\[\]\【\】\-]/g,'');
        _this.errorabnormal =  _this.errorabnormal.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\,\，\.\。\;\!\[\]\【\】\-]/g,'');
        _this.driverresult =  _this.driverresult.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\,\，\.\。\;\!\[\]\【\】\-]/g,'');
      },
      upCallback: function(page) {
        //联网加载数据
        var self = this;
        getListDataFromNet(page.num, page.size, function(curPageData) {
          //curPageData=[]; //打开本行注释,可演示列表无任何数据empty的配置

          //如果是第一页需手动制空列表 (代替clearId和clearEmptyId的配置)
          if(page.num == 1) self.pdlist = [];

          //更新列表数据
          self.pdlist = self.pdlist.concat(curPageData);
          self.pick = true;
          self.logisticsOk = false;
          self.type = curPageData[0].orderType == '0'? 0 :curPageData[0].orderType == '10'?1:curPageData[0].orderType == '20'?2:curPageData[0].orderType == '31'?3:curPageData[0].orderType == '32'?4:curPageData[0].orderType == '33'?5:curPageData[0].orderType == '41'?6:curPageData[0].orderType == '42'?7:curPageData[0].orderType == '43'?8:curPageData[0].orderType == '50'?9:10;
          debugger
          self.mescroll.endSuccess(curPageData.length);
          sessionStorage.setItem("orderPk",self.$route.query.pk);
          sessionStorage.setItem("dispatchPK",self.$route.query.pk);
          self.$nextTick(function () {
            if(self.type == 3 || self.type == 6){
              self.setTimeStart();
            }else{
              if(self.setTimeGoF){
                clearInterval(self.setTimeGoF);
              }
            }
          });
        }, function() {
          //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          self.mescroll.endErr();
        });
      },
      compareDistanc: function(lnglat,dd) {
        var _this = this;
        var myDistance = lnglat.distance([_this.carList[dd].peopleJ, _this.carList[dd].peopleW]);//这里测量距离
        _this.carList[dd].length = (myDistance/1000).toFixed(3);
      },
      pickMessage:function (m) {
        var _this = this;
        if(m != (_this.pick).toString()){
          _this.pick = !_this.pick;
        }
      },
      telphone:function(tel){
        androidIos.telCall(tel);
      },
      logisticsBoxDown:function () {
        var _this = this;
        _this.logisticsOk = !_this.logisticsOk;
      },
      errorBiglistBoxDown:function(){
        var _this = this;
        _this.errorBiglistOk = !_this.errorBiglistOk;
      },
      errorAbnormalChangeImg:function () {
        if(bomb.hasClass("errorAbnormalChangeImg","gray")){
          bomb.removeClass("errorAbnormalChangeImg","gray");
        }else{
          bomb.addClass("errorAbnormalChangeImg","gray");
        }
      },
      mapGo:function(order){
        var _this = this;
        androidIos.addPageList();
        sessionStorage.setItem("carOrder",JSON.stringify(order));
        _this.$router.push({ path: '/track/map'});
      },
      errorFirst:function () {
        var _this = this;
        _this.errorAbnormalBox = true;
        if(_this.errorAbnormal.length == 0){
          $.ajax({
            type: "GET",
            url: androidIos.ajaxHttp()+"/settings/getSysConfigList",
            data:{str:"exception_feedback",userCode:sessionStorage.getItem("token"),source:sessionStorage.getItem("source")},
            dataType: "json",
            timeout: 10000,
            success: function (getSysConfigList) {
              _this.errorAbnormal = getSysConfigList;
            },
            complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
              if(status=='timeout'){//超时,status还有success,error等值的情况
                androidIos.second("网络请求超时");
              }else if(status=='error'){
                androidIos.errorwife();
              }
            }
          })
        }
      },
      errorSecond:function () {
        var _this = this;
        _this.errorPriceBox = true;
        if(_this.errorPriceList.length == 0){
          $.ajax({
            type: "GET",
            url: androidIos.ajaxHttp()+"/settings/getSysConfigList",
            data:{str:"cost_Feedback",userCode:sessionStorage.getItem("token"),source:sessionStorage.getItem("source")},
            dataType: "json",
            timeout: 10000,
            success: function (getSysConfigList) {
              _this.errorPriceList = getSysConfigList;
            },
            complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
              if(status=='timeout'){//超时,status还有success,error等值的情况
                androidIos.second("网络请求超时");
              }else if(status=='error'){
                androidIos.errorwife();
              }
            }
          })
        }
      },
      errorAbnormalChange:function () {
        var _this = this;
        if(bomb.hasClass("gogogo2","gogogo")){
          var list = [];
          for(var i = 0 ;i<_this.errorAbnormal.length;i++){
            if($(".errorUl li").eq(i).hasClass("errorPriceBoxLi")){
              list.push(_this.errorAbnormal[i])
            }
          }
          if((list.length == 0  || list[0].value == 7 )&& _this.errorabnormal == ''){
            bomb.first("请选择或填写异常");
            return false;
          }
          var json = {
            userCode : sessionStorage.getItem("token"),
            source : sessionStorage.getItem("source"),
            expType : androidIos.checkText(list[0].value),
            trackingMemo : androidIos.checkText(_this.errorabnormal),
            entrustVbillno : _this.pdlist[0].number == undefined ? "" : androidIos.checkText(_this.pdlist[0].number)
          }
          bomb.removeClass("gogogo2","gogogo");
          $.ajax({
            type: "POST",
            url: androidIos.ajaxHttp()+"/driver/abnormalFeedback",
            data:JSON.stringify(json),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            timeout: 10000,
            success: function (abnormalFeedback) {
              if(abnormalFeedback.success == "1"){
                _this.errorAbnormalBox = false;
                _this.errorabnormal = "";
                $("#errorAbnormalBox .errorUl li").removeClass("errorPriceBoxLi");
                _this.$cjj("反馈成功");
                setTimeout(function () {
                  _this.ajaxProMore();
                },500)
              }else{
                androidIos.second(abnormalFeedback.message);
              }
            },
            complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
              bomb.addClass("gogogo2","gogogo");
              if(status=='timeout'){//超时,status还有success,error等值的情况
                androidIos.second("网络请求超时");
              }else if(status=='error'){
                androidIos.errorwife();
              }
            }
          })
        }else{
          bomb.first("请不要频繁点击");
        }
      },
      errorAbnormalClosed:function () {
        var _this = this;
        _this.errorAbnormalBox = false;
        _this.errorabnormal = "";
        $("#errorAbnormalBox .errorUl li").removeClass("errorPriceBoxLi");
      },
      errorPriceChange:function () {
        var _this = this;
        if(bomb.hasClass("gogogo4","gogogo")){
          var list = [];
          for(var i = 0 ;i<_this.errorPriceList.length;i++){
            if($("#errorPriceBox .errorUl li").eq(i).hasClass("errorPriceBoxLi")){
              list.push(_this.errorPriceList[i].value)
            }
          }
          if(list.length == 0){
            bomb.first("请选择费用类型");
            return false;
          }
          /*if(list[0] == 11 &&_this.errorPricetype == ""){
            bomb.first("请填写原因");
            return false;
          }*/
          if( _this.errorPrice == ''){
            bomb.first("请填写费用");
            return false;
          }
          var json = {
            userCode:sessionStorage.getItem("token"),
            source:sessionStorage.getItem("source"),
            costType:list[0]==undefined?'':androidIos.checkText(list[0]),
            memo:androidIos.checkText(_this.errorPricetype),
            amount:androidIos.checkText(_this.errorPrice),
            entrustVbillno:androidIos.checkText(_this.pdlist[0].number)
          }
          bomb.removeClass("gogogo4","gogogo");
          $.ajax({
            type: "POST",
            url: androidIos.ajaxHttp()+"/driver/costFeedback",
            data:JSON.stringify(json),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            timeout: 10000,
            success: function (abnormalFeedback) {
              if(abnormalFeedback.success == "1"){
                _this.errorPriceBox = false;
                _this.errorPricetype = "";
                _this.errorPrice = "";
                $("#errorPriceBox .errorUl li").removeClass("errorPriceBoxLi");
                _this.$cjj("反馈成功");
                setTimeout(function () {
                  _this.ajaxProMore();
                },500)
              }else{
                androidIos.second(abnormalFeedback.message);
              }
            },
            complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
              bomb.addClass("gogogo4","gogogo");
              if(status=='timeout'){//超时,status还有success,error等值的情况
                androidIos.second("网络请求超时");
              }else if(status=='error'){
                androidIos.errorwife();
              }
            }
          })
        }else{
          bomb.first("请不要频繁点击");
        }

      },
      errorPriceClosed:function(){
        var _this = this;
        _this.errorPriceBox = false;
        _this.errorPricetype = "";
        _this.errorPrice = "";
        $("#errorPriceBox .errorUl li").removeClass("errorPriceBoxLi");
      },
      errorPriceListListClick:function (e) {
        if(!this.hasClass(e.target,"errorPriceBoxLi")){
          $("#errorPriceBox .errorUl li").removeClass("errorPriceBoxLi");
          this.addClass(e.target,"errorPriceBoxLi");
        }else{
          $("#errorPriceBox .errorUl li").removeClass("errorPriceBoxLi");
        }
      },
      errorAbnormalClick:function(e){
        if(!this.hasClass(e.target,"errorPriceBoxLi")){
          $("#errorAbnormalBox .errorUl li").removeClass("errorPriceBoxLi");
          this.addClass(e.target,"errorPriceBoxLi");
        }else{
          $("#errorAbnormalBox .errorUl li").removeClass("errorPriceBoxLi");
        }
      },
      driverResultClick:function(e){
        if(!this.hasClass(e.target,"errorPriceBoxLi")){
          $("#driverResultBox .errorUl li").removeClass("errorPriceBoxLi");
          this.addClass(e.target,"errorPriceBoxLi");
        }else{
          $("#driverResultBox .errorUl li").removeClass("errorPriceBoxLi");
        }
      },
      driverResultClosed:function(){
        var _this = this;
        $("#driverResultBox .errorUl li").removeClass("errorPriceBoxLi");
        _this.driverResultBox = false;
        _this.driverresult = "";
      },
      driverResultChange:function () {
        var _this = this;
        if(bomb.hasClass("gogogo2","gogogo")){
          var list = [];
          for(var i = 0 ;i<_this.driverResult.length;i++){
            if($(".errorUl li").eq(i).hasClass("errorPriceBoxLi")){
              list.push(_this.driverResult[i])
            }
          }
          if((list.length == 0  || list[0].value == 0 )&& _this.driverresult == ''){
            bomb.first("请选择或填写理由");
            return false;
          }
          var json = {
            userCode : sessionStorage.getItem("token"),
            source : sessionStorage.getItem("source"),
            memo : androidIos.checkText(list[0].displayName + "," + _this.driverresult),
            pk :_this.$route.query.pk == undefined ? "" : androidIos.checkText(_this.$route.query.pk)
          }
          bomb.removeClass("gogogo2","gogogo");
          $.ajax({
            type: "POST",
            url: androidIos.ajaxHttp()+"/order/driverCancel",
            data:JSON.stringify(json),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            timeout: 10000,
            success: function (abnormalFeedback) {
              if(abnormalFeedback.success == "1"){
                _this.driverResultBox = false;
                _this.driverresult = "";
                $("#driverResultBox .errorUl li").removeClass("errorPriceBoxLi");
                _this.$cjj("拒绝成功");
                setTimeout(function () {
                  /*_this.ajaxProMore();*/
                  androidIos.gobackFrom(_this);
                },500)
              }else{
                androidIos.second(abnormalFeedback.message);
              }
            },
            complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
              bomb.addClass("gogogo2","gogogo");
              if(status=='timeout'){//超时,status还有success,error等值的情况
                androidIos.second("网络请求超时");
              }else if(status=='error'){
                androidIos.errorwife();
              }
            }
          })
        }else{
          bomb.first("请不要频繁点击");
        }
      },
      mapSClick:function(){
        var _this = this;
        androidIos.addPageList();
        _this.$router.push({ path: '/track/map'});
      },
      qianshou:function(type){
        var _this = this;
        androidIos.addPageList();
        _this.$router.push({ path: '/track/qrcode',query:{ty:type}});
      },
      uploadbill:function (type) {
        var _this = this;
        androidIos.addPageList();
        if(type == 1){
          _this.$router.push({ path: '/track/uploadImg',query:{pk:_this.$route.query.pk,expSign:_this.pdlist[0].exp_sign}});
        }else if(type == 0){
          _this.$router.push({ path: '/track/uploadBill',query:{pk:_this.$route.query.pk,expSign:_this.pdlist[0].exp_sign}});
        }else if(type == 2){
          _this.$router.push({ path: '/track/electronicReceipt',query:{pk:_this.$route.query.pk,imgUrl:_this.pdlist[0].documentImage == undefined ? "" : _this.pdlist[0].documentImage}});
        }
      },
      dayVsDay:function () {
        var _this = this;
        var nowTime = (new Date()).getTime();
        var startTime = (new Date(_this.pdlist[0].goodsmessage.startTime)).getTime();
        var startTime2 = (new Date(_this.pdlist[0].trackingTime)).getTime();
        var startTimeyes = startTime - startTime2 > 0 ? startTime : startTime2;
        var time = nowTime - startTimeyes;
        if(time <0){
          time = 0 ;
        }
        return time
      },
      setTimeStart:function () {
        var _this = this;
        var time = _this.dayVsDay();
        var day = Math.floor(time / (24*60*60*1000));
        var hour =  Math.floor((time - day * 24 * 60 * 60 * 1000) / (60 * 60 * 1000));
        var min =  Math.floor((time - day * 24 * 60 * 60 * 1000 - hour * 60 * 60 * 1000) / (60*1000));
        var sec =  Math.floor((time - day * 24 * 60 * 60 * 1000 - hour * 60 * 60 * 1000 - min *60 *1000) / (1000));
        if(_this.setTimeGoF){
          clearInterval(_this.setTimeGoF);
        }
        _this.dayShow(day,hour,min,sec);
        _this.setTimeGoF = setInterval(function () {
          if(_this.dayVsDay() > 0){
            sec++;
          }
          if(sec == 60){
            sec = 0;
            min++;
          }
          if(min == 60){
            min = 0;
            hour++;
          }
          if(hour == 24){
            hour = 0;
            day ++;
          }
          _this.dayShow(day,hour,min,sec);
        },1000)
      },
      dayShow:function (day,hour,min,sec) {
        var _this = this;
        if( day > 0 ){
          _this.timeShowF = "等待中：" + day + "天" + _this.ten(hour)  + "时" + _this.ten(min) + "分" + _this.ten(sec)+ "秒";
        }else{
          if(hour > 0){
            _this.timeShowF = "等待中：" + _this.ten( hour)  + "时" + _this.ten(min) + "分" + _this.ten(sec)+ "秒";
          }else{
            if(min > 0){
              _this.timeShowF = "等待中：" + _this.ten(min) + "分" + _this.ten(sec)+ "秒";
            }else{
              if(sec > 0){
                _this.timeShowF = "等待中：" + _this.ten(sec)+ "秒";
              }else{
                _this.timeShowF = "";
              }
            }
          }
        }
      },
      ten:function (number) {
        if(number < 10){
          number = "0" + number;
        }
        return number
      },
      tongyi:function () {
        var _this = this;
        androidIos.loading("正在确认");
        $.ajax({
          type: "POST",
          url: androidIos.ajaxHttp()+"/order/driverConfirmation",
          data:JSON.stringify({pk:_this.$route.query.pk,userCode:sessionStorage.getItem("token"),source:sessionStorage.getItem("source")}),
          contentType: "application/json;charset=utf-8",
          dataType: "json",
          timeout: 10000,
          success: function (driverConfirmation) {
            if(driverConfirmation.success=="1" ||driverConfirmation.success == ""){
              _this.$cjj("接收成功");
              setTimeout(function () {
                _this.ajaxProMore();
              },500)
            }else{
              androidIos.second(driverConfirmation.message);
            }
          },
          complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
            $("#common-blackBox").remove();
            if(status=='timeout'){//超时,status还有success,error等值的情况
              androidIos.second("网络请求超时");
            }else if(status=='error'){
              androidIos.errorwife();
            }
          }
        })
      },
      jvjue:function () {
        var _this = this;
        _this.driverResultBox = true;
        if(_this.driverResult.length == 0){
          $.ajax({
            type: "GET",
            url: androidIos.ajaxHttp()+"/settings/getSysConfigList",
            data:{str:"driverRefuseReason",userCode:sessionStorage.getItem("token"),source:sessionStorage.getItem("source")},
            dataType: "json",
            timeout: 10000,
            success: function (getSysConfigList) {
              _this.driverResult = getSysConfigList;
            },
            complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
              if(status=='timeout'){//超时,status还有success,error等值的情况
                androidIos.second("网络请求超时");
              }else if(status=='error'){
                androidIos.errorwife();
              }
            }
          })
        }
      },
      chufa:function(){
        var _this = this;
        androidIos.loading("正在出发");
        $.ajax({
          type: "POST",
          url: androidIos.ajaxHttp()+"/order/driverOut",
          data:JSON.stringify({pk:_this.$route.query.pk,userCode:sessionStorage.getItem("token"),source:sessionStorage.getItem("source")}),
          contentType: "application/json;charset=utf-8",
          dataType: "json",
          timeout: 10000,
          success: function (driverOut) {
            $("#common-blackBox").remove();
            if(driverOut.success=="1" ||driverOut.success == ""){
              _this.$cjj("出发成功");
              setTimeout(function () {
                sessionStorage.removeItem("addPageList");
                _this.$router.push({path:"/trackList"});
              },500)
            }else{
              androidIos.second(driverOut.message);
            }
          },
          complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
            if(status=='timeout'){//超时,status还有success,error等值的情况
              $("#common-blackBox").remove();
              androidIos.second("网络请求超时");
            }else if(status=='error'){
              $("#common-blackBox").remove();
              androidIos.errorwife();
            }
          }
        })

      },
      daoda:function(type){
        var _this = this;
        if(bomb.hasClass("gogogo","gogogo")){
          /*if(type == 31 || type == 32 || type == 42 || type == 41){
            for(var i = 0 ; i < _this.carList.length; i++){
              if(_this.carList[i].length - 0.5 >= 0 ){
                if(type == 31 || type == 32){
                  androidIos.second(_this.carList[i].name +"("+_this.carList[i].tel+")还未到达" + _this.pdlist[0].pickMessage.address+ "附近,请稍后再试");
                }else if(type == 42 || type == 41){
                  androidIos.second(_this.carList[i].name +"("+_this.carList[i].tel+")还未到达" + _this.pdlist[0].endMessage.address+ "附近,请稍后再试");
                }
                return false;
              }
            }
          }*/
          var message = type == '31'?'提货达到':type == '32'?'开始装货':type == '33'?'装货完毕':type == '41'?'运输到达':type == '42'?'开始卸货':'卸货完毕';
          var http = type == '33' || type == '41' ? '/order/arriveOrDelivery':'/order/updateStatus';
          type = type == '33'?'1': type == '41' ?'2':type;
          androidIos.loading(message);
          bomb.removeClass("gogogo","gogogo");
          $.ajax({
            type: "POST",
            url: androidIos.ajaxHttp()+http,
            data:JSON.stringify({pk:_this.$route.query.pk,userCode:sessionStorage.getItem("token"),source:sessionStorage.getItem("source"),type:type}),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            timeout: 10000,
            success: function (arriveOrDelivery) {
              $("#common-blackBox").remove();
              bomb.addClass("gogogo","gogogo");
              if(arriveOrDelivery.success=="1" ||arriveOrDelivery.success == ""){
                _this.$cjj(message);
                setTimeout(function () {
                  /*bridge.invoke('gobackfrom');*/
                  _this.ajaxProMore();
                },500)
              }else{
                androidIos.second(arriveOrDelivery.message);
              }
            },
            complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
              bomb.addClass("gogogo","gogogo");
              if(status=='timeout'){//超时,status还有success,error等值的情况
                $("#common-blackBox").remove();
                androidIos.second("网络请求超时");
              }else if(status=='error'){
                $("#common-blackBox").remove();
                androidIos.errorwife();
              }
            }
          })
        }else{
          bomb.first("请不要频繁点击");
        }

      },
      upImg:function (type) {
        var _this = this;
        androidIos.addPageList();
        _this.$router.push({path:'/upProductImg',query:{pk:_this.pdlist[0].number,type:type}});
      },
      addClass:function(obj,cls){//增加class
        var idJson = obj.className.split(" ");
        for(var i=0;i<idJson.length;i++){
          if(idJson[i]==cls){
            return false;
          }
        }
        idJson.push(cls);
        obj.className = idJson.join(" ");
        return true;
      },
      hasClass:function(obj,cls){//判断是不是有这个class
        var idJson = obj.className.split(" ");
        for(var i=0;i<idJson.length;i++){
          if(idJson[i]==cls){
            return true;
          }
        }
        return false;
      },
      goback:function () {
        var _this = this;
        androidIos.gobackFrom(_this);
      },
      ajaxProMore:function () {
        var _this = this;
        if(_this.setTimeGoF){
          clearInterval(_this.setTimeGoF);
        }
        _this.$nextTick(function () {
          if(_this.$route.query.pk != undefined){
            $.ajax({
              type: "POST",
              url: androidIos.ajaxHttp()+"/order/loadEntrustDetail",
              data:JSON.stringify({pk:_this.$route.query.pk,userCode:sessionStorage.getItem("token"),source:sessionStorage.getItem("source")}),
              contentType: "application/json;charset=utf-8",
              dataType: "json",
              timeout: 20000,
              success: function (loadSegmentDetail) {
                _this.carloading = false;
                if (loadSegmentDetail.success == "1") {
                  _this.type = _this.$route.query.type;
                  var list=[];
                  var weh = 0;
                  for(var i =0;i<loadSegmentDetail.invPackDao.length;i++){
                    var weight = loadSegmentDetail.invPackDao[i].weigthUnit==3?loadSegmentDetail.invPackDao[i].weight*1000:loadSegmentDetail.invPackDao[i].weight*1;
                    var listJson = {
                      goodsCode:loadSegmentDetail.invPackDao[i].goodsCode/*+"-"+loadSegmentDetail.invPackDao[i].goodsType*/,
                      goods:loadSegmentDetail.invPackDao[i].goodsName/*+"-"+loadSegmentDetail.invPackDao[i].goodsTypeName*/,
                      number:loadSegmentDetail.invPackDao[i].num,
                      weight: weight/1000 - 1 <0 ? weight + "千克" : weight/1000 + "吨",
                      volume:loadSegmentDetail.invPackDao[i].volume*1 - 1 < 0 ? loadSegmentDetail.invPackDao[i].volume*1000 + "升" : loadSegmentDetail.invPackDao[i].volume*1 + "立方米",
                    }
                    weh += weight/1000 + weh ;
                    list.push(listJson);
                  }
                  sessionStorage.setItem("weh",weh);
                  sessionStorage.setItem("nowOrderCartype",loadSegmentDetail.transType);
                  var tracking=[];
                  /*for(var i =0 ;i<loadSegmentDetail.tracking.length;i++){
                    var trackingJson = {
                      memo:loadSegmentDetail.tracking[i].tackingMemo,
                      createTime:loadSegmentDetail.tracking[i].tackingTime,
                    }
                    loadSegmentDetail.abnormalaEventVo.push(trackingJson);
                  }*/
                  loadSegmentDetail.abnormalaEventVo.sort(function(a,b){
                    return  (-(new Date(b.createTime)).getTime())+ (new Date(a.createTime)).getTime()});
                  thisThat.endtype = loadSegmentDetail.type;
                  sessionStorage.setItem("dataStart",loadSegmentDetail.delivery.addressLatAndLon);
                  sessionStorage.setItem("dataEnd",loadSegmentDetail.arrival.addressLatAndLon);
                  var list1 = loadSegmentDetail.deliDate.split(":");
                  list1.splice(2,1);
                  loadSegmentDetail.deliDate = list1.join(":");
                  var list2 = loadSegmentDetail.arriDate.split(":");
                  list2.splice(2,1);
                  loadSegmentDetail.arriDate = list2.join(":");
                  var pdlist = [{
                    orderType:loadSegmentDetail.trackingStatusValue,
                    abnormalaEventVo:loadSegmentDetail.abnormalaEventVo,
                    orderValue:loadSegmentDetail.trackingStatus == null ? "已拒绝" : loadSegmentDetail.trackingStatus,
                    logistics:tracking,
                    errorBiglist:loadSegmentDetail.abnormalaEventVo == undefined ? [] : loadSegmentDetail.abnormalaEventVo,
                    goodsmessage:{
                      startAddress:loadSegmentDetail.delivery != null ? ( loadSegmentDetail.delivery.province /*+ loadSegmentDetail.delivery.city */+ loadSegmentDetail.delivery.area ) : "" ,
                      endAddress:loadSegmentDetail.arrival!=null?(loadSegmentDetail.arrival.province/*+loadSegmentDetail.arrival.city*/+loadSegmentDetail.arrival.area):"",
                      distance:"0",
                      tranType:loadSegmentDetail.transType,
                      productList:list,
                      money:loadSegmentDetail.price*1,
                      startTime:loadSegmentDetail.deliDate,
                      endTime:loadSegmentDetail.arriDate
                    },
                    pickMessage:{
                      name:loadSegmentDetail.delivery!=null?loadSegmentDetail.delivery.contact:"",
                      tel:loadSegmentDetail.delivery!=null?loadSegmentDetail.delivery.mobile:"",
                      company:loadSegmentDetail.delivery!=null?loadSegmentDetail.delivery.addrName:"",
                      address:loadSegmentDetail.delivery!=null?loadSegmentDetail.delivery.province/*+loadSegmentDetail.delivery.city*/+loadSegmentDetail.delivery.area+loadSegmentDetail.delivery.detailAddr:"",
                      addresspk:loadSegmentDetail.delivery!=null?loadSegmentDetail.delivery.pkAddress:"",
                    },
                    endMessage:{
                      name:loadSegmentDetail.arrival!=null?loadSegmentDetail.arrival.contact:"",
                      tel:loadSegmentDetail.arrival!=null?loadSegmentDetail.arrival.mobile:"",
                      company:loadSegmentDetail.arrival!=null?loadSegmentDetail.arrival.addrName:"",
                      address:loadSegmentDetail.arrival!=null?loadSegmentDetail.arrival.province/*+loadSegmentDetail.arrival.city*/+loadSegmentDetail.arrival.area+loadSegmentDetail.arrival.detailAddr:"",
                      addresspk:loadSegmentDetail.arrival!=null?loadSegmentDetail.arrival.pkAddress:"",
                    },
                    insurance:{
                      name:"",
                      price:"200"
                    },
                    pickPay:{
                      people:"发货方",
                      remark:loadSegmentDetail.memo == "" || loadSegmentDetail.memo == null ? "暂无备注" : loadSegmentDetail.memo
                    },
                    owner:{
                      logo:loadSegmentDetail.customerDto!=null?loadSegmentDetail.customerDto.customerImg:"",
                      company:loadSegmentDetail.customerDto!=null?loadSegmentDetail.customerDto.customerName:"",
                      year:loadSegmentDetail.customerDto!=null?((((new Date()).getTime()-(new Date(loadSegmentDetail.customerDto.createDate.replace('-','/').replace('-','/'))).getTime())/1000/60/60/24/365 -0.5)<0?"不到半年":androidIos.fixed(((new Date()).getTime()-(new Date(invoiceDetail.customerDto.createDate.replace('-','/').replace('-','/'))).getTime())/1000/60/60/24/365 ,1)+"年"):"",
                      phone:loadSegmentDetail.customerDto!=null?loadSegmentDetail.customerDto.mobile:"",
                    },
                    tranNumber:"123321334343",
                    number:loadSegmentDetail.entrustNo,
                    time:loadSegmentDetail.createTime,
                    pkCar:loadSegmentDetail.pkCar,
                    trackingTime:loadSegmentDetail.trackingTime,
                    pkCarHang:loadSegmentDetail.pkCarHang,
                    pkTransType:loadSegmentDetail.pkTransType,
                    exp_sign:loadSegmentDetail.expSign == "Y" ? "1" : "0",
                    documentImage:loadSegmentDetail.documentImage,
                  }]
                  _this.carList= [];
                  _this.actFlag = loadSegmentDetail.actFlag;
                  for(var i = 0; i < loadSegmentDetail.driverDto.length ; i++ ){
                    var json = {
                      logo:loadSegmentDetail.driverDto[i].driverImg,
                      name:loadSegmentDetail.driverDto[i].driverName,
                      year:loadSegmentDetail.driverDto[i].driverAge*1 < 1 ? "小于1" : loadSegmentDetail.driverDto[i].driverAge,
                      tel:loadSegmentDetail.driverDto[i].mobile,
                      startJ :loadSegmentDetail.delivery.addressLatAndLon == ""||loadSegmentDetail.delivery.addressLatAndLon == null ? "" :loadSegmentDetail.delivery.addressLatAndLon.split(",")[0],
                      startW : loadSegmentDetail.delivery.addressLatAndLon == ""||loadSegmentDetail.delivery.addressLatAndLon == null ? "" :loadSegmentDetail.delivery.addressLatAndLon.split(",")[1],
                      endJ:loadSegmentDetail.arrival.addressLatAndLon == "" ||loadSegmentDetail.arrival.addressLatAndLon == null ? "" :loadSegmentDetail.arrival.addressLatAndLon.split(",")[0],
                      endW:loadSegmentDetail.arrival.addressLatAndLon == "" ||loadSegmentDetail.arrival.addressLatAndLon == null ? "" :loadSegmentDetail.arrival.addressLatAndLon.split(",")[1],
                      pkDriver:loadSegmentDetail.driverDto[i].pkDriver,
                      peopleJ:loadSegmentDetail.driverDto[i].driverPosition.split(",")[0],
                      peopleW:loadSegmentDetail.driverDto[i].driverPosition.split(",")[1],
                      ordertype:loadSegmentDetail.trackingStatusValue*1,
                      price:loadSegmentDetail.driverDto[i].score*1,
                      length:loadSegmentDetail.distance/1000,
                      carno:loadSegmentDetail.carNo,
                      carHangNo:loadSegmentDetail.carHangNo
                    }
                    _this.carList.push(json);
                  }
                  var data=pdlist;
                  var listData=data;//模拟分页数据
                  _this.pdlist = [];
                  _this.pdlist = listData;
                  _this.pick = true;
                  _this.logisticsOk = false;
                  _this.type = listData[0].orderType == '0'? 0 :listData[0].orderType == '10'?1:listData[0].orderType == '20'?2:listData[0].orderType == '31'?3:listData[0].orderType == '32'?4:listData[0].orderType == '33'?5:listData[0].orderType == '41'?6:listData[0].orderType == '42'?7:listData[0].orderType == '43'?8:listData[0].orderType == '50'?9:10;
                  _this.tabList = _this.type ==  0  || _this.type == 1 ? [{
                    icon:require("../../images/telTrackMore.png"),
                    name:"联系客服",
                    value:0,
                  }] : [{
                    icon:require("../../images/telTrackMore.png"),
                    name:"联系客服",
                    value:0,
                  },{
                    icon:require("../../images/lookImgTrackMore.png"),
                    name:"查看图片",
                    value:1,
                  }];
                  sessionStorage.setItem("orderPk",_this.$route.query.pk);
                  sessionStorage.setItem("dispatchPK",_this.$route.query.pk);
                  _this.$nextTick(function () {
                    if(_this.type == 3 || _this.type == 6){
                      _this.setTimeStart();
                    }else{
                      if(_this.setTimeGoF){
                        clearInterval(_this.setTimeGoF);
                      }
                    }
                    _this.mapDriver();
                    var height1 = document.getElementById("trackMore").offsetHeight;
                    var height2 =  document.getElementsByClassName("proStatus")[0].offsetHeight;
                    var height = (height1 - height2) / document.getElementsByTagName("html")[0].style.fontSize.replace("px","");
                    _this.Ultop = height;
                  });
                }else{
                  androidIos.second(loadSegmentDetail.message);
                }

              },
              complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
                _this.carloading = false;
                if(status=='timeout'){//超时,status还有success,error等值的情况
                  androidIos.second("网络请求超时");
                }else if(status=='error'){
                  androidIos.errorwife();
                }
              }
            })
          }

        })
      },
      mapDriver:function () {
        var _this = this;
        var truckOptions = {
          map: _this.map,
          policy:0,
          size:1,
          city:'beijing',
          panel:'panel',
          province:"",
          number:""
        };
        //构造路线导航类
        var driving = new AMap.TruckDriving(truckOptions);
        var  ordertype =  _this.pdlist[0].orderType;
        _this.map.clearMap();
        if(_this.carList[0].startJ != "" && _this.carList[0].startW != undefined  && _this.carList[0].endJ != ""  && _this.carList[0].endW != undefined ){
          if(ordertype ==  "31"   ||ordertype ==  "32"   || ordertype ==  "33"){
            var path = [];
            path.push({lnglat:[_this.carList[0].peopleJ, _this.carList[0].peopleW]});//起点
            path.push({lnglat:[_this.carList[0].endJ, _this.carList[0].endW]});//途径
            driving.search(path, function(status, result) {
              var marker;
              marker = new AMap.Marker({
                icon:require('../../images/start1.png'),
                position: [_this.carList[0].peopleJ,_this.carList[0].peopleW],
              });
              marker.setMap(_this.map);
              var marker1;
              marker1 = new AMap.Marker({
                icon:require('../../images/end.png'),
                position: [_this.carList[0].endJ,_this.carList[0].endW],
              });
              marker1.setMap(_this.map);
            });
          }else if(ordertype*1 > 10 && ordertype*1 < 31){
            var path = [];
            path.push({lnglat:[_this.carList[0].peopleJ, _this.carList[0].peopleW]});//起点
            path.push({lnglat:[_this.carList[0].startJ,_this.carList[0].startW]});//途径
            driving.search(path, function(status, result) {
              var marker;
              marker = new AMap.Marker({
                icon:require('../../images/start1.png'),
                position: [_this.carList[0].peopleJ, _this.carList[0].peopleW],
              });
              marker.setMap(_this.map);
              var marker1;
              marker1 = new AMap.Marker({
                icon:require('../../images/end1.png'),
                position: [_this.carList[0].startJ,_this.carList[0].startW],
              });
              marker1.setMap(_this.map);
            });
          }else{
            var path = [];
            path.push({lnglat:[_this.carList[0].startJ, _this.carList[0].startW]});//起点
            path.push({lnglat:[_this.carList[0].endJ,_this.carList[0].endW]});//途径
            driving.search(path, function(status, result) {
              var marker;
              marker = new AMap.Marker({
                icon:require('../../images/end1.png'),
                position: [_this.carList[0].startJ, _this.carList[0].startW],
              });
              marker.setMap(_this.map);
              var marker1;
              marker1 = new AMap.Marker({
                icon:require('../../images/end.png'),
                position: [_this.carList[0].endJ,_this.carList[0].endW],
              });
              marker1.setMap(_this.map);
            });
          }
        }
      },
    },
    destroyed:function () {
      var _this = this;
      clearInterval(_this.setTime);
    }
  }
</script>
<style scoped>
  #trackMore{
    position: fixed;
    top:0;
    bottom:0;
    width:100%;
    height: auto;
    overflow: hidden;
  }
  #panel{
    display: none!important;
  }
  #trackMore #dataList{
    width:100%;
  }
  .top{
    width:100%;
    min-height:1.8rem;
  }
  .message{
    width:100%;
    margin: 0rem auto 0.2rem auto;
  }
  .goodsmessage{
    width:92%;
    padding: 0.2rem 4%;
    background: white;
    border-radius: 0.2rem;
    box-shadow: 0 0.1rem 10px #d8d8d8;
    margin-top: 0.4rem;
  }
  #trackMore .mescroll{
    position: absolute;
    top:0rem;
    height: auto;
    background: #F5F5F5;
  }
  .goodsmessage p{
    width:100%;
    font-size: 0.375rem;
    line-height:0.8rem ;
    color:#333;
  }
  .goodsmessage p span{
    font-size: 0.35rem;
    line-height: 0.8rem;
    color:#333;
    float: right;
  }
  .goodsmessage h1,.goodsmessage h2,.goodsmessage h3,.goodsmessage h4{
    width: 42%;
    padding-left: 8%;
    font-size: 0.36rem;
    min-height: 0.7rem;
    float: left;
    margin-top: 0.2rem;
    background-repeat: no-repeat;
    background-size: 0.5rem 0.5rem;
    background-position: 0 0.05rem;
    color:#333;
  }
  .goodsmessage h3 span{
    font-size: 0.36rem;
    color:#333;
  }
  .goodsmessage h1{
    background-image: url("../../images/trantype.png");
  }
  .goodsmessage h2{
    background-image: url("../../images/product.png");
  }
  .goodsmessage h3{
    background-image: url("../../images/weight.png");
  }
  .goodsmessage h4{
    background-image: url("../../images/price.png");
  }
  .goodsmessage h5{
    width:93%;
    padding:0.1rem 0 0.1rem 7%;
    font-size: 0.36rem;
    line-height: 0.8rem;
    background-image: url("../../images/time.png");
    background-repeat: no-repeat;
    background-size: 0.5rem 0.5rem;
    background-position: 0 50%;
  }
  .colorFull{
    color:#2c9cff!important;
    border-bottom: 2px solid #2c9cff;
  }
  .firstBox{
    float: left;
    position: absolute;
    top: 50%;
    margin-top: -0.9rem;
    width:1.8rem;
    height:1.8rem;
    overflow: hidden;
    border-radius: 50%;
    line-height: 1.8rem;
  }
  .firstBox img{
    width:100%;
    display: inline-block;
    vertical-align: middle;
  }
  .secondBox{
    width:50%;
    float: left;
    margin-top: 0.25rem;
    margin-left: 25%;
  }
  .thirdBox {
    width: 20%;
    float: right;
    position: absolute;
    right: 0;
    top: 50%;
    margin-top: -0.56rem;
  }
  .thirdBox h6{
    height:1.12rem;
    font-size: 0.3125rem;
    color:#333;
    text-align: center;
    background-image: url("../../images/tel.png");
    background-repeat: no-repeat;
    background-size: 1.12rem 1.12rem;
    background-position: 50% 0%;
  }
  .secondBox p{
    font-size: 0.375rem;
    color:#333;
  }
  .secondBox p span{
    font-size: 0.375rem;
    color:#333;
  }
  .secondBox h1{
    font-size: 0.35rem;
    color:#333;
  }
  .secondBox h2,  .secondBox span{
    font-size: 0.35rem;
    color:#333;
    line-height: 0.7rem;
  }
  .secondBox h2 span{
    margin-left: 0.2rem;
  }
  .number{
    width:90%;
    padding: 0.3rem 5% 0.7rem 5%;
    font-size: 0.34rem;
    color:#666;
    line-height: 0.71rem;
  }
  #sure .go{
    margin-left: 0.44rem;
    padding: 0.2rem 0 ;
    width:9.56rem;
    border-bottom: 1px solid #F5F5F5;
  }
  #sure button{
    width:1.87rem;
    background-color: transparent;
    color:#999;
    font-size: 0.32rem;
    line-height: 0.74rem;
    float: right;
    border-radius: 0.1rem;
    border: 1px solid #E0E0E0;
    margin:0.1rem 0.45rem 0.1rem 0 ;
  }
  #sure button span{
    color:white;
    font-size: 0.4rem;
  }
  .noYes{
    width:50%!important;
    float: left;
  }
  .colorBottom{
    background: #88c4ff!important;
  }
  .errorBox{
    width:100%;
    background: white;
  }
  .error{
    padding: 0.2rem 0%;
    background: white;
    border-bottom: 1px solid #F5F5F5;
    width: 9.56rem;
    margin-left: 0.44rem;
  }
  .errorFirst{
    width:2rem;
    float: left;
    line-height: 1.1rem;
    font-size: 0.32rem;
    color:#666;
    text-align: right;
    background-image: url("../../images/error.png");
    background-repeat: no-repeat;
    background-size: 0.45rem;
    background-position: 0 50%;
    margin-left: 2.25rem;
  }
  .errorSecond{
    width:2rem;
    float: right;
    text-align: right;
    line-height: 1.1rem;
    font-size: 0.32rem;
    color:#666;
    background-image: url("../../images/error2.png");
    background-repeat: no-repeat;
    background-size: 0.53rem;
    background-position: 0% 50%;
    margin-right: 2.25rem;
  }
  #errorAbnormalBox,#errorPriceBox,#cancelReasonBox,#driverResultBox{
    width:100%;
    height: 100%;
    position: fixed;
    top:0;
    left:0;
    z-index:12;
    background-color:rgba(0,0,0,0.5);
  }
  #errorAbnormal,#errorPrice,#cancelReason,#driverResult{
    position: absolute;
    bottom:0;
    background: white;
    width:100%;
    padding-bottom: 0.5rem;
  }
  #errorabnormalTitle p,#errorpriceTitle p,#cancelReasonTitle p,#driverResultTitle p{
    width:100%;
    text-align: center;
    line-height: 1rem;
    font-size: 0.375rem;
    color:#999;
    position: relative;
  }
  #errorabnormalTitle img,#errorpriceTitle img,#cancelReasonTitle img,#driverResultTitle img{
    position: absolute;
    width:1rem;
    z-index: 1;
  }
  #errorAbnormal ul,.errorUl{
    width:90%;
    margin: 0.3rem auto;
  }
  #errorAbnormal ul li,.errorUl li{
    width:48%;
    font-size: 0.3125rem;
    color:#666;
    text-align: center;
    line-height: 0.8rem;
    border: 1px solid #666;
    margin-top: 0.15rem;
    border-radius: 0.2rem;

  }
  .errorAbnormalLeft{
    float:left;
  }
  .errorAbnormalRight{
    float: right;
  }
  .meBottom{
    bottom: 0!important;
  }
  #errorAbnormal ul input,.errorUl input{
    width:96%;
    padding: 0 2%;
    background: rgba(242, 242, 242, 1);
    line-height: 0.8rem;
    border-radius: 0.2rem;
    margin: 0.2rem 0;
    font-size: 0.3125rem;
  }
  #errorAbnormalChange,#errorPriceChange{
    width:90%;
    margin: 0.1rem auto;
  }
  #errorAbnormalChange span,#errorPriceChange span{
    font-size: 0.3125rem;
    color:#666;
    line-height: 0.8rem;
  }
  #errorAbnormalChange img,#errorPriceChange img{
    width:0.6rem;
    float: right;
    margin-top: 0.1rem;
  }
  #errorAbnormal button,#errorPrice button,#cancelReason button,#driverResultBox button{
    width:96%;
    margin-left: 2%;
    border-radius: 0.3rem;
    background: #3399FF;
    color:white;
    font-size: 0.375rem;
    letter-spacing: 0.0625rem;
    line-height: 1rem;
    margin-bottom: 0.1rem;
  }
  .gray {
    -webkit-filter: grayscale(100%);
    -moz-filter: grayscale(100%);
    -ms-filter: grayscale(100%);
    -o-filter: grayscale(100%);

    filter: grayscale(100%);

    filter: gray;
  }
  .errorPriceBoxLi{
    border-color:#3399FF!important;
    color:#3399FF!important;
  }
  #full_feature {
    padding-top: 0!important;
    width: 94%;
    margin: 0.1rem auto 0 auto!important;
  }
  .containerImport{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
  }
  .panelImport {
    position: fixed;
    background-color: white;
    max-height: 90%;
    overflow-y: auto;
    top: 10px;
    right: 10px;
    width: 280px;
    display: none!important;
  }
  .topStatus,.proStatus,.top{
    width:100%;
    background: white;
  }
  .top{
    margin-top: 0.27rem;
  }
  .top p{
    width:8.4rem;
    margin-left:0.44rem ;
    padding-left: 1.16rem;
    background-image: url("../../images/icon-luxianguihua.png");
    background-repeat: no-repeat;
    background-position: 0 50%;
    background-size: 0.85rem;
    line-height: 1.17rem;
    color:#373737;
    font-size:0.427rem ;
    border-bottom: 1px solid #F5F5F5;
    position: relative;
  }
  .top p img{
    position: absolute;
    right:0.413rem;
    top:50%;
    width:0.253rem;
    margin-top: -0.213rem;
  }
  .topStatus p{
    width:8.4rem;
    margin-left:0.44rem ;
    padding-left: 1.16rem;
    background-image: url("../../images/trackMorePeopel.png");
    background-repeat: no-repeat;
    background-position: 0 50%;
    background-size: 0.85rem;
    line-height: 1.17rem;
    color:#373737;
    font-size:0.427rem ;
    border-bottom: 1px solid #F5F5F5;
  }
  /* 可以设置不同的进入和离开动画 */
  /* 设置持续时间和动画函数 */
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
  .proStatus p{
    width:8.4rem;
    margin-left:0.44rem ;
    padding-left: 1.16rem;
    background-image: url("../../images/robbingPro.png");
    background-repeat: no-repeat;
    background-position: 0 50%;
    background-size: 0.85rem;
    line-height: 1.17rem;
    color:#373737;
    font-size:0.427rem ;
    border-bottom: 1px solid #F5F5F5;
  }
  .topStatus ul{
    width:9.56rem;
    margin-left:0.44rem ;
    padding-bottom: 0.3rem;
    border-bottom: 1px solid #F5F5F5;
  }
  .topStatus ul li{
    width:50%;
    float: left;
    border-top: 1px solid white;
    color:#373737;
    font-size:0.32rem ;
    text-align: center;
  }
  .topStatus ul li img{
    display: block;
    width:0.827rem;
    margin:0.267rem auto ;
  }
  .topStatus  .address{
    width:9.56rem;
    margin-left:0.44rem ;
    border-bottom: 1px solid #F5F5F5;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
  .topStatus  .address h1{
    color:#666;
    font-size: 0.33rem;
  }
  .topStatus  .address h1 h6{
    float: left;
    color:#666;
    font-size: 0.33rem;
  }
  .topStatus  .time{
    width:9.56rem;
    margin-left:0.44rem ;
    border-bottom: 1px solid #F5F5F5;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
  .topStatus  .time h1{
    color:#666;
    float: left;
    font-size: 0.33rem;
    width:50%;
  }
  .proStatus ul{
    width:9.56rem;
    margin-left:0.44rem ;
    padding-bottom: 0.3rem;
    border-bottom: 1px solid #F5F5F5;
    margin-top: 0.4rem;
  }
  .proStatus ul li{
    color:#666;
    font-size:0.32rem ;
    background-image: url("../../images/robbingiocn1.png");
    background-repeat: no-repeat;
    padding-left: 0.6rem;
    background-position: 0 0.03rem;
    background-size: 0.375rem;
    margin-bottom: 0.3rem;
    line-height: 0.4rem;
    word-wrap:break-word;
  }
  .proStatus ul li span{
    color:#666;
    font-size:0.32rem ;
  }
  .proStatus  .price{
    padding-bottom: 0.2rem;
    width: 9.56rem;
    margin-left: 0.44rem;
    padding-top: 0.2rem;
    border-bottom: 1px solid #F5F5F5;
  }
  .proStatus  .price h1{
    color:#666;
    float: left;
    font-size: 0.33rem;
    margin-right:0.6rem ;
  }
  .startEnd{
    width:9.26rem;
    margin-left:0.44rem ;
    border-bottom: 1px solid #F5F5F5;
    padding: 0.3rem 0.3rem 0.3rem 0;
  }
  .startEnd img{
    display: inline-block;
    margin:0rem 0.3rem 0.13rem 0.3rem;
    width:0.45rem;
  }
  .startEndSpan{
    float: left;
    font-size: 0.42rem;
    line-height: 0.56rem;
    color:#333;
  }
  .waitForTime{
    width:90%;
    padding: 0.3rem 5%;
    background: white;
    font-size: 0.4rem;
    color:#373737;
    margin-top: 0.27rem;
  }
  .carNumber{
    position: relative;
    width:100%;
  }
  .carFloatLeft{
    float: left;
    font-size: 0.427rem;
    color:#373737;
    margin-left: 1.26rem;
    padding: 0.74rem 0;
  }
  .carFloatRight{
    position: absolute;
    min-width: 4rem;
    right:0.82rem;
    top:50%;
    margin-top:-0.56rem ;
  }
  .carFloatRight h3{
    float: left;
    margin-right:0.3rem ;
    font-size: 0.32rem;
    color:#666;
    line-height: 0.56rem;
  }
  .carFloatRight h2{
    float: right;
    font-size: 0.32rem;
    color:#666;
    line-height: 0.56rem;
  }
  .upImg{
    /*border-color:#666666!important;
    color:#666666!important;
    background-color: transparent!important;
    background-image: url("../../images/icon-canmore.png");
    background-size:0.48rem;
    background-repeat: no-repeat;
    background-position:0.2rem 50% ;*/
  }
  .upImg2{
    width:3.4rem!important;
    margin-left: 0.5rem;
    border-color:#666666!important;
    color:#666666!important;
    background-color: transparent!important;
  }
  #lookOrderMore{
    position: fixed;
    width: 1.5rem;
    height: 1.5rem;
    background-color: rgba(29,104,168,0.8);
    color: white;
    font-size: 0.35rem;
    border-radius: 50%;
    bottom: 15%;
    right: 5%;
    text-align: center;
    line-height: 1.5rem;
    letter-spacing: 2px;
    z-index: 10;
  }
  #carrierDriver{
    position: absolute;
    background: white;
    top:0.64rem;
    width:90%;
    padding-left: 5%;
    left:2.5%;
    border-radius: 0.2rem;
    box-shadow:0px 4px 6px 0px rgba(0,0,0,0.11);
    z-index: 10;
  }
  .carrierDriverBox{
    width:50%;
    float: left;
  }
  .carrierDriverBox h2{
    font-size: 0.4rem;
    color:#373737;
    text-align: center;
    line-height: 0.8rem;
    margin-top: 0.1rem;
  }
  .carrierDriverBox h3{
    font-size: 0.375rem;
    color:#999;
    text-align: center;
    line-height: 0.375rem;
    margin-bottom: 0.3rem;
  }
  #tabList{
    position: absolute;
    top:2.5rem;
    right:0.24rem;
    z-index: 11;
    width:1.5rem;
    background: white;
    box-shadow:0px 4px 4px 0px rgba(0,0,0,0.19);
    border-radius:0.08rem ;
  }
  #tabList li{
    padding-top: 0.78rem;
    background-repeat: no-repeat;
    background-size:0.5rem ;
    background-position:50% 0.24rem ;
    text-align: center;
    font-size: 0.187rem;
    line-height: 0.57rem;
    color:#666;
  }
  #titleGoback{
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    height: auto;
    width: 1.5rem;
    background-image: url("../../images/titlejian.png");
    background-position: 35% 50%;
    background-repeat: no-repeat;
    background-size: 0.2rem 0.3714rem;
  }
  .hengxian{
    width:70%;
    height: 1px;
    background: #dbdbdb;
    margin: 0 auto;
  }
</style>
