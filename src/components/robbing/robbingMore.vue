<template>
  <div id="robbingMore" style="top:1.3rem;">
    <div id="title" v-title data-title="订单详情"></div>
    <div v-if="carloading" style="z-index:99;position: absolute;top:0rem;bottom:0;height:auto;width:100%;background:#f6f6f6">
      <img src="../../images/carloading.gif" style="width:4rem;position: absolute;top:50%;left:50%;margin-left: -2rem;margin-top: -4rem">
      <p style="font-size: 0.4rem;top:50%;text-align: center;line-height: 1rem;color:#3399FF;width:100%;position: absolute">正在加载中...</p>
    </div>
    <div id="mescroll" class="mescroll">
      <ul id="dataList" class="data-list">
        <li v-for="item in pdlist">
          <div class="topStatus">
            <p>待抢单</p>
            <ul>
               <li>
                 <img src="../../images/robbingTel2.png" @touchend="telphone('021-50929122')">
                 发货人{{item.pickMessage.name | nameCheck}}
               </li>
              <li>
                <img src="../../images/robbingTel1.png" @touchend="telphone(item.endMessage.tel)">
                发货人{{item.endMessage.name | nameCheck}}
              </li>
              <div class="clearBoth"></div>
            </ul>
            <div class="address">
           <!--   <h1>提货地址：{{item.pickMessage.address}}</h1>
              <h1>发货地址：{{item.endMessage.address}}</h1>-->
              <h1><h6 >提货地址：</h6><h6 style="width:7rem;">{{item.pickMessage.address}}</h6><div class="clearBoth"></div></h1>
              <h1><h6>发货地址：</h6><h6 style="width:7rem;">{{item.endMessage.address}}</h6><div class="clearBoth"></div></h1>
            </div>
            <div class="time">
              <h1>提货时间：{{item.goodsmessage.startTime}}</h1>
              <h1>发货时间：{{item.goodsmessage.endTime}}</h1>
              <div class="clearBoth"></div>
            </div>
          </div>
          <div class="proStatus">
            <p>货品信息</p>
            <ul>
              <li v-for="pro in item.goodsmessage.productList">{{item.goodsmessage.tranType}}/{{pro.goods}}&nbsp;&nbsp;&nbsp;{{pro.number}}件<span v-if="pro.weight.replace(/[^0-9]/g,'')*1 > 0 ">/{{pro.weight}}</span><span  v-if="pro.volume.replace(/[^0-9]/g,'')*1 > 0">/{{pro.volume}}</span></li>
              <li :style="{backgroundImage:'url('+require('../../images/trackListbeizhu.png')+')'}" style="margin-bottom: 0;">{{item.pickPay.remark}}</li>
            </ul>
            <div class="price">
              <h1>运输费用：￥{{item.goodsmessage.money}}</h1>
              <h1 style="margin-right: auto">付款方式：现结</h1>
              <div class="clearBoth"></div>
            </div>
          </div>
          <div class="number">
            订单编号：{{item.number}}<br>
            下单时间：{{item.time}}
          </div>
          <button @touchend="qD()" v-if="robbingShow">抢单</button>
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
  var thisThat;
  export default {
    name: "robbingMore",
    data(){
      return{
        type:"",
        pick:true,
        ordertype:"",
        pdlist:[],
        httpurl:"",
        carloading:true,
        errorlogo: 'this.src="' + require('../../images/carpeople.png') + '"',
        robbingShow:false
      }
    },
    mounted:function () {
      var _this = this;
      _this.robbingShow = JSON.parse(sessionStorage.getItem("driverMessage")).driverType == 1 ? true : false;
      androidIos.bridge(_this);
      androidIos.judgeIphoneX("robbingMore",2);
    },
    methods:{
      telphone:function (phone) {
        androidIos.telCall(phone);
      },
      go:function () {
        var self = this;
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
        thisThat = self;
        self.mescroll = new MeScroll("mescroll", { //请至少在vue的mounted生命周期初始化mescroll,以确保您配置的id能够被找到
          up: {
            callback: self.upCallback, //上拉回调
            isBounce: false, //此处禁止ios回弹,解析(务必认真阅读,特别是最后一点): http://www.mescroll.com/qa.html#q10
          },
          down: {
            offset: 2.1 * $("html").css("font-size").replace("px", "")
          }
        });
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
          self.mescroll.endSuccess(curPageData.length);
          self.orderType = self.pdlist[0].orderType;
          self.$nextTick(function () {
            if (self.type != 3) {
              $("#siteCar").hide();
            }else{
              $("#siteCar").show();
              $("#siteLook").remove();
            }
            for(var x = 0 ; x < $(".firstBox").length;x++){
              var className = document.getElementsByClassName("companyImg")[x];
              className.onload = function () {
                for (var i = 0; i < $(".firstBox").length; i++) {
                  var heightImg = $(".companyImg").eq(i).height();
                  var heightBox = $(".firstBox").eq(i).height();
                  var widthBox = $(".firstBox").eq(i).width();
                  var htmlSize = $("html").css("fontSize").replace("px", "");
                  if (heightImg > heightBox) {
                    $(".companyImg").eq(i).css("marginTop", (heightBox - heightImg) / 2 / htmlSize + "rem");
                  } else {
                    $(".companyImg").eq(i).height(heightBox / htmlSize + "rem");
                    $(".companyImg").eq(i).width("auto");
                    var widthImg = $(".companyImg").eq(i).width();
                    $(".companyImg").eq(i).css("marginLeft", (widthBox - widthImg) / 2 / htmlSize + "rem");
                  }
                }
              }
            }
          })
        }, function() {
          //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          self.mescroll.endErr();
        });
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
      qD:function(){
        var _this = this;
          androidIos.first("确认抢此单么？");
          $(".tanBox-yes").unbind('click').click(function(){
            $(".tanBox-bigBox").remove();
            androidIos.loading("正在抢单");
            $.ajax({
              type: "POST",
              url: androidIos.ajaxHttp() + "/order/grabSingle",
              data: JSON.stringify({pk: _this.$route.query.pk, userCode: sessionStorage.getItem("token"), source:sessionStorage.getItem("source")}),
              contentType: "application/json;charset=utf-8",
              dataType: "json",
              timeout: 30000,
              success: function (grabSingle) {
                $("#common-blackBox").remove();
                if(grabSingle.success =="" || grabSingle.success == "1"){
                  _this.$cjj("抢单成功");
                  setTimeout(function () {
                    sessionStorage.removeItem("addPageList");
                    sessionStorage.setItem("trackTap",1);
                    _this.$router.push({path:'/trackList'});
                  },1000)
                }else{
                  androidIos.second(grabSingle.message);
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
          });

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
    }
  }
  function getListDataFromNet(pageNum,pageSize,successCallback,errorCallback) {
    //延时一秒,模拟联网
    setTimeout(function () {
      var type = thisThat.$route.query.type;
      if(thisThat.$route.query.pk != undefined){
        $.ajax({
          type: "POST",
          url: androidIos.ajaxHttp()+"/order/loadSegmentDetail",
          data:JSON.stringify({pk:thisThat.$route.query.pk,userCode:sessionStorage.getItem("token"),source:sessionStorage.getItem("source")}),
          contentType: "application/json;charset=utf-8",
          dataType: "json",
          timeout: 30000,
          success: function (loadSegmentDetail) {
            if (loadSegmentDetail.success == "" || loadSegmentDetail.success == "1") {
              thisThat.type = thisThat.$route.query.type;
              var list=[];
              var weh = 0;
              for(var i =0;i<loadSegmentDetail.invPackDao.length;i++){
                var weight = loadSegmentDetail.invPackDao[i].weigthUnit==3?loadSegmentDetail.invPackDao[i].weight*1000:loadSegmentDetail.invPackDao[i].weight*1;
                var listJson = {
                  pkInvPackB:loadSegmentDetail.invPackDao[i].pkInvPackB,
                  goodsCode:loadSegmentDetail.invPackDao[i].goodsCode+"-"+loadSegmentDetail.invPackDao[i].goodsType,
                  goods:loadSegmentDetail.invPackDao[i].goodsName+"-"+loadSegmentDetail.invPackDao[i].goodsTypeName,
                  number:loadSegmentDetail.invPackDao[i].num,
                  weight: weight/1000 - 1 <0 ? weight + "千克" : weight/1000 + "吨",
                  volume:loadSegmentDetail.invPackDao[i].volume*1 - 1 < 0 ? loadSegmentDetail.invPackDao[i].volume*1000 + "升" : loadSegmentDetail.invPackDao[i].volume*1 + "立方米",
                }
                weh += weight/1000 + weh ;
                list.push(listJson);
              }
              var tranTypeBoth = loadSegmentDetail.transType;
              if(loadSegmentDetail.carLength !=  "" && loadSegmentDetail.carLength != null){
                tranTypeBoth = tranTypeBoth + "(" + loadSegmentDetail.carLength + "米)";
              }
              if(loadSegmentDetail.carModel != "" && loadSegmentDetail.carModel != null){
                tranTypeBoth = tranTypeBoth + "(" + loadSegmentDetail.carModel + ")";
              }
              var list1 = loadSegmentDetail.deliDate.split(":");
              list1.splice(2,1);
              loadSegmentDetail.deliDate = list1.join(":");
              var list2 = loadSegmentDetail.arriDate.split(":");
              list2.splice(2,1);
              loadSegmentDetail.arriDate = list2.join(":");
              var pdlist = [{
                orderType:loadSegmentDetail.trackingStatus==null?"已确认":loadSegmentDetail.trackingStatus,
                evaluate:{
                  grade:loadSegmentDetail.appraiseScore==""?0:loadSegmentDetail.appraiseScore
                },
                goodsmessage:{
                  startAddress:loadSegmentDetail.delivery!=null?(loadSegmentDetail.delivery.province+loadSegmentDetail.delivery.area):"",
                  endAddress:loadSegmentDetail.arrival!=null?(loadSegmentDetail.arrival.province+loadSegmentDetail.arrival.area):"",
                  distance:"0",
                  tranType:tranTypeBoth,
                  productList:list,
                  money:loadSegmentDetail.price*1,
                  startTime:loadSegmentDetail.deliDate,
                  endTime:loadSegmentDetail.arriDate
                },
                pickMessage:{
                  name:loadSegmentDetail.delivery!=null?loadSegmentDetail.delivery.contact:"",
                  tel:loadSegmentDetail.delivery!=null?loadSegmentDetail.delivery.mobile:"",
                  company:loadSegmentDetail.delivery!=null?loadSegmentDetail.delivery.addrName:"",
                  address:loadSegmentDetail.delivery!=null?loadSegmentDetail.delivery.province+loadSegmentDetail.delivery.area+loadSegmentDetail.delivery.detailAddr:"",
                  addresspk:loadSegmentDetail.delivery!=null?loadSegmentDetail.delivery.pkAddress:"",
                },
                endMessage:{
                  name:loadSegmentDetail.arrival!=null?loadSegmentDetail.arrival.contact:"",
                  tel:loadSegmentDetail.arrival!=null?loadSegmentDetail.arrival.mobile:"",
                  company:loadSegmentDetail.arrival!=null?loadSegmentDetail.arrival.addrName:"",
                  address:loadSegmentDetail.arrival!=null?loadSegmentDetail.arrival.province+loadSegmentDetail.arrival.area+loadSegmentDetail.arrival.detailAddr:"",
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
                  logo:loadSegmentDetail.customerDto != null ? loadSegmentDetail.customerDto.customerImg : "",
                  company:loadSegmentDetail.customerDto!=null?loadSegmentDetail.customerDto.customerName:"",
                  year:loadSegmentDetail.customerDto!=null?((((new Date()).getTime()-(new Date(loadSegmentDetail.customerDto.createDate.replace('-','/').replace('-','/'))).getTime())/1000/60/60/24/365 -0.5)<0?"不到半年":androidIos.fixed(((new Date()).getTime()-(new Date(invoiceDetail.customerDto.createDate.replace('-','/').replace('-','/'))).getTime())/1000/60/60/24/365 ,1)+"年"):"",
                  phone:loadSegmentDetail.customerDto!=null?loadSegmentDetail.customerDto.mobile:"",
                },
                number:type=="1" || type == '2' || type =="3"?loadSegmentDetail.segmentNo:loadSegmentDetail.entrustNo,
                time:loadSegmentDetail.createTime
              }]
              var data=pdlist;
              var listData=data;//模拟分页数据
              successCallback&&successCallback(listData);//成功回调
            }else{
              androidIos.second(loadSegmentDetail.message);
              successCallback&&successCallback(thisThat.pdlist);//成功回调
            }

          },
          complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
            thisThat.carloading = false;
            if(status=='timeout'){//超时,status还有success,error等值的情况
              successCallback&&successCallback(thisThat.pdlist);
              androidIos.second("网络请求超时");
            }else if(status=='error'){
              successCallback&&successCallback(thisThat.pdlist);
              androidIos.errorwife();
            }
          }
        })
      }

    },500)
  }

</script>
<style>
  @import "../../css/mescroll.css";
  @import "../../css/scroll.css";
  #robbingMore .hide, .mescroll-totop{
    display: none!important;
  }
</style>
<style scoped>
  #robbingMore{
    position: absolute;
    top:1.3rem;
    bottom:0;
    height: auto;
    background: #f6f6f6;
    width:100%;
  }

  #robbingMore .mescroll{
    position: absolute;
    top:0rem;
    bottom: 1.2rem;
    height: auto;
  }


   button{
    width:9rem;
    background: #1869A9; /* Safari 5.1 - 6.0 */
    color:white;
    font-size: 0.42rem;
    letter-spacing: 0.0625rem;
    line-height: 1.21rem;
     margin:0.7rem auto 0.2rem auto;
     display: block;
     border-radius: 0.2rem;
  }
  .topStatus,.proStatus{
    width:100%;
    background: white;
    margin-top: 0.27rem;
  }
  .topStatus p{
    width:8.4rem;
    margin-left:0.44rem ;
    padding-left: 1.16rem;
    background-image: url("../../images/robbingSta.png");
    background-repeat: no-repeat;
    background-position: 0 50%;
    background-size: 0.85rem;
    line-height: 1.17rem;
    color:#373737;
    font-size:0.427rem ;
    border-bottom: 1px solid #F5F5F5;
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
  .proStatus ul{
    width:9.56rem;
    margin-left:0.44rem ;
    padding-bottom: 0.3rem;
    padding-top: 0.375rem;
    border-bottom: 1px solid #F5F5F5;
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
  }
  .proStatus ul li span{
    color:#666;
    font-size:0.32rem ;
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
    color:#666;
    float: left;
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
  .proStatus  .price{
    width:9.56rem;
    margin-left:0.44rem ;
    border-bottom: 1px solid #F5F5F5;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
  .proStatus  .price h1{
    color:#666;
    float: left;
    font-size: 0.33rem;
    margin-right:0.9rem ;
  }
  .number{
    width:9.56rem;
    margin-left:0.44rem ;
    padding-top: 0.3rem;
    padding-bottom: 0.3rem;
    font-size: 0.33rem;
    color:#666;
    line-height: 0.6rem;
  }
</style>
