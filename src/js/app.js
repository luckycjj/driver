import bridge from './bridge';
import {bomb} from "./zujian";
var androidIos = {
  gobackFrom: function (that) {
    if(bomb.hasClass("app","appBox")){
      $("#errorwifeBox").remove();
      $("#common-blackBox").remove();
      $(".tanBox-bigBox").remove();
      var http =  location.href;
      if(http.indexOf("/authenticationS") != -1){
        var DRIVERSFETMESSAGE = localStorage.getItem("DRIVERSFETMESSAGE");
        if(DRIVERSFETMESSAGE != undefined){
          androidIos.first("信息尚未上传，需要保存吗？");
          $(".tanBox-close").unbind('click').click(function(){
            $(".tanBox-bigBox").remove();
            localStorage.removeItem("DRIVERSFETMESSAGE")
            androidIos.gogogogo();
          });
          $(".tanBox-yes").unbind('click').click(function(){
            $(".tanBox-bigBox").remove();
            androidIos.gogogogo();
          });
        }else{
          androidIos.gogogogo();
        }
      }else{
        androidIos.gogogogo();
      }
    }

  },
  gogogogo:function () {
    var addPageList = sessionStorage.getItem("addPageList");
    if (addPageList * 1 > 0) {
      var number = addPageList * 1 - 1;
      sessionStorage.setItem("addPageList", number);
      window.history.go(-1);
      setTimeout(function () {
        bomb.addClass("app","appBox");
      },500)
    } else {
      bomb.addClass("app","appBox");
      bridge.invoke('gobackfrom');
    }
  },
  fixed:function (number,length) {
      var len = 1;
     for(var i=0 ; i<length ; i++){
         len = len +"0";
      }
      var bignumber = number*len;
      if((bignumber.toString()).indexOf(".")!=-1){
        var list = (bignumber.toString()).split(".");
        var leng = 1;
        for(var x=0 ; x<list[1].length-1 ; x++){
          leng = leng +"0";
        }
         if(list[1]-5*leng>=0){
            bignumber = list[0]*1+1
         }else{
           bignumber = list[0]
         }
      }
      return  bignumber/len;
  },
  ajaxHttp: function () {
    // var http = 'http://10.10.10.156:8085';
    //var http = 'http://10.10.10.161:8085';
    var http = 'http://222.73.159.76:8085';
    return http;
  },
  addPageList: function () {
    var addPageList = window.sessionStorage.getItem("addPageList");
    var number = addPageList * 1 + 1;
    sessionStorage.setItem("addPageList", number);
  },
  firstblack: function (message) {
    $("#messageBombFirstBox").remove();
    $("body").append("<div id='messageBombFirstBox'><p id='messageBombFirst'>" + message + "</p></div>");
    $("#messageBombFirstBox").css({
      "width": "100%",
      "height": "100%",
      "position": "fixed",
      "top": "0",
      "left": "0",
      "background": "rgba(255,255,255,0)",
      "z-index": "99999"
    });
    $("#messageBombFirst").css({
      "position": "absolute",
      "z-index": "9999999",
      "background": "rgba(86,86,86,0.7)",
      "color": "white",
      "padding": "0.13rem 0.2rem",
      "border-radius": "0.1rem",
      "font-size": "0.375rem"
    });
    var leftF = document.getElementById('messageBombFirst').offsetWidth;
    var Left = (document.documentElement.clientWidth - leftF) / 2;
    $("#messageBombFirst").css({
      "margin-left": Left + "px",
      "bottom": " 1.2rem"
    });
    var time = 1;
    var setTime = setInterval(function () {
        if (time < 0) {
          clearInterval(setTime);
          $("#messageBombFirst").animate({
            "opacity": "0"
          }, 500, function () {
            $("#messageBombFirstBox").remove();
          });
        }
        time--
      },
      300)
  },
  first:function(message){
      $(".tanBox-bigBox").remove();
      $("body").append("<div class='tanBox-bigBox'>" +
        "<div class='tanBox-box'>" +
        "<p>温馨提示</p>"+
        "<div class='tanBox-class'>" +
        "<h3 style='width: 80%;margin-left: 10%;line-height: 0.6rem;padding: 0.3rem 0;'>" + message + "</h3>"+
        "<div class='clearBoth'></div>"+
        "</div>"+
        "<div class='tanBox-button'><button class='tanBox-close'>取消</button><div class='tanBox-shuxian'></div><button id='tanBox-yes' class='tanBox-yes tanBox-yesGo'>确定</button></div>"+
        "</div>"+
        "</div>");
      $(".tanBox-close").unbind('click').click(function(){
        $(".tanBox-bigBox").remove();
      });
  },
  second:function(message){
    $(".tanBox-bigBox").remove();
    $("body").append("<div class='tanBox-bigBox'>" +
      "<div class='tanBox-box'>" +
      "<p>温馨提示</p>"+
      "<div class='tanBox-class'>" +
      "<h3 style='width: 80%;margin-left: 10%;line-height: 0.6rem;padding: 0.3rem 0;'>" + message + "</h3>"+
      "<div class='clearBoth'></div>"+
      "</div>"+
      "<div class='tanBox-button'><button style='width:100%;color:#333;' class='tanBox-close'>确定</button></div>"+
      "</div>"+
      "</div>");
    $(".tanBox-close").unbind('click').click(function(){
      $(".tanBox-bigBox").remove();
    });
  },
  telCall:function (tel) {
    $(".tanBox-bigBox").remove();
    $("body").append("<div class='tanBox-bigBox'>" +
      "<div class='tanBox-box'>" +
      "<p>温馨提示</p>"+
      "<div class='tanBox-class'>" +
      "<h3 style='width: 80%;margin-left: 10%;line-height: 0.6rem;padding: 0.3rem 0;'>" + tel + "</h3>"+
      "<div class='clearBoth'></div>"+
      "</div>"+
      "<div class='tanBox-button'><button class='tanBox-close'>取消</button><div class='tanBox-shuxian'></div><button id='tanBox-yes' class='tanBox-yes tanBox-yesGo'>拨打</button></div>"+
      "</div>"+
      "</div>");
      $(".tanBox-close").unbind('click').click(function(){
        $(".tanBox-bigBox").remove();
      });
      $(".tanBox-yes").unbind('click').click(function(){
         window.location.href = "tel://" + tel;
      });
  },
  third:function (message) {
    $(".tanBox-bigBox").remove();
    $("body").append("<div class='tanBox-bigBox'>" +
      "<div class='tanBox-box'>" +
      "<p>温馨提示</p>"+
      "<div class='tanBox-class'>" +
      "<div style='width:30%;height:1rem;font-size: 0.4rem;color:#333;line-height: 1rem;text-align: right;float: left;margin-left: 10%;'>"+message+"：</div>"+
      "<div id='Z01' style='width:55%;height:1rem;font-size: 0.4rem;color:#999;line-height: 1rem;padding-left: 5%;float: left;'>请选择"+message+"</div>"+
      "<div class='clearBoth'></div>"+
      "</div>"+
      "<div class='tanBox-button'><button class='tanBox-close'>取消</button><div class='tanBox-shuxian'></div><button id='tanBox-yes' class='tanBox-yes tanBox-yesGo'>确定</button></div>"+
      "</div>"+
      "</div>");
    $(".tanBox-close").unbind('click').click(function(){
      $(".tanBox-bigBox").remove();
    });
  },
  loading: function (message) {
    $("#common-blackBox").remove();
    $("body").append("<div id='common-blackBox'>" +
      "<div id='common-black' style='line-height: 0.8rem;'>" +
      "<div class='common-imgbox'></div>" + message + "</div>" +
      "</div>");
  },
  bridge:function (that) {
    that.$nextTick(function() {
      that.go();
    });
  },
  jsonsort: function (obj) {
    var keys = [];
    for (var key in obj) {
      keys.push(key);
    }
    keys.sort();
    var message = "";
    for (var i = 0; i < keys.length; i++) {
      key = keys[i];
      message += key + obj[key];
    }
    return message;
  },
  encryption: function (message) {
    var iv = ""; //随机生成长度为32的16进制字符串。IV称为初始向量，不同的IV加密后的字符串是不同的，加密和解密需要相同的IV。
    var key = sessionStorage.getItem("key");
    var cryptkey = CryptoJS.enc.Latin1.parse(key);
    var ciphertext = aesEncrypt(message, cryptkey); //加密
    var decryptedMessage = aesDecrypt(ciphertext, cryptkey); //解密
    function aesEncrypt(message, key) {
      var ciphertext = CryptoJS.AES.encrypt(message, key, {
        iv: CryptoJS.enc.Latin1.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
      return ciphertext; //密码对象(Obejct类型，非WordArray类型)，Base64编码。
      //return ciphertext.toString();//密码对象的Base64字符串
    }

    function aesDecrypt(ciphertext, key) {
      var decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
        iv: CryptoJS.enc.Latin1.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
      return decrypted.toString(CryptoJS.enc.Utf8); //WordArray对象转utf8字符串
    }
    return ciphertext.toString()
  },
  errorwife: function () {
    $("#errorwifeBox").remove();
    $("body").append("<div id='errorwifeBox'>" +
      "<div id='errorImgbox'></div>" +
      "<p>网络错误，请检查网络</p>" +
      "<button>重试</button>" +
      "</div>");
    $("#errorwifeBox button").unbind("click").click(function () {
      $.ajax({
        type: "POST",
        url: androidIos.ajaxHttp() + "/settings/getTransType",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        timeout: 30000,
        success: function () {
          window.location.reload();
        },
        error: function () {
          androidIos.firstblack("当前状况下无网络，请检查网络!");
        }
      });
    })
  },
  GetQueryString: function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var s = window.location.href.indexOf("?");
    var r = window.location.href.substr(s + 1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  },
  CheckSocialCreditCode:function (Code) {
  var patrn = /^[0-9A-Z]+$/;
  //18位校验及大写校验
  if ((Code.length != 18) || (patrn.test(Code) == false)) {
    bomb.first("不是有效的统一社会信用编码！");
    return false;
  }
  else {
    var Ancode;//统一社会信用代码的每一个值
    var Ancodevalue;//统一社会信用代码每一个值的权重
    var total = 0;
    var weightedfactors = [1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28];//加权因子
    var str = '0123456789ABCDEFGHJKLMNPQRTUWXY';
    //不用I、O、S、V、Z
    for (var i = 0; i < Code.length - 1; i++) {
      Ancode = Code.substring(i, i + 1);
      Ancodevalue = str.indexOf(Ancode);
      total = total + Ancodevalue * weightedfactors[i];
      //权重与加权因子相乘之和
    }
    var logiccheckcode = 31 - total % 31;
    if (logiccheckcode == 31) {
      logiccheckcode = 0;
    }
    var Str = "0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,J,K,L,M,N,P,Q,R,T,U,W,X,Y";
    var Array_Str = Str.split(',');
    logiccheckcode = Array_Str[logiccheckcode];


    var checkcode = Code.substring(17, 18);
    if (logiccheckcode != checkcode) {
      bomb.first("不是有效的统一社会信用编码！");
      return false;
    }
    return true;
  }
},
  telCheck:function (tel) {
    var reg = /^1([3|5|8][0-9]|4[5|7|9]|66|7[0|1|3|5|6|7|8]|9[8|9])[0-9]{8}$/;
    if(!reg.test(tel)){
      return false;
    }else{
       return true;
    }
  },
  idCardCheck:function (id) {
    // 1 "验证通过!", 0 //校验不通过
    var format = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/;
    //号码规则校验
    if(!format.test(id)){
      return false
    }
    //区位码校验
    //出生年月日校验   前正则限制起始年份为1900;
    var year = id.substr(6,4),//身份证年
      month = id.substr(10,2),//身份证月
      date = id.substr(12,2),//身份证日
      time = Date.parse(month+'-'+date+'-'+year),//身份证日期时间戳date
      now_time = Date.parse(new Date()),//当前时间戳
      dates = (new Date(year,month,0)).getDate();//身份证当月天数
    if(time>now_time||date>dates){
      return false
    }
    //校验码判断
    var c = new Array(7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2);   //系数
    var b = new Array('1','0','X','9','8','7','6','5','4','3','2');  //校验码对照表
    var id_array = id.split("");
    var sum = 0;
    for(var k=0;k<17;k++){
      sum+=parseInt(id_array[k])*parseInt(c[k]);
    }
    if(id_array[17].toUpperCase() != b[sum%11].toUpperCase()){
      return false
    }
    return true
  },
  chooseSite:function (type) {
    // 0 拆段 1 拆量 2全部
     var body = document.getElementsByTagName("body")[0];
     var site = document.getElementById("siteLook");
     if(site != null){
       body.removeChild(site);
     }else{
       var listDom=document.createElement("ul");
       listDom.id = "siteLook";
       var listBox = "";
       if(type == 0){
         listBox = "<li class='sitechoose' id='sitechoosesite'>拆段</li>";
       }else if(type == 1){
         listBox = "<li class='sitechoose' id='sitedismantling'>拆量</li>";
       }else if(type == 2){
         for(var i = 0 ; i < 2 ; i ++ ){
           var id = i ==0 ? "sitechoosesite" : "sitedismantling";
           var name = i ==0 ? "拆段" : "拆量";
           var list = "<li class='sitechoose' id='" + id + "'>" + name + "</li>";
           listBox += list;
         }
       }
       listDom.innerHTML =  listBox ;
       body.appendChild(listDom);
       var style = listDom.style;
       var styleClass = document.getElementsByClassName("sitechoose")[0].style;
       var styleClass2 = "";
       if(document.getElementsByClassName("sitechoose").length > 1){
         styleClass2 = document.getElementsByClassName("sitechoose")[1].style;
       }
       style.position = "fixed";
       style.zIndex = "12";
       style.width = "2rem";
       style.background = "black";
       style.padding = "0 0.3rem";
       style.top = "0.85rem";
       style.right = "0.3rem";
       style.borderRadius = "0.1rem";
       styleClass.color = "white";
       styleClass.textAlign = "center";
       styleClass.marginTop = "0.2rem";
       styleClass.paddingBottom = "0.2rem";
       styleClass.fontSize = "0.3125rem";
       if(document.getElementsByClassName("sitechoose").length > 1){
         styleClass.borderBottom = "1px solid white";
         styleClass2.color = "white";
         styleClass2.textAlign = "center";
         styleClass2.marginTop = "0.2rem";
         styleClass2.paddingBottom = "0.2rem";
         styleClass2.fontSize = "0.3125rem";
       }
       document.getElementsByTagName("body")[0].onclick = function (e) {
         var id = e.target.id;
         if( id != "siteLook" && id != "siteCar" ){
           var body = document.getElementsByTagName("body")[0];
           var listDom=document.getElementById("siteLook");
           if(listDom != null){
             body.removeChild(listDom);
           }
         }
       }
     }

  },
  numAdd:function(num1, num2) {
    //加法精度
    var baseNum, baseNum1, baseNum2;
    var precision;// 精度
    try {
      baseNum1 = num1.toString().split(".")[1].length;
    } catch (e) {
      baseNum1 = 0;
    }
    try {
      baseNum2 = num2.toString().split(".")[1].length;
    } catch (e) {
      baseNum2 = 0;
    }
    baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
    precision = (baseNum1 >= baseNum2) ? baseNum1 : baseNum2;
    return ((num1 * baseNum + num2 * baseNum) / baseNum).toFixed(precision);
  },
  numSub:function (num1, num2) {
    //减法精度
    var baseNum, baseNum1, baseNum2;
    var precision;// 精度
    try {
      baseNum1 = num1.toString().split(".")[1].length;
    } catch (e) {
      baseNum1 = 0;
    }
    try {
      baseNum2 = num2.toString().split(".")[1].length;
    } catch (e) {
      baseNum2 = 0;
    }
    baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
    precision = (baseNum1 >= baseNum2) ? baseNum1 : baseNum2;
    return ((num1 * baseNum - num2 * baseNum) / baseNum).toFixed(precision);
  },
  numMulti:function(num1, num2) {
    //乘法精度
    var baseNum = 0;
    try {
      baseNum += num1.toString().split(".")[1].length;
    } catch (e) {
    }
    try {
      baseNum += num2.toString().split(".")[1].length;
    } catch (e) {
    }
    return Number(num1.toString().replace(".", "")) * Number(num2.toString().replace(".", "")) / Math.pow(10, baseNum);
  },
  setcookie:function (c_name,value,time) {
    var date = new Date();
    localStorage.setItem(c_name,JSON.stringify({
      user:value,
      expiryDate: date.getTime() + time*24*60*60*1000
    }))
  },
  getcookie:function (c_name) {
    var name = localStorage.getItem(c_name);
    var date = new Date();
    if(name == undefined){
      return "";
    }else{
      if(date.getTime() > JSON.parse(name).expiryDate){
        localStorage.removeItem(c_name);
        return "";
      }else{
        return JSON.parse(name).user;
      }
    }
  },
  delCookie:function (c_name){
    localStorage.removeItem(c_name);
  },
  setcookie1:function (c_name,value,time) {
    var exdate=new Date();
    exdate = new Date(exdate.getTime() + time*24*60*60*1000);
    document.cookie =  c_name + "="  + escape(value)+ ( (time == null) ?  ""  : ";expires=" + exdate.toGMTString());
  },
  getcookie1:function (c_name) {
    if (document.cookie.length>0){
      var c_start=document.cookie.indexOf(c_name + "=")
      if (c_start != -1 ) {
        c_start=c_start + c_name.length+1
        var c_end=document.cookie.indexOf(";",c_start)
        if (c_end==-1){
          c_end=document.cookie.length
        }
        return unescape(document.cookie.substring(c_start,c_end))
      }else{
        return ""
      }
    }
    return ""
  },
  delCookie1:function (name){
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=androidIos.getcookie(name);
    if(cval!=null){
      document.cookie= name + "="+cval+";expires="+exp.toGMTString();
    }
  },
  getbaidunumber:function () {
    var baidunumber = "";
    var cookie = androidIos.getcookie("BAIDUTOKEN");
    if(cookie == ""){
      $.ajax({
        type: "POST",
        url: androidIos.ajaxHttp()+"/settings/getBaiduToken",
        dataType: "json",
        timeout: 30000,
        async:false,
        success: function (getBaiduToken) {
          if(getBaiduToken.success=="1"){
            baidunumber = getBaiduToken.paramValue;
            androidIos.setcookie("BAIDUTOKEN",baidunumber,29);
          }else{
            androidIos.second(getBaiduToken.message)
          }
        },
        complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
          if(status=='timeout'){//超时,status还有success,error等值的情况
            androidIos.second("网络请求超时");
          }else if(status=='error'){
            androidIos.errorwife();
          }
        }
      });
    }else{
      baidunumber = cookie;
    }
    return baidunumber;
  },
  lineCanvas:function (obj) {
    this.linewidth = 1;
    this.color = "#000000";
    this.background = "#ffffff";
    for (var i in obj) {
      this[i] = obj[i];
    };
    this.canvas = document.createElement("canvas");
    this.that.canvas =  this.canvas;
    this.el.appendChild(this.canvas);
    this.cxt = this.canvas.getContext("2d");
    this.canvas.width = this.el.clientWidth;
    this.canvas.height = this.el.clientHeight;
    this.cxt.fillStyle = this.background;
    this.cxt.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.cxt.strokeStyle = this.color;
    this.cxt.lineWidth = this.linewidth;
    this.cxt.lineCap = "round";
    this.that.cxt = this.cxt;
    //开始绘制
    this.canvas.addEventListener("touchstart", function(e) {
      this.cxt.beginPath();
      var height1 = document.getElementById("track").style.top.replace("rem","") * document.getElementsByTagName("html")[0].style.fontSize.replace("px","");
      this.cxt.moveTo(e.changedTouches[0].pageX, e.changedTouches[0].pageY-height1);
    }.bind(this), false);
    //绘制中
    this.canvas.addEventListener("touchmove", function(e) {
      var height1 = document.getElementById("track").style.top.replace("rem","")  * document.getElementsByTagName("html")[0].style.fontSize.replace("px","");
      this.cxt.lineTo(e.changedTouches[0].pageX, e.changedTouches[0].pageY-height1);
      this.cxt.stroke();
    }.bind(this), false);
    //结束绘制
    this.canvas.addEventListener("touchend", function() {
      this.cxt.closePath();
    }.bind(this), false);
   /* //清除画布
    this.clearEl.addEventListener("click", function() {
      this.cxt.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }.bind(this), false);
    //保存图片，直接转base64
    this.saveEl.addEventListener("click", function() {
      var imgBase64 = this.canvas.toDataURL();
      console.log(imgBase64);
    }.bind(this), false);*/
  },
  checkText:function (text) {
    return text.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\,\，\.\。\;\!\[\]\【\】\-]/g,'')
  },
  isIphoneX:function(){
    return /iphone/gi.test(navigator.userAgent) && (screen.height == 812 && screen.width == 375)
  },
  judgeIphoneX:function (id,type) {
    var html = document.getElementsByTagName("html")[0].style.fontSize.replace("px","");
    var paddingBottom = 0 + "px";
    var paddingTop = 0 + "px";
      try{
        paddingBottom = api.safeArea.bottom + "px";
        paddingTop = api.safeArea.top + "px";
      }
      catch (e){
        paddingBottom = 0 + "px";
        paddingTop =10 + "px";
      }
      var docuId = document.getElementById(id);
      if(docuId == null){
        for(var i = 0 ; i < document.getElementsByClassName(id).length;i++){
          if(type == 0){
            document.getElementsByClassName(id)[i].style.paddingTop = paddingTop.replace("px","")/html + "rem";
          }else if(type == 1){
            document.getElementsByClassName(id)[i].style.paddingBottom = paddingBottom.replace("px","")/html + "rem";
          }else if(type == 2){
            document.getElementsByClassName(id)[i].style.top =  document.getElementsByClassName(id)[i].style.top.replace("rem","")*1 + paddingTop.replace("px","")/html + "rem";
          }
        }
      }else{
        if(type == 0){
          document.getElementById(id).style.paddingTop = paddingTop.replace("px","")/html + "rem";
        }else if(type == 1){
          document.getElementById(id).style.paddingBottom = paddingBottom.replace("px","")/html + "rem";
        }else if(type == 2){
          document.getElementById(id).style.top =  document.getElementById(id).style.top.replace("rem","")*1 + paddingTop.replace("px","")/html + "rem";
        }else if(type == 4){
          document.getElementById(id).style.height =  paddingTop.replace("px","")/html + "rem";
        }else if(type == 5){
          document.getElementById(id).style.height =  document.getElementById(id).style.height.replace("rem","")*1 +  paddingTop.replace("px","")/html + "rem";
        }else if(type == 6){
          document.getElementById(id).style.bottom =  document.getElementById(id).style.bottom.replace("rem","")*1 + paddingBottom.replace("px","")/html + "rem";
        }
      }

  },
  imgLoad:function (img,that) {
    try{
      api.download({
        url: img,
        report: true,
        cache: true,
        allowResume: true
      }, function(ret, err) {
        if(ret.state == 1){
          var realPath = ret.savePath;
          if( localStorage.getItem("PEOPLEPHOTO") == null){
             localStorage.setItem("PEOPLEPHOTO",realPath);
          }else{
            localStorage.setItem("PEOPLEPHOTOS",realPath);
            var imgname = localStorage.getItem("PEOPLEPHOTO");
            if(imgname != realPath){
              that.message.photo =  img;
              localStorage.removeItem("PEOPLEPHOTO");
              if(img != ""){
                androidIos.imgLoad(img);
              }
            }
          }
        }
      })
    }
    catch(e){
      localStorage.setItem("PEOPLEPHOTO",img);
    }
  },
  jianting:function (userCode) {
    try{
      var ajpush = api.require('ajpush');
      var param = {alias:userCode,tags:['tag1','tag2']};
      ajpush.bindAliasAndTags(param,function(ret) {
        var statusCode = ret.statusCode;
      });
      ajpush.init(function(ret) {
        if (ret && ret.status) {
          ajpush.setListener(function(ret) {
            console.log(ret)
          });
        }
      });
    }
    catch(e){
      console.log("暂不支持推送");
    }
  },
};
export {
  androidIos
}
