<template>
    <div id="getOrderSet" style="top:1.3rem">
      <div id="title" v-title data-title="接单设置"></div>
      <div class="chooseTap">
        <p style="float: left">是否接单</p>
        <div class="morenBox" :class="getOrderYes ? 'morenBoxTrue' : ''" @touchend="morenClick()">
          <div class="moren" :class="getOrderYes ? 'morenTrue' : ''"></div>
        </div>
        <div class="clearBoth"></div>
      </div>
      <div class="chooseTap">
        <p>用车类型</p>
        <ul>
          <li v-for="(item,index) in proList" :class="item.check ? 'choose' : ''" @touchend="tabClick(index,proList,1)">{{item.displayName}}</li>
          <div class="clearBoth"></div>
        </ul>
      </div>
      <div class="chooseTap">
        <p>装货时间</p>
        <ul>
          <li v-for="(item,index) in timeType" :class="item.check ? 'choose' : ''" @touchend="tabClick(index,timeType)">{{item.displayName}}</li>
          <div class="clearBoth"></div>
        </ul>
      </div>
      <div class="chooseTap" v-if="show">
        <p>车长<span>(米,可多选)</span></p>
        <ul>
          <li class="carlengthLi" v-for="(item,index) in carLength" :class="item.check ? 'choose' : ''" @touchend="tabClicks(index,carLength,2)">{{item.displayName}}</li>
          <div class="clearBoth"></div>
        </ul>
      </div>
      <div class="chooseTap"  v-if="show">
        <p>车型<span>(可多选)</span></p>
        <ul>
          <li v-for="(item,index) in carModel" :class="item.check ? 'choose' : ''" @touchend="tabClicks(index,carModel)">{{item.displayName}}</li>
          <div class="clearBoth"></div>
        </ul>
      </div>
      <div class="chooseTap">
        <p>订阅路线</p>
        <div class="screenAddre">
          <div class="startAddre">
            <div class="addresscheck" @touchend="checkAddress(0)" v-html="searchList.startAdd == '' ? '全国' : searchList.startAdd "></div>
          </div>
          <div class="hengxian"></div>
          <div class="startAddre">
            <div class="addresscheck" @touchend="checkAddress(1)" v-html="searchList.endAdd == '' ? '全国' : searchList.endAdd "></div>
          </div>
          <button class="addAddress" @touchend="addAddress()">添加</button>
          <div class="clearBoth"></div>
        </div>
        <h1>选择路线</h1>
        <div class="addressList" v-for="(item,index) in addressList">
          <h2><span v-html="item.start == '' ? '全国' : item.start"></span> - <span  v-html="item.end == '' ? '全国' : item.end"></span></h2>
          <button @touchend="removeAdd(index)">取消</button>
          <div class="clearBoth"></div>
        </div>
      </div>
      <transition name="slide-fade">
        <div id="screenAddressBox" v-if="screenAddressTrue">
          <div id="screenAddressBody">
            <img src="../../images/closed2.png"  @touchend="hotAddressListno()">
            <p>选择地址</p>
            <h6 v-if="normalCityList.length > 0" @touchend="normalCityGoback()">返回</h6>
            <div class="checkedAddress" v-if="normalCityList.length > 0">
              <h1>已选择</h1>
              <ul>
                <li v-html="addtype == 0 ? searchList.searchStartPro : searchList.searchEndPro"></li>
                <li v-html="addtype == 0 ? searchList.searchStartCity : searchList.searchEndCity"></li>
                <li><span style="color: #2c9cff;border-bottom: 1px solid #2c9cff;font-size:0.35rem;">请选择</span></li>
                <div class="clearBoth"></div>
              </ul>
            </div>
            <div class="hotAddress" v-if="normalCityList.length == 0">
              <h1>热门城市</h1>
              <ul>
                <li v-for="(item ,index) in hotAddressList"  :class="item.checked ? 'addCheckTrue' : ''" @touchend="hotAddressListChoose(item,0)">{{item.name}}</li>
                <div class="clearBoth"></div>
              </ul>
            </div>
            <div class="selectAddress" v-if="normalCityList.length == 0">
              <h1>选择省份/地区</h1>
              <ul>
                <li v-for="(item ,index) in normalAddressList" @touchend="chooseProvince(item,index)"><div class="shouzimu">{{item.PinyinFirst}}</div>{{item.region}}<div class="clearBoth"></div></li>
                <div class="clearBoth"></div>
              </ul>
            </div>
            <div class="selectcity" v-if="normalCityList.length > 0 && normalAreaList.length == 0">
              <h1>选择城市</h1>
              <ul id="selectcityUl">
                <li @touchend="hotAddressListChoose(addtype == 0 ?  searchList.searchStartPro : searchList.searchEndPro,2)"><div class="shouzimu"></div><h3 v-html="addtype == 0 ? '全' + searchList.searchStartPro : '全' + searchList.searchEndPro"></h3></li>
                <li v-for="(item ,index) in normalCityList" :class="item.checked ? 'addCheckTrue' : ''" @touchend="chooseCity(item,index)"><div class="shouzimu">{{item.PinyinFirst}}</div>{{item.region}}</li>
                <div class="clearBoth"></div>
              </ul>
            </div>
            <div class="selectarea" v-if="normalAreaList.length > 0">
              <h1>选择区/县</h1>
              <ul id="selectareaUl">
                <li @touchend="hotAddressListChoose(addtype == 0 ?  searchList.searchStartCity : searchList.searchEndCity,2)"><div class="shouzimu"></div><h3 v-html="addtype == 0 ? '全' + searchList.searchStartCity : '全' + searchList.searchEndCity"></h3></li>
                <li v-for="(item ,index) in normalAreaList" :class="item.checked ? 'addCheckTrue' : ''" @touchend="hotAddressListChoose(item,1)"><div class="shouzimu">{{item.PinyinFirst}}</div>{{item.region}}</li>
                <div class="clearBoth"></div>
              </ul>
            </div>
            <div class="scrollAZ" v-if="normalCityList.length  ==  0 && normalAreaList.length == 0">
              <ul>
                <li @touchend="scrollAddress(index)" v-for="(item,index) in PinyinFirstList"> {{item.PinyinFirst}}</li>
              </ul>
            </div>
          </div>
        </div>
      </transition>
    </div>
</template>

<script>
  import {bomb} from "../../js/zujian";
  import {androidIos} from "../../js/app";
  import bridge from '../../js/bridge';
  import {provinceCityArea} from "../../js/provinceCityArea";
  import  {ConvertPinyin}  from "../../js/PINYING"
    export default {
        name: "get-order-set",
       data(){
          return{
               getOrderYes:false,
               show:false,
               proList:[],
               timeType:[{
                   displayName:"今天",
                   value:0,
                   check:false,
               },{
                 displayName:"明天",
                 value:-1,
                 check:false,
               },{
                 displayName:"不限",
                 value:"",
                 check:false,
               }],
               carLength:[],
               carModel:[],
               addressList:[],
                searchList:{
                  startAdd:"",
                  endAdd:"",
                  searchStartPro:"",
                  searchEndPro:"",
                  searchStartCity:"",
                  searchEndCity:"",
                },
            screenAddressTrue:false,
            hotAddressList:[{
              name:"全国",
              region:"",
              province:"",
              chescked:false,
            },{
              name:"北京市",
              region:"北京市",
              province:"北京市",
              chescked:false,
            },{
              name:"上海市",
              region:"上海市",
              province:"上海市",
              chescked:false,
            },{
              name:"广州市",
              region:"广州市",
              province:"广东省",
              chescked:false,
            },{
              name:"深圳市",
              region:"深圳市",
              province:"广东省",
              chescked:false,
            },{
              name:"杭州市",
              region:"杭州市",
              province:"浙江省",
              chescked:false,
            },{
              name:"南京市",
              region:"南京市",
              province:"江苏省",
              chescked:false,
            },{
              name:"苏州市",
              region:"苏州市",
              province:"江苏省",
              chescked:false,
            },{
              name:"天津市",
              region:"天津市",
              province:"天津市",
              chescked:false,
            },{
              name:"武汉市",
              region:"武汉市",
              province:"湖北省",
              chescked:false,
            },{
              name:"长沙市",
              region:"长沙市",
              province:"湖南省",
              chescked:false,
            },{
              name:"重庆市",
              region:"重庆市",
              province:"重庆市",
              chescked:false,
            },{
              name:"成都市",
              region:"成都市",
              province:"四川省",
              chescked:false,
            }],
            normalAddressList:[],
            normalCityList:[],
            normalAreaList:[],
            searchStartPro:"",
            searchEndPro:"",
            searchStartCity:"",
            searchEndCity:"",
            PinyinFirstList:[],
            addtype:0,
            AddressStartlist:[],
            AddressEndlist:[],
          }
       },
      mounted:function () {
        var _this = this;
        androidIos.judgeIphoneX("getOrderSet",2);
        var ajax1,ajax2,ajax3;
        if( _this.proList.length == 0){
          ajax1 = $.ajax({
            type: "POST",
            url: androidIos.ajaxHttp()+"/settings/getTransType",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            timeout: 30000,
            success: function (getCarType) {
              var list = [];
              for(var i = 0; i<getCarType.length;i++){
                var json = {
                  value : getCarType[i].value,
                  displayName : getCarType[i].displayName,
                  check:false
                }
                list.push(json)
              }
              list.push({
                value : "",
                displayName : "不限",
                check:false
              })
              _this.proList = list;
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
        if( _this.carLength.length == 0){
          ajax2 = $.ajax({
            type: "GET",
            url: androidIos.ajaxHttp()+"/settings/getSysConfigList",
            data:{str:"car_length" ,userCode:sessionStorage.getItem("token"),source:sessionStorage.getItem("source")},
            dataType: "json",
            timeout: 10000,
            success: function (getCarType) {
              var list = [];
              for(var i = 0; i<getCarType.length;i++){
                var json = {
                  value : getCarType[i].value,
                  displayName : getCarType[i].displayName,
                  check:false
                }
                list.push(json)
              }
              list.push({
                value : "",
                displayName : "不限",
                check:false
              })
              _this.carLength = list;
            },
            complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
              if(status=='timeout'){//超时,status还有success,error等值的情况
                androidIos.second("网络请求超时");
              }else if(status=='error'){
                androidIos.errorwife();
              }
            }
          });
        }
        if( _this.carModel.length == 0){
          ajax3 = $.ajax({
            type: "GET",
            url: androidIos.ajaxHttp()+"/settings/getSysConfigList",
            data:{str:"car_type",userCode:sessionStorage.getItem("token"),source:sessionStorage.getItem("source")},
            dataType: "json",
            timeout: 10000,
            success: function (getCarType) {
              var list = [];
              for(var i = 0; i<getCarType.length;i++){
                var json = {
                  value : getCarType[i].value,
                  displayName : getCarType[i].displayName,
                  check:false
                }
                list.push(json)
              }
              list.push({
                value : "",
                displayName : "不限",
                check:false
              })
              _this.carModel = list;
            },
            complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
              if(status=='timeout'){//超时,status还有success,error等值的情况
                androidIos.second("网络请求超时");
              }else if(status=='error'){
                androidIos.errorwife();
              }
            }
          });
        }
        _this.normalAddressList = provinceCityArea;
        var list = [];
        for(var i = 0 ; i < _this.normalAddressList.length ;i++){
          _this.normalAddressList[i].PinyinFirst = ConvertPinyin(_this.normalAddressList[i].region).substring(0,1).toUpperCase();
          list.push({
            PinyinFirst:ConvertPinyin(_this.normalAddressList[i].region).substring(0,1).toUpperCase(),
            scroll:0,
          });
        }
        _this.normalAddressList.sort(_this.compare("PinyinFirst"));
        _this.unique1(_this.normalAddressList);
        list.sort(_this.compare("PinyinFirst"));
        for(var i = 0 ; i < list.length ;i++){
          list[i].scroll = _this.countId(list);
        }
        var res = [list[0]];
        for(var i = 1; i < list.length; i++){
          if(list[i].PinyinFirst !== res[res.length - 1].PinyinFirst){
            res.push(list[i]);
          }
        }
        _this.PinyinFirstList = res;
        Promise.all([ajax1,ajax2,ajax3]).then((result) => {
          androidIos.bridge(_this);
        }).catch((error) => {
          console.log(error)
        })
      },
      methods:{
        go:function () {
            var _this = this;
            _this.getLocal();
          },
        morenClick:function () {
          var _this = this;
          _this.getOrderYes = !_this.getOrderYes;
          _this.setLocal();
        },
        tabClick:function (number,list,type) {
            var _this = this;
            for(var i = 0 ; i < list.length;i++){
              if(number != i){
                list[i].check = false;
              }else{
                list[i].check = ! list[i].check;
              }
            }
            if(type == 1){
               if(list[number].value != "e5e602a22c5a4689b8d151c76a4d1179"){
                 _this.show = true;
               }else{
                  _this.show = false;
                 for(var i = 0 ; i < _this.carLength.length ; i++){
                   _this.carLength[i].check = false;
                 }
                 for(var i = 0 ; i < _this.carModel.length ; i++){
                   _this.carModel[i].check = false;
                 }
               }
            }
            _this.setLocal();
          },
        tabClicks:function (number,list) {
          var _this = this;
           list[number].check = ! list[number].check;
           if(list[number].value == ""){
             for(var i = 0 ; i < list.length;i++){
               if(list[i].value != ""){
                 list[i].check = false;
               }
             }
           }else{
             list[list.length - 1].check = false;
           }
           _this.setLocal();
         },
        addAddress:function () {
          var _this = this;
          if(_this.addressList.length < 10){
            var json = {
              start: _this.AddressStartlist.join(""),
              startList: _this.AddressStartlist,
              end: _this.AddressEndlist.join(""),
              endList: _this.AddressEndlist,
            }
            _this.addressList.push(json);
            _this.setLocal();
          }else{
            bomb.first("最多订阅10个路线");
          }
        },
        uniq:function(array){
          var temp = []; //一个新的临时数组
          for(var i = 0; i < array.length; i++){
            if(temp.indexOf(array[i]) == -1){
              temp.push(array[i]);
            }
          }
          return temp;
        },
        removeAdd:function (number) {
          var _this = this;
          androidIos.first("确定取消吗?");
          $(".tanBox-yes").unbind('click').click(function(){
            $(".tanBox-bigBox").remove();
            _this.addressList.splice(number,1);
            _this.setLocal();
          });
        },
        setLocal:function () {
            var _this = this;
           var json = {
               userCode:sessionStorage.getItem("token"),
               getOrderYes:false,
               proList:[],
               timeType:[],
               carLength:[],
               carModel:[],
               addressList:[],
           }
           json.getOrderYes = _this.getOrderYes;
           json.addressList = _this.addressList;
           for(var i = 0 ; i < _this.proList.length ; i++){
               if(_this.proList[i].check){
                 json.proList.push(_this.proList[i])
               }
           }
          for(var i = 0 ; i < _this.timeType.length ; i++){
            if(_this.timeType[i].check){
              json.timeType.push(_this.timeType[i])
            }
          }
          for(var i = 0 ; i < _this.carLength.length ; i++){
            if(_this.carLength[i].check){
              json.carLength.push(_this.carLength[i])
            }
          }
          for(var i = 0 ; i < _this.carModel.length ; i++){
            if(_this.carModel[i].check){
              json.carModel.push(_this.carModel[i])
            }
          }
          localStorage.setItem("GETORDERSETUSER"+ sessionStorage.getItem("token"),JSON.stringify(json));
        },
         getLocal:function () {
           var _this = this;
           var GETORDERSETUSER = localStorage.getItem("GETORDERSETUSER" + sessionStorage.getItem("token"));
           if(GETORDERSETUSER != undefined){
             GETORDERSETUSER = JSON.parse(GETORDERSETUSER);
             _this.getOrderYes = GETORDERSETUSER.getOrderYes;
             _this.addressList = GETORDERSETUSER.addressList;
             if(GETORDERSETUSER.proList.length > 0){
               for(var x = 0 ; x < GETORDERSETUSER.proList.length;x++){
                 for(var i = 0 ; i < _this.proList.length ; i++){
                   if(GETORDERSETUSER.proList[x].value ==  _this.proList[i].value){
                     _this.proList[i].check = true;
                     if(_this.proList[i].value != "e5e602a22c5a4689b8d151c76a4d1179"){
                       _this.show = true;
                     }
                     break;
                   }
                 }
               }
             }else{
               _this.show = true;
             }
             for(var x = 0 ; x < GETORDERSETUSER.timeType.length;x++){
               for(var i = 0 ; i < _this.timeType.length ; i++){
                 if(GETORDERSETUSER.timeType[x].value ==  _this.timeType[i].value){
                   _this.timeType[i].check = true;
                   break;
                 }
               }
             }
             for(var x = 0 ; x < GETORDERSETUSER.carLength.length;x++){
               for(var i = 0 ; i < _this.carLength.length ; i++){
                 if(GETORDERSETUSER.carLength[x].value ==  _this.carLength[i].value){
                   _this.carLength[i].check = true;
                   break;
                 }
               }
             }
             for(var x = 0 ; x < GETORDERSETUSER.carModel.length;x++){
               for(var i = 0 ; i < _this.carModel.length ; i++){
                 if(GETORDERSETUSER.carModel[x].value ==  _this.carModel[i].value){
                   _this.carModel[i].check = true;
                   break;
                 }
               }
             }
           }else{
             _this.getOrderYes = true;
             _this.show = true;
           }
         },
        countId:function(data){
          var count={};
          for(var i=0;i<data.length;i++){
            if(count[data[i].PinyinFirst]){
              count[data[i].PinyinFirst]++;;
              continue;
            }
            count[data[i].PinyinFirst]=1;
          }
          return count;
        },
        compare : function(name){
          return function(a,b){
            var s1 = a[name];
            var s2 = b[name];
            return s1.localeCompare(s2);
          }
        },
        unique1:function(arr){
          for (var i = 0; i < arr.length; i++) {
            for(var j = i+1 ; j < arr.length;j++){
              if(arr[i].PinyinFirst == arr[j].PinyinFirst){
                arr[j].PinyinFirst = "";
              }
            }
          }
          return arr;
        },
        checkAddress:function (type) {
          var _this = this;
          _this.screenAddressTrue = true;
          _this.addtype = type;
          _this.normalCityList = [];
          _this.normalAreaList = [];
          for(var i =0 ; i < _this.hotAddressList.length;i++){
            _this.hotAddressList[i].checked = false;
          }
          for(var i =0 ; i < _this.normalCityList.length;i++){
            _this.normalCityList[i].checked = false;
          }
          /* if(type == 0){
             _this.searchStartPro =  _this.searchList.searchStartPro;
             _this.searchStartCity = _this.searchList.searchStartCity;
             if(_this.searchList.startAdd != "" && _this.searchList.searchStartPro == ""){
               for(var i = 0; i < _this.hotAddressList.length;i++){
                 _this.hotAddressList[i].checked = false;
                 if(_this.hotAddressList[i].region == _this.searchList.startAdd){
                   _this.hotAddressList[i].checked = true;
                 }
               }
             }else if( _this.searchList.searchStartPro != ""){
               for(var i = 0 ; i < _this.normalAddressList.length ; i++){
                 if(_this.searchList.searchStartPro == _this.normalAddressList[i].region){
                   _this.normalCityList = _this.normalAddressList[i].child;
                   for(var x = 0 ; x < _this.normalCityList.length ;x++){
                     _this.normalCityList[x].PinyinFirst = ConvertPinyin(_this.normalCityList[x].region).substring(0,1).toUpperCase();
                   }
                   _this.normalCityList.sort(_this.compare("PinyinFirst"));
                   _this.unique1(_this.normalCityList);
                   for(var x = 0; x < _this.normalCityList.length ; x++){
                     if(_this.searchList.searchStartCity == _this.normalCityList[x].region){
                       _this.normalAreaList = _this.normalCityList[x].child;
                       for(var z = 0 ; z < _this.normalAreaList.length ;z++){
                         _this.normalAreaList[z].PinyinFirst = ConvertPinyin(_this.normalAreaList[z].region).substring(0,1).toUpperCase();
                       }
                       _this.normalAreaList.sort(_this.compare("PinyinFirst"));
                       _this.unique1(_this.normalAreaList);
                       _this.$nextTick(function () {
                         var scrolltopGo = _this.tabShow == 0 ? localStorage.getItem("getPageScroll0") :  localStorage.getItem("getPageScroll2");
                         scrolltopGo = scrolltopGo == null ? 0 : scrolltopGo;
                         $("#selectareaUl").animate({scrollTop: scrolltopGo}, 0);
                       });
                       break;
                     }
                   }
                 }
               }
               for(var i = 0 ; i < _this.normalAreaList.length ; i++){
                 _this.normalAreaList[i].checked = false;
                 if(_this.searchList.startAdd == _this.normalAreaList[i].region){
                   _this.normalAreaList[i].checked = true;
                 }
               }
             }
           }else if(type == 1){
             _this.searchEndPro =  _this.searchList.searchEndPro;
             _this.searchEndCity = _this.searchList.searchEndCity;
             if(_this.searchList.endAdd != "" && _this.searchList.searchEndPro == ""){
               for(var i = 0; i < _this.hotAddressList.length;i++){
                 _this.hotAddressList[i].checked = false;
                 if(_this.hotAddressList[i].region == _this.searchList.endAdd){
                   _this.hotAddressList[i].checked = true;
                 }
               }
             }else if( _this.searchList.searchEndPro != ""){
               for(var i = 0 ; i < _this.normalAddressList.length ; i++){
                 if(_this.searchList.searchEndPro == _this.normalAddressList[i].region){
                   _this.normalCityList = _this.normalAddressList[i].child;
                   for(var x = 0 ; x < _this.normalCityList.length ;x++){
                     _this.normalCityList[x].PinyinFirst = ConvertPinyin(_this.normalCityList[x].region).substring(0,1).toUpperCase();
                   }
                   _this.normalCityList.sort(_this.compare("PinyinFirst"));
                   _this.unique1(_this.normalCityList);
                   for(var x = 0; x < _this.normalCityList.length ; x++){
                     if(_this.searchList.searchEndCity == _this.normalCityList[x].region){
                        _this.normalAreaList = _this.normalCityList[x].child;
                       for(var z = 0 ; z< _this.normalAreaList.length ;z++){
                         _this.normalAreaList[z].PinyinFirst = ConvertPinyin(_this.normalAreaList[z].region).substring(0,1).toUpperCase();
                       }
                       _this.normalAreaList.sort(_this.compare("PinyinFirst"));
                       _this.unique1(_this.normalAreaList);
                       _this.$nextTick(function () {
                         var scrolltopGo = _this.tabShow == 0 ? localStorage.getItem("getPageScroll1") :  localStorage.getItem("getPageScroll3");
                         scrolltopGo = scrolltopGo == null ? 0 : scrolltopGo;
                         $("#selectareaUl").animate({scrollTop: scrolltopGo}, 0);
                       });
                     }
                   }
                 }
               }
               for(var i = 0 ; i < _this.normalAreaList.length ; i++){
                 _this.normalAreaList[i].checked = false;
                 if(_this.searchList.endAdd == _this.normalAreaList[i].region){
                   _this.normalAreaList[i].checked = true;
                 }
               }
             }
           }*/
        },
        hotAddressListno:function () {
          var _this = this;
          _this.screenAddressTrue = false;
          if(_this.addtype == 0){
            _this.searchList.searchStartPro = _this.searchStartPro;
            _this.searchList.searchStartCity = _this.searchStartCity;
          }else if(_this.addtype == 1){
            _this.searchList.searchEndPro = _this.searchEndPro;
            _this.searchList.searchEndCity = _this.searchEndCity;
          }
        },
        chooseProvince:function (item,index) {
          var _this = this;
          for(var i = 0; i < _this.normalAddressList.length; i++){
            _this.normalAddressList[i].checked = false;
          }
          _this.normalAddressList[index].checked = true;
          _this.normalCityList = item.child;
          for(var i = 0 ; i < _this.normalCityList.length ;i++){
            _this.normalCityList[i].PinyinFirst = ConvertPinyin(_this.normalCityList[i].region).substring(0,1).toUpperCase();
          }
          _this.normalCityList.sort(_this.compare("PinyinFirst"));
          _this.unique1(_this.normalCityList);
          for(var i =0 ; i < _this.normalCityList.length;i++){
            _this.normalCityList[i].checked = false;
          }
          if(_this.addtype == 0){
            _this.searchList.searchStartPro = item.region;
          }else if(_this.addtype == 1){
            _this.searchList.searchEndPro = item.region;
          }
        },
        chooseCity:function (item,index) {
          var _this = this;
          for(var i = 0; i < _this.normalCityList.length; i++){
            _this.normalCityList[i].checked = false;
          }
          _this.normalCityList[index].checked = true;
          _this.normalAreaList = item.child;
          for(var i = 0 ; i < _this.normalAreaList.length ;i++){
            _this.normalAreaList[i].PinyinFirst = ConvertPinyin(_this.normalAreaList[i].region).substring(0,1).toUpperCase();
          }
          _this.normalAreaList.sort(_this.compare("PinyinFirst"));
          _this.unique1(_this.normalAreaList);
          for(var i =0 ; i < _this.normalAreaList.length;i++){
            _this.normalAreaList[i].checked = false;
          }
          if(_this.addtype == 0){
            _this.searchList.searchStartCity = item.region;
          }else if(_this.addtype == 1){
            _this.searchList.searchEndCity = item.region;
          }
        },
        normalCityGoback:function () {
          var _this = this;
          if(_this.normalAreaList.length > 0){
            for(var i = 0; i < _this.normalCityList.length; i++){
              _this.normalCityList[i].checked = false;
            }
            _this.normalAreaList = [];
          }else if(_this.normalAreaList.length == 0){
            for(var i = 0; i < _this.normalAddressList.length; i++){
              _this.normalAddressList[i].checked = false;
            }
            _this.normalCityList = [];
            if(_this.addtype == 0){
              _this.searchList.searchStartPro = "";
            }else if(_this.addtype == 1){
              _this.searchList.searchEndPro = "";
            }
          }

        },
        hotAddressListChoose:function (item,type) {
          var _this = this;
          if(_this.addtype == 0){
            if(type == 0 || type == 1){
              _this.searchList.startAdd = item.region;
            }else if(type == 2){
              _this.searchList.startAdd = item;
            }

            if(type == 0){
              _this.searchList.searchStartPro = item.province;
            }
            _this.AddressStartlist = [];
            if(_this.searchList.searchStartPro != ""){
              _this.AddressStartlist.push(_this.searchList.searchStartPro);
            }
            if(_this.searchList.searchStartCity != ""){
              _this.AddressStartlist.push(_this.searchList.searchStartCity);
            }
            if(_this.searchList.startAdd != ""){
              _this.AddressStartlist.push(_this.searchList.startAdd);
            }
            _this.AddressStartlist = _this.uniq(_this.AddressStartlist);
          }else if(_this.addtype == 1){
            if(type == 0 || type == 1){
              _this.searchList.endAdd = item.region;
            }else if(type == 2){
              _this.searchList.endAdd = item;
            }
            if(type == 0){
              _this.searchList.searchEndPro = item.province;
            }
            _this.AddressEndlist = [];
            if(_this.searchList.searchEndPro != ""){
              _this.AddressEndlist.push(_this.searchList.searchEndPro);
            }
            if(_this.searchList.searchEndCity != ""){
              _this.AddressEndlist.push(_this.searchList.searchEndCity);
            }
            if(_this.searchList.endAdd != ""){
              _this.AddressEndlist.push(_this.searchList.endAdd);
            }
            _this.AddressEndlist = _this.uniq(_this.AddressEndlist);
          }
          for(var i =0 ; i < _this.hotAddressList.length;i++){
            _this.hotAddressList[i].checked = false;
          }
          for(var i =0 ; i < _this.normalCityList.length;i++){
            _this.normalCityList[i].checked = false;
          }
          for(var i =0 ; i < _this.normalAreaList.length;i++){
            _this.normalAreaList[i].checked = false;
          }
          _this.normalAreaList = [];
          _this.normalCityList = [];
          _this.searchStartPro = "";
          _this.searchEndCity = "";
          _this.searchStartCity = "";
          _this.searchEndCity = "";
          _this.searchList.searchStartPro = "";
          _this.searchList.searchEndPro = "";
          _this.searchList.searchStartCity = "";
          _this.searchList.searchEndCity = "";
          if(type == 0 || type == 1){
            item.checked = true;
          }
          _this.screenAddressTrue = false;
        },
        scrollAddress:function (index) {
          var _this = this;
          var scroll = 0;
          for(var i = 0 ; i <index;i++){
            scroll =  scroll + _this.PinyinFirstList[i].scroll[_this.PinyinFirstList[i].PinyinFirst];
          }
          var html = document.getElementsByTagName("html")[0].style.fontSize.replace("px","");
          $(".selectAddress ul").animate({scrollTop: scroll*1.2*html}, 100);
        },
      }
    }
</script>

<style scoped>
     #getOrderSet{
       position: absolute;
       top:1.3rem;
       bottom:0;
       height: auto;
       background: #f6f6f6;
       width:100%;
       overflow-y: scroll;
     }
      .chooseTap{
        width:92%;
        padding:0.4rem  4%;
        background: white;
        margin-top: 0.267rem;
        position: relative;
      }
     .chooseTap p{
       font-size:0.45rem ;
       color:#373737;
     }
     .chooseTap p span{
       font-size:0.375rem ;
       margin-left: 0.3rem;
       color:#999999;
     }
     .chooseTap ul li{
       float: left;
       border: 1px solid #999999;
       color:#999999;
       font-size: 0.4rem;
       text-align: center;
       line-height:1.12rem ;
       width:2.36rem;
       border-radius:0.13rem ;
       letter-spacing: 1px;
       margin:0.38rem 0.3rem 0 0.3rem ;
       box-sizing: content-box;
     }
     .chooseTap h1{
        font-size: 0.375rem;
       color:#373737;
       margin:0.24rem 0 0.1rem 0.2rem;
     }
     .addressList{
       width: 8.81rem;
       margin:0 auto 0.1rem auto;
     }
     .addressList h2 {
       font-size: 0.375rem;
       color:#999;
       float: left;
       line-height: 0.8533rem;
     }
     .addressList button{
       float: right;
       width: 1.75rem;
       box-sizing: content-box;
       border: 1px solid #999;
       background: transparent;
       color: #999;
       font-size: 0.4rem;
       border-radius: 0.13rem;
       line-height: 0.8533rem;
     }
     .addressList h2 span{
       font-size: 0.375rem;
     }
     .chooseTap ul .carlengthLi{
       float: left;
       border: 1px solid #999999;
       color:#999999;
       font-size: 0.375rem;
       text-align: center;
       line-height:0.85rem ;
       width:1.81rem;
       border-radius:0.13rem ;
       letter-spacing: 1px;
       margin:0.38rem 0.2rem 0 0.2rem ;
       box-sizing: content-box;
     }
  .choose{
    background: #1869A9!important;
    color:white!important;
    border-color: #1869A9!important;
  }
     .morenBox{
       position: absolute;
       right:0.4rem;
       top:50%;
       margin-top: -0.4rem;
       height: 0.8rem;
       border-radius: 0.4rem;
       width:1.4rem;
       background: #f1f1f1;
       border: 1px solid #e0e0e0;
     }
     .morenBoxTrue{
       background: #6AD56C!important;
     }
     .moren{
       float: left;
       height: 0.76rem;
       margin-left: -0.03125rem;
       border-radius: 0.4rem;
       width:0.76rem;
       background: white;
       border:1px solid #e0e0e0;
     }
     .morenTrue{
       float:right!important;
       margin-right: -0.0625rem;
       background: white!important;
       margin-left: 0!important;
     }
    #screenAddressBox{
       position: fixed;
       top:0;
       bottom: 0;
       left:0;
       right:0;
       height:auto;
       width:auto;
       background-color: rgba(0,0,0,0.3);
     }
     #screenAddressBody{
       position: absolute;
       bottom:0rem;
       width:98%;
       left:1%;
       border-top-left-radius:0.4rem ;
       border-top-right-radius:0.4rem ;
       min-height: 2rem;
       background: white;
     }
     #screenAddressBody img{
       position: absolute;
       width:0.3rem;
       top:0.4rem;
       right:0.4rem;
     }
     #screenAddressBody h6{
       position: absolute;
       font-size: 0.35rem;
       top:0.25rem;
       left:0.4rem;
       color:#999;
     }
    #screenAddressBody p{
       text-align: center;
       font-size: 0.43rem;
       color:#333;
       margin-top:0.15rem ;
     }
     #screenAddressBody p span{
       font-size: 0.43rem;
       color:#999;
     }
     .hotAddress,.checkedAddress,.selectAddress,.selectcity,.selectarea{
       width:9rem;
       margin: 0.3rem  auto 0.3334rem auto;
     }
     .hotAddress h1,.checkedAddress h1,.selectAddress h1,.selectcity h1,.selectarea h1{
       font-size: 0.3125rem;
       color:#999;
       margin-bottom: 0.15rem;
     }
     .hotAddress ul{
       width:100%;
       max-height: 7.5rem;
       overflow: scroll;
     }
     .selectAddress ul,.selectcity ul,.selectarea ul{
       width:100%;
       max-height: 7.5rem;
       overflow: scroll;
     }
     .checkedAddress ul{
       width:100%;
       max-height: 7.5rem;
       overflow: scroll;
       background-color: #FAFAFA;
     }
     .checkedAddress li{
       min-width:20%;
       margin-left:2.5%;
       float: left;
       font-size: 0.35rem;
       line-height: 1.2rem;
       text-align: center;
     }
     .hotAddress li{
       float: left;
       width:20%;
       margin: 0 2.5%;
       text-align: center;
       font-size: 0.35rem;
       line-height: 1.2rem;
       overflow: hidden;
       text-overflow:ellipsis;
       white-space: nowrap;
     }
     .shouzimu{
       font-size: 0.375rem;
       color:#999;
       display: block;
       float: left;
       margin-right:0.5rem;
       width:0.375rem;
       min-width: 0.375rem;
       height:1.2rem;
     }
     .selectAddress li,.selectcity li,.selectarea li{
       width:80%;
       /*margin: 0 auto;*/
       text-align: left;
       font-size: 0.375rem;
       line-height: 1.2rem;
       overflow: hidden;
       text-overflow:ellipsis;
       white-space: nowrap;
     }
     .selectAddress li h3,.selectcity li h3,.selectarea li h3{
       font-size:0.375rem ;
       color:#333;
       line-height:1.2rem ;
     }
     .scrollAZ{
       position: absolute;
       right:0.52rem;
       bottom:0.6rem;
     }
     .scrollAZ li{
       color:#999;
       font-size: 0.3125rem;
       width: 1rem;
       text-align: right;
     }
     .slide-fade-enter-active {
       transition: all .2s ease;
     }
     .slide-fade-leave-active {
       transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
     }
     .slide-fade-enter, .slide-fade-leave-to
       /* .slide-fade-leave-active for below version 2.1.8 */ {
       transform: translateY(0.13rem);
       opacity: 0;
     }
  .screenAddre{
    width:8.81rem;
    margin: 0.387rem auto 0 auto;
  }
  .startAddre{
    float: left;
    width:2.56rem;
    box-sizing: content-box;
    border: 1px solid #999;
    color:#999;
    font-size: 0.4rem;
    background-image: url("../../images/Triangle.png");
    background-position: 90% 50%;
    background-repeat: no-repeat;
    background-size: 0.375rem;
    border-radius: 0.13rem;
  }
  .addAddress{
    float: right;
    width:1.75rem;
    box-sizing: content-box;
    background: #1869A9;
    border: 1px solid #1869A9;
    color:white;
    font-size: 0.4rem;
    border-radius: 0.13rem;
    line-height:0.8533rem ;
  }
  .hengxian{
    width:0.8rem;
    height: 2px;
    background: #979797;
    float: left;
    margin:0.4rem ;
  }
  .addresscheck{
    color:#999;
    font-size: 0.4rem;
    line-height:0.8533rem ;
    margin-left: 0.28rem;
    width:2rem;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
</style>
