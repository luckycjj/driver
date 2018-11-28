<template>
    <div id="electronicReceipt">
      <div id="title" v-title data-title="电子回单"></div>
      <div id="proMore" ref="proMore">
        <p>签收单</p>
        <h1 class="bianhao">运单编号：{{message.number}}</h1>
        <div class="clearBoth"></div>
        <div id="Morebox">
             <div class="proBox" v-for="item in message.product">
               <h2>货品名称 {{item.name}}</h2>
               <h3>货品件数 {{item.num}}件</h3>
               <h3 v-if="item.weight > 0">货品重量 {{item.weight}}吨</h3>
               <h3 v-if="item.volume > 0">货品体积 {{item.volume}}立方米</h3>
               <div class="clearBoth"></div>
             </div>
          <div class="endPeople">
            <h1 style="border:none">收货人名字 {{message.people}}</h1>
            <h1>电话 {{message.tel}}</h1>
            <div class="clearBoth"></div>
          </div>
          <div class="carrier">
            <h1>承运商名称 {{message.carrier}}</h1>
          </div>
          <div class="time">
            <h1 style="border:none">提货日期 {{message.startTime}}</h1>
            <h1>卸货日期 {{message.endTime}}</h1>
            <div class="clearBoth"></div>
          </div>
          <div class="address">
            <h2><h4>提货地址</h4> <h3>{{message.startAddress}}</h3><div class="clearBoth"></div></h2>
            <h2><h4>卸货地址</h4> <h3>{{message.endAddress}}</h3><div class="clearBoth"></div></h2>
            <div class="clearBoth"></div>
          </div>
          <div class="carrier">
            <h1>货品备注 {{message.memo}}</h1>
          </div>
          <div class="qianming" style="border:none">
            <h4>签收人签名:</h4>
            <div class="qianmingban" @click="drawname()" v-if="message.peopleImg == ''">
               点击签名
            </div>
            <img :src="message.peopleImg" @click="drawname()" v-if="message.peopleImg != ''">
            <h6>签收时请字迹工整，谢谢！</h6>
            <div class="clearBoth"></div>
          </div>
        </div>
      </div>
      <div class="qianming" v-if="qianming">
      </div>
      <button @click="shangchuan()">确认上传</button>
    </div>
</template>

<script>
  import {androidIos} from "../../js/app";
  import {bomb} from "../../js/zujian";
    export default {
        name: "electronic-receipt",
        data(){
           return{
              message:{
                number:"",
                product:[],
                people:"",
                tel:"",
                carrier:"",
                startTime:"",
                endTime:"",
                startAddress:"",
                endAddress:"",
                memo:"",
                peopleImg:"",
              },
             qianming:false
           }
        },
        mounted:function () {
          var _this = this;
          $.ajax({
            type: "POST",
            url: androidIos.ajaxHttp()+"/order/loadEntrustDetail",
            data:JSON.stringify({pk:_this.$route.query.pk,userCode:sessionStorage.getItem("token"),source:sessionStorage.getItem("source")}),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            timeout: 20000,
            success: function (loadSegmentDetail) {
              if (loadSegmentDetail.success == "1") {
                var proList = [];
                for(var i = 0 ; i<loadSegmentDetail.invPackDao.length;i++){
                   var json = {
                     name:loadSegmentDetail.invPackDao[i].goodsName + "-" + loadSegmentDetail.invPackDao[i].goodsTypeName,
                     num:loadSegmentDetail.invPackDao[i].num,
                     weight:loadSegmentDetail.invPackDao[i].weight*1/1000,
                     volume:loadSegmentDetail.invPackDao[i].volume*1,
                   }
                  proList.push(json);
                }
                var peopleName = sessionStorage.getItem("peopleName");
                   _this.message = {
                      number : loadSegmentDetail.entrustNo,
                      product:proList,
                     people:loadSegmentDetail.arrival.contact,
                     tel:loadSegmentDetail.arrival.mobile,
                     carrier:loadSegmentDetail.customerDto.customerName,
                     startTime:loadSegmentDetail.deliDate,
                     endTime:loadSegmentDetail.arriDate,
                     startAddress:loadSegmentDetail.delivery.detailAddr,
                     endAddress:loadSegmentDetail.arrival.detailAddr,
                     memo:loadSegmentDetail.remark == "" || loadSegmentDetail.remark == null ? "暂无备注" : loadSegmentDetail.remark,
                     peopleImg:peopleName == null ? "" :peopleName,
                   }

              }else{
                androidIos.second(loadSegmentDetail.message);
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
        },
      methods:{
        drawname:function () {
          var _this = this;
          androidIos.addPageList();
          _this.$router.push({path:"/track/drawname"});
        },
        shangchuan:function () {
          var _this = this;
          if(_this.message.peopleImg == ""){
            bomb.first("签收人请签名");
            return
          }
          html2canvas(_this.$refs.proMore,{
            backgroundColor: null
          }).then((canvas) => {
            let dataURL = canvas.toDataURL("image/png");
            androidIos.loading("正在上传");
            $.ajax({
              type: "POST",
              url: androidIos.ajaxHttp() + "/uploadFile",
              data:JSON.stringify({
                type: "DZHD" ,
                file: dataURL.substr(23),
                userCode:sessionStorage.getItem("token"),
                source:sessionStorage.getItem("source")
              }),
              contentType: "application/json;charset=utf-8",
              dataType: "json",
              timeout: 30000,
              success: function (json) {
                if (json.success == "1") {
                  var photoUrl = json.path;
                  $.ajax({
                    type: "POST",
                    url: androidIos.ajaxHttp() + "/order/signReceipt ",
                    data:JSON.stringify({
                      memo:photoUrl,
                      pk:_this.$route.query.pk,
                      userCode:sessionStorage.getItem("token"),
                      source:sessionStorage.getItem("source")
                    }),
                    contentType: "application/json;charset=utf-8",
                    dataType: "json",
                    timeout: 30000,
                    success: function (uploadAvatar) {
                      if (uploadAvatar.success == "1") {
                        _this.$cjj("上传成功");
                        setTimeout(function () {
                          androidIos.gobackFrom(_this);
                        },500)
                      } else{
                        androidIos.second(uploadAvatar.message);
                      }
                    },
                    complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
                      $("#common-blackBox").remove();
                      if (status == 'timeout') { //超时,status还有success,error等值的情况
                        androidIos.second("当前状况下网络状态差，请检查网络！")
                      } else if (status == "error") {
                        androidIos.errorwife();
                      }
                    }
                  });
                } else{
                  androidIos.second(json.message);
                }
              },
              complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
                $("#common-blackBox").remove();
                if (status == 'timeout') { //超时,status还有success,error等值的情况
                  androidIos.second("当前状况下网络状态差，请检查网络！")
                } else if (status == "error") {
                  androidIos.errorwife();
                }
              }
            });
          });
        }
      }
    }
</script>

<style scoped>
 #proMore{
    width:92%;
   background: white;
   border: 1px solid #e4e4e4;
   margin:0.3rem auto;
 }
  #proMore p{
     font-size: 0.5rem;
    text-align: center;
    line-height: 1.2rem;
  }
  .bianhao{
    width:96%;
    padding: 0 2% 0.2rem 2%;
    font-size: 0.3125rem;
    text-align: right;
    color:#373737;
  }
  #Morebox{
    width:96%;
    margin: 0rem auto 0.5rem auto;
    border: 1px solid #e6e6e6;
    border-radius: 0.1rem;
  }
  .proBox, .endPeople,.carrier,.time,.address,.qianming{
     border-bottom: 1px solid #e6e6e6;
     padding: 0.2rem 0.2rem;
  }
 .proBox h2{
    font-size: 0.35rem;
   color:#373737;
   font-weight: bold;
 }
 .carrier h1{
   font-size: 0.35rem;
   color:#373737;
 }
 .proBox h3{
   font-size: 0.35rem;
   color:#373737;
   font-weight: bold;
   float: left;
   margin-right: 0.5rem;
   margin-top: 0.2rem;
 }
 .endPeople h1,.time h1{
   font-size: 0.35rem;
   color:#373737;
   width:50%;
   float: left;
   text-align: center;
   box-sizing: border-box;
   border-left: 1px solid #e6e6e6;
 }
  .address h4{
     float: left;
    font-size: 0.35rem;
    color:#373737;
  }
 .address h3{
   float: left;
   font-size: 0.35rem;
   color:#373737;
   margin-left: 0.2rem;
   width:6.5rem;
 }
 .qianming h4{
   font-size: 0.4rem;
   color:#373737;
 }
  .qianmingban{
       width:90%;
    height:1.5rem;
    background:#e6e6e6 ;
    border-radius: 0.1rem;
    margin: 0.2rem auto;
    line-height: 1.5rem;
    text-align: center;
    color:#999;
    font-size: 0.45rem;
  }
 .qianming h6{
   font-size: 0.32rem;
   color:#373737;
   float: right;
 }
  button{
    width:90%;
    background: #1869A9;
    display: block;
    color:white;
    border-radius: 0.2rem;
    font-size: 0.4rem;
    line-height: 1.3rem;
    margin: 0.3rem auto;
  }
</style>
