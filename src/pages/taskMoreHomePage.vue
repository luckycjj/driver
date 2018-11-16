<template>
    <div id="taskMoreHomePage">
      <div id="title" v-title data-title="任务"></div>
      <div id="container"></div>
      <div id="panel"></div>
      <div id="proBox" v-if="listBox.pkTransType != ''">
        <div class="message" @click="lookTrackMore(listBox.pkInvoice)">
          <div class="proStatus">
            <p :style="{backgroundImage: 'url(' + require('../images/trackMoreIcon'+ listBox.type +'.png') + ')' }" >{{listBox.statusName}}</p>
            <div class="topStatus">
              <ul id="peoUl">
                <li @click.stop="telphone(listBox.deliMobile)">
                  <img src="../images/robbingTel2.png">
                  发货人{{listBox.deliContact | nameCheck}}
                </li>
                <li @click.stop="telphone(listBox.arriMobile)">
                  <img src="../images/robbingTel1.png">
                  发货人{{listBox.arriContact | nameCheck}}
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
              <li v-for="pro in listBox.itemDaos">运单编号:{{listBox.vbillno}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{listBox.transType}}/{{pro.pkTransType}}/{{pro.num}}件<span v-if="pro.weight.replace(/[^0-9]/g,'')*1 > 0 ">/{{pro.weight}}{{pro.weightUnit}}</span><span  v-if="pro.volume.replace(/[^0-9]/g,'')*1 > 0">/{{pro.volume}}{{pro.volumeUnit}}</span></li>
            </ul>
          </div>
        </div>
        <button v-if=" listBox.type==1" @click="chufa()">出发</button>
        <button v-if="listBox.type==2" @click="daoda(31)">提货到达</button>
        <button v-if="listBox.type==3" @click="daoda(32)">开始装货</button>
        <button v-if="listBox.type==4"  class="upImg" @click="upImg(0)">&nbsp;&nbsp;&nbsp;&nbsp;上传货品</button>
        <button v-if="listBox.type==4" style="width:3.4rem;float: right;margin-right: 0.5rem;" @click="daoda(33)">装货完毕</button>
        <button v-if="listBox.type==5" @click="daoda(41)">运输到达</button>
        <button v-if="listBox.type==6" @click="daoda(42)">开始卸货</button>
        <button v-if="listBox.type==7"  class="upImg" @click="upImg(1)">&nbsp;&nbsp;&nbsp;&nbsp;上传货品</button>
        <button v-if="listBox.type==7" style="width:3.4rem;float: right;margin-right: 0.5rem;"  @click="daoda(43)">卸货完毕</button>
        <button v-if="listBox.type==8" @click="qianshou(1)">签收</button>
        <div class="clearBoth"></div>
      </div>
      <footComponent ref="footcomponent" :idx='0'></footComponent>
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
              peopleJ:"",
              peopleW:"",
              setTime:null,
            }
        },
        mounted:function () {
          var _this = this;
          _this.ajaxorder();
          _this.setTime = setInterval(function () {
            _this.ajaxorder();
          },60000)
        },
      methods:{
        telphone:function(tel){
          androidIos.telCall(tel);
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
                  _this.listBox = loadEntrust.list[0];
                  var deliDate = _this.listBox.deliDate.split(":");
                  deliDate.splice(2,1);
                  _this.listBox.deliDate = deliDate.join(":");
                  var arriDate = _this.listBox.arriDate.split(":");
                  arriDate.splice(2,1);
                  _this.listBox.arriDate = arriDate.join(":");
                  _this.listBox.type = _this.listBox.status == '0'? 0 : _this.listBox.status == '10'?1: _this.listBox.status == '20'?2: _this.listBox.status == '31'?3: _this.listBox.status == '32'?4: _this.listBox.status== '33'?5: _this.listBox.status== '41'?6: _this.listBox.status== '42'?7: _this.listBox.status== '43'?8: _this.listBox.status== '50'?9:10;
                  _this.listBox.statusName = _this.listBox.status == '0'? "待确认" : _this.listBox.status == '10' ? "已确认" : _this.listBox.status == '20' ? "司机出发" : _this.listBox.status == '31' ? "提货到达" : _this.listBox.status == '32' ? "开始装货" : _this.listBox.status== '33' ? "开始运输" : _this.listBox.status== '41' ? "运输到达" : _this.listBox.status== '42' ? "开始卸货" : _this.listBox.status== '43' ? "卸货完毕" : _this.listBox.status== '50' ? "已签收" : 10;

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
          })
        },

        go:function () {
          var self = this;
          var map = new AMap.Map("container", {
            resizeEnable: true,
            center: [self.peopleJ, self.peopleW],//地图中心点
            zoom: 13 //地图显示的缩放级别
          });
        /*  map.on("click",function () {
            self.mapLook();
          })*/
          AMap.plugin(['AMap.Scale'],
            function(){
              map.addControl(new AMap.Scale());
            });
          //构造路线导航类
          var driving = new AMap.Driving({
            map: map,
            panel: "panel"
          });
          if(self.listBox.deliAddrPoint!= "" &&self.listBox.arriAddrPoint!= ""){
            driving.search([self.listBox.deliAddrPoint.split(",")[0] , self.listBox.deliAddrPoint.split(",")[1]],[self.listBox.arriAddrPoint.split(",")[0] , self.listBox.arriAddrPoint.split(",")[1]], function(status, result) {});

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
          _this.$router.push({path:'/upProductImg',query:{pk:_this.$route.query.pk,type:type}});
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
  /*  @media only screen and (-webkit-min-device-pixel-ratio: 1.5), only screen and (min-resolution: 144dpi){
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
    }*/
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
    width:50%;
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
</style>
