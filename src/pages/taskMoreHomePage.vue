<template>
    <div id="taskMoreHomePage">
      <div id="title" v-title data-title="任务"></div>
      <div id="container" style="bottom:1.3rem;"></div>
      <div id="panel"></div>
      <div id="search">
         <p @touchend="serachOrder()">请输入订单号或货品名称</p>
         <img src="../images/huatong-3.png">
        <div class="clearBoth"></div>
      </div>
      <div id="tabList" style="top:2.5rem;">
          <ul>
            <li @click="tabClick(item.value)" v-for="(item,index) in tabList" :style="{backgroundImage:'url('+item.icon+')'}">
                {{item.name}}
              <div v-if="index != tabList.length - 1" class="hengxian"></div>
            </li>
          </ul>
      </div>
      <div id="lookOrderMore" v-if="!boxShow"  @touchend="boxShow = true">
        查看
      </div>
      <footComponent ref="footcomponent" :idx='0'></footComponent>
      <div id="errorAbnormalBox" v-if="errorAbnormalBox">
        <div id="errorAbnormal">
          <div id="errorabnormalTitle">
            <img src="../images/closed.png" @touchend="errorAbnormalClosed()">
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
            <img src="../images/closed.png" @touchend="errorPriceClosed()">
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
            <img src="../images/closed.png" @touchend="driverResultClosed()">
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
      <transition name="slide-fade">
        <div id="proBox" v-if="listBox.pkTransType != '' && boxShow" style="bottom: 1.5rem;">
          <img src="../images/jiaji.png" class="jiajiImg"  v-if="listBox.ifUrgent == 'Y'">
          <div class="message" @touchend="lookTrackMore(listBox.pkInvoice)">
            <div class="proStatus">
              <p :style="{backgroundImage: 'url(' + require('../images/trackMoreIcon'+ listBox.type +'.png') + ')' }" >{{listBox.statusName}}</p>
              <div class="topStatus">
                <ul id="peoUl">
                  <li @click.stop="telphone('021-50929122')">
                    <img src="../images/robbingTel2.png">
                    发货人{{listBox.deliContact | nameCheck}}
                  </li>
                  <li @click.stop="telphone(listBox.arriMobile)">
                    <img src="../images/robbingTel1.png">
                    收货人{{listBox.arriContact | nameCheck}}
                  </li>
                  <div class="clearBoth"></div>
                </ul>
              </div>
              <div class="price">
                <h1>提货时间: {{listBox.deliDate}}</h1>
                <h1 style="margin-right: auto">到货时间: {{listBox.arriDate}}</h1>
                <div class="clearBoth"></div>
              </div>
              <ul id="proUl">
                <li v-for="pro in listBox.itemDaos">运单编号:{{listBox.vbillno}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span v-html="listBox.pkTransType == 1 ? '冷链' : listBox.pkTransType == 2 ? '普货' : listBox.pkTransType == 3 ? '危险品' :listBox.pkTransType == 4 ? '集装箱' : '' "></span>/{{listBox.transType}}/{{pro.num}}件<span v-if="pro.weight.replace(/[^0-9]/g,'')*1 > 0 ">/{{pro.weight}}吨</span><span  v-if="pro.volume.replace(/[^0-9]/g,'')*1 > 0">/{{pro.volume}}立方米</span></li>
              </ul>
            </div>
          </div>
          <button v-if="listBox.type==0" @touchend="tongyi()">同意</button>
          <button v-if="listBox.type== 0" @touchend="jvjue()">拒绝</button>
          <button v-if=" listBox.type==1" @touchend="chufa()">出发</button>
          <button v-if="listBox.type==2" @touchend="daoda(31)">提货到达</button>
          <button v-if="listBox.type==3" @touchend="daoda(32)">开始装货</button>
          <button v-if="listBox.type==4"  class="upImg" @touchend="upImg(0)">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;上传</button>
          <button v-if="listBox.type==4" @touchend="daoda(33)">装货完毕</button>
          <button v-if="listBox.type==5" @touchend="daoda(41)">运输到达</button>
          <button v-if="listBox.type==6" @touchend="daoda(42)">开始卸货</button>
          <button v-if="listBox.type==7"  class="upImg" @touchend="upImg(1)">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;上传</button>
          <button v-if="listBox.type==7" @touchend="daoda(43)">卸货完毕</button>
          <button v-if="listBox.type==8" @touchend="qianshou(1)">签收</button>
          <div class="clearBoth"></div>
        </div>
      </transition>
    </div>
</template>

<script>
  import MeScroll from '../js/mescroll'
  import {iscroll} from '../js/iscroll'
  import {androidIos} from "../js/app";
  import {bomb} from "../js/zujian";
  import bridge from '../js/bridge';
  import AMap from 'AMap'
    export default {
        name: "task-more-home-page",
        data(){
            return{
              listBox:{
                amount: "",
                arriAddr: "",
                arriAddrPoint: "",
                arriContact: "",
                arriDate: "",
                arriMobile: "",
                carHang: "",
                carno: "",
                deliAddr: "",
                deliAddrPoint: "",
                deliContact: "",
                deliDate: "",
                deliMobile: "",
                dynamic: "",
                expFlag: "",
                ifAppraise: "",
                ifUrgent: "",
                itemDaos: [],
                memo: "",
                payStatus: "",
                pkInvoice: "",
                pkTransType: "",
                status: "",
                transType: "",
                vbillno: "",
                  type:0,
                statusName:""
              },
              tabList:[{
                icon:require("../images/lishi-4.png"),
                name:"历史任务",
                value:0,
              }],
              peopleJ:"",
              peopleW:"",
              errorAbnormalBox:false,
              driverResultBox:false,
              errorPriceBox:false,
              errorAbnormal:[],
              errorPriceList:[],
              driverResult:[],
              errorabnormal:"",
              driverresult:"",
              errorPricetype:"",
              errorPrice:"",
              setTime:null,
              boxShow:true,
            }
        },
        mounted:function () {
          var _this = this;
          androidIos.judgeIphoneX("tabList",2);
          androidIos.judgeIphoneX("container",6);
          sessionStorage.removeItem("orderPk");
          _this.ajaxorder();
          _this.setTime = setInterval(function () {
            _this.ajaxorder();
          },60000)
        },
      methods:{
        serachOrder:function () {
          var _this = this;
          androidIos.addPageList();
          _this.$router.push({ path: "/orderScreen"});
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
        tongyi:function () {
              var _this = this;
              androidIos.loading("正在确认");
              $.ajax({
                type: "POST",
                url: androidIos.ajaxHttp()+"/order/driverConfirmation",
                data:JSON.stringify({pk:_this.listBox.pkInvoice,userCode:sessionStorage.getItem("token"),source:sessionStorage.getItem("source")}),
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                timeout: 10000,
                success: function (driverConfirmation) {
                  if(driverConfirmation.success=="1" ||driverConfirmation.success == ""){
                    _this.$cjj("接收成功");
                    setTimeout(function () {
                      _this.ajaxorder();
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
        telphone:function(tel){
          androidIos.telCall(tel);
        },
        filterInput:function () {
          var _this = this;
          _this.errorPricetype =  _this.errorPricetype.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\,\，\.\。\;\!\[\]\【\】\-]/g,'');
          _this.errorabnormal =  _this.errorabnormal.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\,\，\.\。\;\!\[\]\【\】\-]/g,'');
          _this.driverresult =  _this.driverresult.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\,\，\.\。\;\!\[\]\【\】\-]/g,'');
        },
        tabClick:function (index) {
           var _this = this;
           if(index == 0){
             androidIos.addPageList();
             _this.$router.push({ path: '/histroyTrack'});
           }else if(index == 1){
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
           }else if(index == 2){
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
           }else if(index == 3){
             androidIos.addPageList();
             _this.$router.push({ path: '/track/qrcode',query:{ty:1}});
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
            if((list.length == 0  || list[0].value == 0 )&& _this.errorabnormal == ''){
              bomb.first("请选择或填写异常");
              return false;
            }
            var json = {
              userCode : sessionStorage.getItem("token"),
              source : sessionStorage.getItem("source"),
              expType : list[0] == undefined || (list[0] != undefined && list[0].displayName == "其他") ? "" : androidIos.checkText(list[0].value),
              trackingMemo : androidIos.checkText(_this.errorabnormal),
              entrustVbillno :_this.listBox.vbillno == undefined ? "" : androidIos.checkText(_this.listBox.vbillno)
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
                    _this.ajaxorder();
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
              entrustVbillno:androidIos.checkText(_this.listBox.vbillno)
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
                    _this.ajaxorder();
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
              pk :_this.listBox.pkInvoice == undefined ? "" : androidIos.checkText(_this.listBox.pkInvoice)
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
                    _this.ajaxorder();
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
        lookTrackMore:function (pk) {
          var _this = this;
          androidIos.addPageList();
          _this.$router.push({ path: '/track/trackMore',query:{pk:pk,pt:1}});
        },
        ajaxorder:function () {
          var _this = this;
          var ajax;
          if(JSON.parse(sessionStorage.getItem("driverMessage")).status == 2){
            ajax = $.ajax({
              type: "POST",
              url: androidIos.ajaxHttp() + "/order/loadEntrust",
              data:JSON.stringify({
                page:1,
                size:1,
                type:1,
                state: '6' ,
                userCode:sessionStorage.getItem("token"),
                source:sessionStorage.getItem("source")
              }),
              contentType: "application/json;charset=utf-8",
              dataType: "json",
              timeout: 30000,
              success: function (loadEntrust) {
                if (loadEntrust.success == "1") {
                  if(loadEntrust.list.length > 0){
                    _this.listBox = loadEntrust.list[0];
                    var deliDate = _this.listBox.deliDate.split(":");
                    deliDate.splice(2,1);
                    _this.listBox.deliDate = deliDate.join(":");
                    var arriDate = _this.listBox.arriDate.split(":");
                    arriDate.splice(2,1);
                    _this.listBox.arriDate = arriDate.join(":");
                    _this.listBox.type = _this.listBox.status == '0'? 0 : _this.listBox.status == '10'?1: _this.listBox.status == '20'?2: _this.listBox.status == '31'?3: _this.listBox.status == '32'?4: _this.listBox.status== '33'?5: _this.listBox.status== '41'?6: _this.listBox.status== '42'?7: _this.listBox.status== '43'?8: _this.listBox.status== '50'?9:10;
                    _this.listBox.statusName = _this.listBox.status == '0'? "待确认" : _this.listBox.status == '10' ? "已确认" : _this.listBox.status == '20' ? "司机出发" : _this.listBox.status == '31' ? "提货到达" : _this.listBox.status == '32' ? "开始装货" : _this.listBox.status== '33' ? "开始运输" : _this.listBox.status== '41' ? "运输到达" : _this.listBox.status== '42' ? "开始卸货" : _this.listBox.status== '43' ? "卸货完毕" : _this.listBox.status== '50' ? "已签收" : 10;
                    sessionStorage.setItem("orderPk",_this.listBox.pkInvoice);
                    if( _this.listBox.type < 2){
                      _this.tabList = [{
                        icon:require("../images/lishi-4.png"),
                        name:"历史任务",
                        value:0,
                      }]
                    }else if(_this.listBox.type >= 2 && _this.listBox.type < 8){
                      _this.tabList = [{
                        icon:require("../images/lishi-4.png"),
                        name:"历史任务",
                        value:0,
                      },{
                        icon:require("../images/yichang-4.png"),
                        name:"异常反馈",
                        value:1,
                      },{
                        icon:require("../images/feiyong-3.png"),
                        name:"费用反馈",
                        value:2,
                      }]
                    }else if(_this.listBox.type == 8){
                      _this.tabList = [{
                        icon:require("../images/lishi-4.png"),
                        name:"历史任务",
                        value:0,
                      },{
                        icon:require("../images/erweima-2.png"),
                        name:"签收码",
                        value:3,
                      }]
                    }else{
                      _this.tabList = [{
                        icon:require("../images/lishi-4.png"),
                        name:"历史任务",
                        value:0,
                      }]
                    }
                  }

                }else{
                  androidIos.second(loadEntrust.message);
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
          }
          var ajax1 = $.ajax({
            type: "POST",
            url: androidIos.ajaxHttp()+"/order/getLocation",
            data:JSON.stringify({
              userCode:sessionStorage.getItem("token"),
              source:sessionStorage.getItem("source")
            }),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            async:false,
            timeout: 10000,
            success: function (getLocation) {
              if(getLocation.success == "1"){
                _this.peopleJ = getLocation.errorCode == "" ? "12" : getLocation.errorCode.split(",")[0];
                _this.peopleW = getLocation.errorCode == "" ? "3" : getLocation.errorCode.split(",")[1];
              }else{
                androidIos.second(getLocation.message);
              }
            },
            complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
              _this.cancelReasonBox = false;
              if(status=='timeout'){//超时,status还有success,error等值的情况
                androidIos.second("网络请求超时");
              }else if(status=='error'){
                androidIos.errorwife();
              }
            }
          });
          Promise.all([ajax,ajax1]).then(function(values) {
            androidIos.bridge(_this);
            androidIos.judgeIphoneX("proBox",6);
          })
        },

        go:function () {
          var self = this;
          var map = new AMap.Map("container", {
            resizeEnable: true,
            center: [self.peopleJ, self.peopleW],//地图中心点
            zoom: 13 //地图显示的缩放级别
          });
          map.on("click",function () {
            self.boxShow = false;
          })
          AMap.plugin(['AMap.Scale'],
            function(){
              map.addControl(new AMap.Scale());
            });
          //构造路线导航类
          var driving = new AMap.Driving({
            map: map,
            panel: "panel",
            ferry:1,
          });
          var  ordertype =  self.listBox.status;
          if(self.listBox.deliAddrPoint!= "" && self.listBox.deliAddrPoint != undefined  && self.listBox.arriAddrPoint!= ""  && self.listBox.arriAddrPoint != undefined ){
            if(ordertype ==  "31"   ||ordertype ==  "32"   || ordertype ==  "33"){
              driving.search([self.peopleJ ,self.peopleW],[self.listBox.arriAddrPoint.split(",")[0] , self.listBox.arriAddrPoint.split(",")[1]], function(status, result) {
                var sss = setInterval(function () {
                  if($(".amap-lib-marker-to").length>0){
                    clearInterval(sss);
                    $("#container").find(".amap-lib-marker-to").addClass("amaplibmarkerto");
                    $("#container").find(".amap-lib-marker-from").addClass("amaplibmarkerfroms");
                  }
                },100)
              });
            }else if(ordertype*1 > 10 && ordertype*1 < 31){
              driving.search([self.peopleJ ,self.peopleW],[self.listBox.deliAddrPoint.split(",")[0] , self.listBox.deliAddrPoint.split(",")[1]], function(status, result) {
                var sss = setInterval(function () {
                  if($(".amap-lib-marker-to").length>0){
                    clearInterval(sss);
                    $("#container").find(".amap-lib-marker-to").addClass("amaplibmarkertos");
                    $("#container").find(".amap-lib-marker-from").addClass("amaplibmarkerfroms");
                  }
                },100)
              });
            }else{
              driving.search([self.listBox.deliAddrPoint.split(",")[0] , self.listBox.deliAddrPoint.split(",")[1]],[self.listBox.arriAddrPoint.split(",")[0] , self.listBox.arriAddrPoint.split(",")[1]], function(status, result) {
                var sss = setInterval(function () {
                  if($(".amap-lib-marker-to").length>0){
                    clearInterval(sss);
                    $("#container").find(".amap-lib-marker-to").addClass("amaplibmarkerto");
                    $("#container").find(".amap-lib-marker-from").addClass("amaplibmarkertos");
                  }
                },100)
              });
            }
          }
            var marker;
            marker = new AMap.Marker({
              icon:require('../images/start1.png'),
              position: [self.peopleJ,self.peopleW],
            });
            marker.setMap(map);

        },
        chufa:function(){
          var _this = this;
          androidIos.loading("正在出发");
          $.ajax({
          type: "POST",
          url: androidIos.ajaxHttp()+"/order/driverOut",
          data:JSON.stringify({pk:_this.listBox.pkInvoice,userCode:sessionStorage.getItem("token"),source:sessionStorage.getItem("source")}),
          contentType: "application/json;charset=utf-8",
          dataType: "json",
          timeout: 10000,
          success: function (driverOut) {
            if(driverOut.success=="1" ||driverOut.success == ""){
              _this.$cjj("出发成功");
              setTimeout(function () {
                _this.ajaxorder();
              },500)
            }else{
              androidIos.second(driverOut.message);
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
        daoda:function(type){
          var _this = this;
            var message = type == '31'?'提货达到':type == '32'?'开始装货':type == '33'?'装货完毕':type == '41'?'运输到达':type == '42'?'开始卸货':'卸货完毕';
            var http = type == '33' || type == '41' ? '/order/arriveOrDelivery':'/order/updateStatus';
            type = type == '33'?'1': type == '41' ?'2':type;
            $.ajax({
              type: "POST",
              url: androidIos.ajaxHttp()+http,
              data:JSON.stringify({pk:_this.listBox.pkInvoice,userCode:sessionStorage.getItem("token"),source:sessionStorage.getItem("source"),type:type}),
              contentType: "application/json;charset=utf-8",
              dataType: "json",
              timeout: 10000,
              success: function (arriveOrDelivery) {
                $("#common-blackBox").remove();
                if(arriveOrDelivery.success=="1" ||arriveOrDelivery.success == ""){
                  _this.$cjj(message);
                  setTimeout(function () {
                    _this.ajaxorder();
                  },500)
                }else{
                  androidIos.second(arriveOrDelivery.message);
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
        qianshou:function(type){
          var _this = this;
          androidIos.addPageList();
          _this.$router.push({ path: '/track/qrcode',query:{ty:type}});
        },
        upImg:function (type) {
          var _this = this;
          androidIos.addPageList();
          _this.$router.push({path:'/upProductImg',query:{pk:_this.listBox.pkInvoice,type:type}});
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
      },
      destroyed:function () {
        var _this = this;
        clearInterval(_this.setTime);
      }
    }
</script>
<style>
  @import "../css/mescroll.css";
  @import "../css/scroll.css";
  #taskMoreHomePage{
    width:100%;
    height:auto;
    top:0rem;
    bottom:0;
    position: absolute;
    overflow: scroll;
    margin-top: 0.03125rem;
    background-color: #f6f6f6;
  }
  #taskMoreHomePage .mescroll-upwarp{
    height:0.2rem!important;
    overflow: hidden;
  }
  #taskMoreHomePage .amap-logo{
    display: none!important;
  }
  #taskMoreHomePage .amap-copyright{
    display: none!important;
  }
  #taskMoreHomePage .amap-scalecontrol{
    bottom: 0.3rem !important;
  }
  #taskMoreHomePage .amap-zoomcontrol{
    display: none!important;
  }
  #taskMoreHomePage .amap-icon{
    width:19px;
  }
  #taskMoreHomePage .amap-controls{
    display: none!important;
  }
    @media only screen and (-webkit-min-device-pixel-ratio: 1.5), only screen and (min-resolution: 144dpi){
      #orderLogistics .amap-lib-marker-to{
        background-image: none;
      }
      #orderLogistics  .amap-lib-marker-from {
        background-image:none;
      }
    }
    #orderLogistics .amap-lib-marker-from {
      background-image:none;
    }
    #orderLogistics  .amap-lib-marker-to{
      background-image: none;
    }
  #taskMoreHomePage .amaplibmarkerto{
    background-image: url("../images/end.png")!important;
    background-size:cover!important;
  }
  #taskMoreHomePage .amaplibmarkerfrom{
    background-image: url("../images/start.png")!important;
    background-size:cover!important;
  }
  #taskMoreHomePage .amaplibmarkertos{
    background-image: url("../images/end1.png")!important;
    background-size:cover!important;
  }
  #taskMoreHomePage .amaplibmarkerfroms{
    background-image: url("../images/start1.png")!important;
    background-size:cover!important;
  }
  #panel{
    display: none!important;
  }
</style>
<style scoped>
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
  #proBox{
    position: absolute;
    bottom: 1.5rem;
    background: white;
  }
  .message{
    width:100%;
    margin: 0.2rem auto 0 auto;
  }
  .goodsmessage{
    width:92%;
    padding: 0.2rem 4%;
    background: white;
    border-radius: 0.2rem;
    box-shadow: 0 0.1rem 10px #d8d8d8;
    margin-top: 0.4rem;
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
    background-image: url("../images/trantype.png");
  }
  .goodsmessage h2{
    background-image: url("../images/product.png");
  }
  .goodsmessage h3{
    background-image: url("../images/weight.png");
  }
  .goodsmessage h4{
    background-image: url("../images/price.png");
  }
  .goodsmessage h5{
    width:93%;
    padding:0.1rem 0 0.1rem 7%;
    font-size: 0.36rem;
    line-height: 0.8rem;
    background-image: url("../images/time.png");
    background-repeat: no-repeat;
    background-size: 0.5rem 0.5rem;
    background-position: 0 50%;
  }
  .topStatus,.proStatus,.top{
    width:100%;
    background: white;
    margin-top: 0.27rem;
  }
  .proStatus p{
    width:8.4rem;
    margin-left:0.44rem ;
    padding-left: 1.16rem;
    background-repeat: no-repeat;
    background-position: 0 50%;
    background-size: 0.85rem;
    line-height: 1.17rem;
    color:#373737;
    font-size:0.427rem ;
    border-bottom: 1px solid #F5F5F5;
  }
 #peoUl{
    width:9.56rem;
    margin-left:0.44rem ;
    padding-bottom: 0.3rem;
    border-bottom: 1px solid #F5F5F5;
  }
  #peoUl  li{
    width:30%;
    margin: 0 10%;
    float: left;
    border-top: 1px solid white;
    color:#373737;
    font-size:0.32rem ;
    text-align: center;
  }
  #peoUl li img{
    display: block;
    width:0.827rem;
    margin:0.267rem auto ;
  }
  #peoUl .address h1{
    color:#666;
    font-size: 0.33rem;
  }
  #peoUl  .time h1{
    color:#666;
    float: left;
    font-size: 0.33rem;
    width:50%;
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
  #proUl{
    width:9.56rem;
    margin-left:0.44rem ;
    border-bottom: 1px solid #F5F5F5;
  }
  #proUl li{
    color:#666;
    font-size:0.32rem ;
    line-height: 1.17rem;
  }
  #proUl li span{
    color:#666;
    font-size:0.32rem ;
  }
 .price{
   width: 9.56rem;
   margin-left: 0.44rem;
  }
.price h1{
    color:#666;
    float: left;
    font-size: 0.33rem;
    width:50%;
    text-align: left;
  line-height: 1.17rem;
  border-bottom: 1px solid #F5F5F5;
  }
  #proBox button{
    width:1.88rem;
    background-color: #1869A9;
    color:white;
    font-size: 0.3125rem;
    line-height: 0.7rem;
    float: right;
    border-radius: 0.1rem;
    border: 1px solid #1869A9;
    margin:0.4rem 0.45rem 0.4rem 0 ;
  }
  .jiajiImg{
    width:0.64rem;
    position: absolute;
    right:0;
    top:0;
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
    font-size: 0.3125rem;
    line-height: 0.8rem;
    color:#666;
  }
  .hengxian{
     width:70%;
    height: 1px;
    background: #dbdbdb;
    margin: 0 auto;
  }
  #errorAbnormalBox,#errorPriceBox,#driverResultBox{
    width:100%;
    height: 100%;
    position: fixed;
    top:0;
    left:0;
    z-index:12;
    background-color:rgba(0,0,0,0.5);
  }
  #errorAbnormal,#errorPrice,#driverResult{
    position: absolute;
    bottom:0;
    background: white;
    width:100%;
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
  #search{
    width:9.5rem;
    position: absolute;
    top:0.85rem;
    left:0.25rem;
    height: 1.34rem;
    background: white;
    border-radius: 0.3rem;
    box-shadow:0px 4px 6px 0px rgba(0,0,0,0.11);
  }
  #search img{
    position: absolute;
    right:0.5467rem;
    width:0.347rem;
    top:0.4rem;
  }
  #search p{
    font-size: 0.43rem;
    color:#999;
    padding-left:0.64rem ;
    margin-left: 0.5rem;
    background-image: url("../images/icon-fadangjing.png");
    background-repeat: no-repeat;
    background-position: 0 50%;
    background-size:0.5rem ;
    height: 0.6rem;
    margin-top: 0.37rem;
    width:7rem;
  }
  .upImg{
    border-color:#666666!important;
    color:#666666!important;
    background-color: transparent!important;
    background-image: url("../images/icon-canmore.png");
    background-size:0.48rem;
    background-repeat: no-repeat;
    background-position:0.42rem 50% ;
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
</style>
