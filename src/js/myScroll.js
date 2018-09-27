
window.LArea = (function() {
    var idName="";
    var bigToken =   "";
    var MobileArea = function() {
        this.gearArea;
        this.data;
        this.index = 0;
        this.value = [0, 0, 0];
    }
    MobileArea.prototype = {
        init: function(params) {
            this.params = params;
            this.trigger = document.querySelector(params.trigger);
            if(params.valueTo){
              this.valueTo=document.querySelector(params.valueTo);
            }
            this.keys = params.keys;
            this.type = params.type||1;
            switch (this.type) {
                case 1:
                case 2:
                    break;
                default:
                    throw new Error('错误提示: 没有这种数据源类型');
                    break;
            }
          this.addPointer = function (name) {

          }
            this.bindEvent();
        },
        getData: function(callback) {

            var _self = this;
            if (typeof _self.params.data == "object") {
                _self.data = _self.params.data;
                callback();
            } else {
                var xhr = new XMLHttpRequest();
                xhr.open('get', _self.params.data);
                xhr.onload = function(e) {
                    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 0) {
                        var responseData = JSON.parse(xhr.responseText);
                        _self.data = responseData.data;
                        if (callback) {
                            callback()
                        };
                    }
                }
                xhr.send();
            }
        },
        bindEvent: function() {

            var _self = this;
            //呼出插件
            function popupArea(e) {
                _self.gearArea = document.createElement("div");
                _self.gearArea.className = "gearArea";
                var idNameS = _self.params.trigger;
                bigToken =  window.sessionStorage.getItem("token");
                if(e.target.id.indexOf("X")!=-1){
                        _self.gearArea.innerHTML = '<div class="area_ctrl slideInUp">' +
                        '<div class="area_btn_box">' +
                        '<div class="area_btn larea_cancel">取消</div>' +
                        '<div class="area_btn larea_finish">确定</div>' +
                        '</div>' +
                        '<div class="area_roll_mask">' +
                        '<div class="area_roll">' +
                        '<div>' +
                        '<div class="gear area_province" data-areatype="area_province"></div>' +
                        '<div class="area_grid">' +
                        '</div>' +
                        '</div>' +
                        '<div>' +
                        '<div class="gear area_city" data-areatype="area_city"></div>' +
                        '<div class="area_grid">' +
                        '</div>' +
                        '</div>' +
                        '<div>' +
                        '<div class="gear area_county" data-areatype="area_county"></div>' +
                        '<div class="area_grid">' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>';
                        document.body.appendChild(_self.gearArea);
                        areaCtrlInit();
                        var larea_cancel = _self.gearArea.querySelector(".larea_cancel");
                        larea_cancel.addEventListener('touchstart', function(e) {
                            _self.close(e);
                        });
                        var larea_finish = _self.gearArea.querySelector(".larea_finish");
                        larea_finish.addEventListener('touchstart', function(e) {
                            _self.finish(e);
                        });
                        var area_province = _self.gearArea.querySelector(".area_province");
                        var area_city = _self.gearArea.querySelector(".area_city");
                        var area_county = _self.gearArea.querySelector(".area_county");
                        area_province.addEventListener('touchstart', gearTouchStart);
                        area_city.addEventListener('touchstart', gearTouchStart);
                        area_county.addEventListener('touchstart', gearTouchStart);
                        area_province.addEventListener('touchmove', gearTouchMove);
                        area_city.addEventListener('touchmove', gearTouchMove);
                        area_county.addEventListener('touchmove', gearTouchMove);
                        area_province.addEventListener('touchend', gearTouchEnd);
                        area_city.addEventListener('touchend', gearTouchEnd);
                        area_county.addEventListener('touchend', gearTouchEnd);

                }else if((e.target.id.indexOf("S")!=-1)){
                    _self.gearArea.innerHTML = '<div class="area_ctrl slideInUp">' +
                        '<div class="area_btn_box">' +
                        '<div class="area_btn larea_cancel">取消</div>' +
                        '<div class="area_btn larea_finish area_btnS">确定</div>' +
                        '</div>' +
                        '<div><p style="font-size: 0.375rem;float: left;width:50%;text-align: center;line-height: 1rem;color:#333;">车型</p><p style="color:#333;font-size: 0.375rem;float: left;width:50%;text-align: center;line-height: 1rem;">车长</p></p></div>'+
                        '<div class="area_roll_mask">' +
                        '<div class="area_roll">' +
                        '<div>' +
                        '<div class="gear area_province" data-areatype="area_province"></div>' +
                        '<div class="area_grid">' +
                        '</div>' +
                        '</div>' +
                        '<div>' +
                        '<div class="gear area_city" data-areatype="area_city"></div>' +
                        '<div class="area_grid">' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>';
                    document.body.appendChild(_self.gearArea);
                    areaCtrlInit();
                    var larea_cancel = _self.gearArea.querySelector(".larea_cancel");
                    larea_cancel.addEventListener('touchstart', function(e) {
                        _self.close(e);
                    });
                    var larea_finish = _self.gearArea.querySelector(".larea_finish");
                    larea_finish.addEventListener('touchstart', function(e) {
                        _self.finish(e);
                    });
                    var area_province = _self.gearArea.querySelector(".area_province");
                    var area_city = _self.gearArea.querySelector(".area_city");
                    area_province.addEventListener('touchstart', gearTouchStart);
                    area_city.addEventListener('touchstart', gearTouchStart);
                    area_province.addEventListener('touchmove', gearTouchMove);
                    area_city.addEventListener('touchmove', gearTouchMove);
                    area_province.addEventListener('touchend', gearTouchEnd);
                    area_city.addEventListener('touchend', gearTouchEnd);
                }else if((e.target.id.indexOf("Z")!=-1)){
                    _self.gearArea.innerHTML = '<div class="area_ctrl slideInUp">' +
                        '<div class="area_btn_box">' +
                        '<div class="area_btn larea_cancel">取消</div>' +
                        '<div class="area_btn larea_finish">确定</div>' +
                        '</div>' +
                        '<div class="area_roll_mask">' +
                        '<div class="area_roll">' +
                        '<div>' +
                        '<div class="gear area_province" data-areatype="area_province"></div>' +
                        '<div class="area_grid">' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>';
                    document.body.appendChild(_self.gearArea);
                    areaCtrlInit();
                    var larea_cancel = _self.gearArea.querySelector(".larea_cancel");
                    larea_cancel.addEventListener('touchstart', function(e) {
                        _self.close(e);
                    });
                    var larea_finish = _self.gearArea.querySelector(".larea_finish");
                    larea_finish.addEventListener('touchstart', function(e) {
                        _self.finish(e);
                    });
                    var area_province = _self.gearArea.querySelector(".area_province");
                    area_province.addEventListener('touchstart', gearTouchStart);
                    area_province.addEventListener('touchmove', gearTouchMove);
                    area_province.addEventListener('touchend', gearTouchEnd);
                }

            }
            //初始化插件默认值
            function areaCtrlInit() {
                idName = _self.params.trigger;
                if(idName.indexOf("X")!=-1){
                    _self.gearArea.querySelector(".area_province").setAttribute("val", _self.value[0]);
                    _self.gearArea.querySelector(".area_city").setAttribute("val", _self.value[1]);
                    _self.gearArea.querySelector(".area_county").setAttribute("val", _self.value[2]);
                    //品名调ajax
                    switch (_self.type) {
                        case 1:
                            _self.setGearTooth(_self.data);
                            break;
                        case 2:
                            _self.setGearTooth(_self.data[0]);
                            break;
                    }
                }else if(idName.indexOf("S")!=-1){
                    _self.gearArea.querySelector(".area_province").setAttribute("val", _self.value[0]);
                    _self.gearArea.querySelector(".area_city").setAttribute("val", _self.value[1]);
                    switch (_self.type) {
                        case 1:
                            _self.setGearTooth(_self.data);
                            break;
                        case 2:
                            _self.setGearTooth(_self.data[0]);
                            break;
                    }
                }else if(idName.indexOf("Z")!=-1){
                    _self.gearArea.querySelector(".area_province").setAttribute("val", _self.value[0]);
                    switch (_self.type) {
                        case 1:
                            _self.setGearTooth(_self.data);
                            break;
                        case 2:
                            _self.setGearTooth(_self.data[0]);
                            break;
                    }
                }else if(idName.indexOf("A")!=-1){
                    _self.gearArea.querySelector(".area_province").setAttribute("val", _self.value[0]);
                    switch (_self.type) {
                        case 1:
                            _self.setGearTooth(_self.data);
                            break;
                        case 2:
                            _self.setGearTooth(_self.data[0]);
                            break;
                    }
                }
            }
            //触摸开始
            function gearTouchStart(e) {

                e.preventDefault();
                var target = e.target;
                while (true) {
                    if (!target.classList.contains("gear")) {
                        target = target.parentElement;
                    } else {
                        break
                    }
                }
                clearInterval(target["int_" + target.id]);
                target["old_" + target.id] = e.targetTouches[0].screenY;
                target["o_t_" + target.id] = (new Date()).getTime();
                var top = target.getAttribute('top');
                if (top) {
                    target["o_d_" + target.id] = parseFloat(top.replace(/rem/g, ""));
                } else {
                    target["o_d_" + target.id] = 0;
                }
                target.style.webkitTransitionDuration = target.style.transitionDuration = '0ms';
            }
            //手指移动
            function gearTouchMove(e) {

                e.preventDefault();
                var target = e.target;
                while (true) {
                    if (!target.classList.contains("gear")) {
                        target = target.parentElement;
                    } else {
                        break
                    }
                }
                target["new_" + target.id] = e.targetTouches[0].screenY;
                target["n_t_" + target.id] = (new Date()).getTime();
                var f = (target["new_" + target.id] - target["old_" + target.id]) * 30 / window.innerHeight;
                target["pos_" + target.id] = target["o_d_" + target.id] + f;
                target.style["-webkit-transform"] = 'translate3d(0,' + target["pos_" + target.id] + 'rem,0)';
                target.setAttribute('top', target["pos_" + target.id] + 'rem');
                if(e.targetTouches[0].screenY<1){
                    gearTouchEnd(e);
                };
            }
            //离开屏幕
            function gearTouchEnd(e) {

                e.preventDefault();
                var target = e.target;
                while (true) {
                    if (!target.classList.contains("gear")) {
                        target = target.parentElement;
                    } else {
                        break;
                    }
                }
                var flag = (target["new_" + target.id] - target["old_" + target.id]) / (target["n_t_" + target.id] - target["o_t_" + target.id]);
                if(isNaN(Math.abs(flag))){
                     target["spd_" + target.id] =0;
                     if (!target["pos_" + target.id]) {
                        target["pos_" + target.id] = 0;
                    }
                    rollGear(target);
                }else{
                   if (Math.abs(flag) <= 0.2) {
                        target["spd_" + target.id] = (flag < 0 ? -0.08 : 0.08);
                    } else {
                        if (Math.abs(flag) <= 0.5) {
                            target["spd_" + target.id] = (flag < 0 ? -0.16 : 0.16);
                        } else {
                            target["spd_" + target.id] = flag / 2;
                        }
                    }
                    if (!target["pos_" + target.id]) {
                        target["pos_" + target.id] = 0;
                    }
                    rollGear(target);
                }

            }
            //缓动效果
            function rollGear(target) {
                var d = 0;
                var stopGear = false;
                function setDuration() {
                    target.style.webkitTransitionDuration = target.style.transitionDuration = '200ms';
                    stopGear = true;
                }
                clearInterval(target["int_" + target.id]);
                target["int_" + target.id] = setInterval(function() {
                    var pos = 0;
                    var pos = target["pos_" + target.id];
                    var speed = target["spd_" + target.id] * Math.exp(-0.03 * d);
                    pos += speed;
                    if (Math.abs(speed) > 0.1) {} else {
                        var b = Math.round(pos / 1) * 1;
                        pos = b;
                        setDuration();
                    }
                    if (pos > 0) {
                        pos = 0;
                        setDuration();
                    }
                    var minTop = -(target.dataset.len - 1) * 1;
                    if (pos < minTop) {
                        pos = minTop;
                        setDuration();
                    }
                    if (stopGear) {
                        var gearVal = Math.abs(pos) / 1;
                        setGear(target, gearVal);
                        clearInterval(target["int_" + target.id]);
                    }
                    target["pos_" + target.id] = pos;
                    target.style["-webkit-transform"] = 'translate3d(0,' + pos + 'rem,0)';
                    target.setAttribute('top', pos + 'rem');
                    d++;
                }, 30);
            }
            //控制插件滚动后停留的值
            function setGear(target, val) {
                val = Math.round(val);
                target.setAttribute("val", val);
                switch (_self.type) {
                    case 1:
                         _self.setGearTooth(_self.data);
                        break;
                    case 2:
                     switch(target.dataset['areatype']){
                         case 'area_province':
                         _self.setGearTooth(_self.data[0]);
                             break;
                         case 'area_city':
                             var ref = target.childNodes[val].getAttribute('ref');
                             var childData=[];
                             var nextData= _self.data[2];
                             for (var i in nextData) {
                                 if(i==ref){
                                    childData = nextData[i];
                                    break;
                                 }
                             };
                        _self.index=2;
                        _self.setGearTooth(childData);
                             break;
                     }
                }

            }
            _self.getData(function() {
                _self.trigger.addEventListener('click', popupArea);
            });
        },
        //重置节点个数
        setGearTooth: function(data) {
            var _self = this;
            var item = data || [];
            var l = item.length;
            if(idName.indexOf("X")!=-1){
                var gearChild = _self.gearArea.querySelectorAll(".gear");
                var gearVal = gearChild[_self.index].getAttribute('val');
                var maxVal = l - 1;
                if (gearVal > maxVal) {
                    gearVal = maxVal;
                }
                gearChild[_self.index].setAttribute('data-len', l);
                if (l > 0) {
                    var id = item[gearVal][this.keys['id']];
                    var childData;
                    switch (_self.type) {
                        case 1:
                        childData = item[gearVal].child
                            break;
                        case 2:
                         var nextData= _self.data[_self.index+1]
                         for (var i in nextData) {
                             if(i==id){
                                childData = nextData[i];
                                break;
                             }
                         };
                            break;
                    }
                    var itemStr = "";
                    for (var i = 0; i < l; i++) {
                            itemStr += "<div class='tooth'  ref='" + item[i].code + "'>" + item[i].region + "</div>";
                    }
                    gearChild[_self.index].innerHTML = itemStr;
                    gearChild[_self.index].style["-webkit-transform"] = 'translate3d(0,' + (-gearVal * 1) + 'rem,0)';
                    gearChild[_self.index].setAttribute('top', -gearVal+ 'rem');
                    gearChild[_self.index].setAttribute('val', gearVal);
                    _self.index++;
                    if (_self.index > 2) {
                        _self.index = 0;
                        return;
                    }
                    _self.setGearTooth(childData);
                } else {
                    gearChild[_self.index].innerHTML = "<div class='tooth'></div>";
                    gearChild[_self.index].setAttribute('val', 0);
                    if(_self.index==1){
                        gearChild[2].innerHTML = "<div class='tooth'></div>";
                        gearChild[2].setAttribute('val', 0);
                    }
                    _self.index = 0;
                }
            }else if(idName.indexOf("S")!=-1){
                var gearChild = _self.gearArea.querySelectorAll(".gear");
                var gearVal = gearChild[_self.index].getAttribute('val');
                var maxVal = l - 1;
                if (gearVal > maxVal) {
                    gearVal = maxVal;
                }
                gearChild[_self.index].setAttribute('data-len', l);
                if (l > 0) {
                    var id = item[gearVal][this.keys['id']];
                    var childData;
                    switch (_self.type) {
                        case 1:
                        childData = item[gearVal].child
                            break;
                        case 2:
                         var nextData= _self.data[_self.index+1]
                         for (var i in nextData) {
                             if(i==id){
                                childData = nextData[i];
                                break;
                             }
                         };
                            break;
                    }
                    var itemStr = "";
                    for (var i = 0; i < l; i++) {
                      itemStr += "<div class='tooth'  ref='" + item[i].code + "'>" + item[i].region + "</div>";
                    }
                    gearChild[_self.index].innerHTML = itemStr;
                    gearChild[_self.index].style["-webkit-transform"] = 'translate3d(0,' + (-gearVal * 1) + 'rem,0)';
                    gearChild[_self.index].setAttribute('top', -gearVal+ 'rem');
                    gearChild[_self.index].setAttribute('val', gearVal);
                    _self.index++;
                    if (_self.index > /*2*/1) {
                        _self.index = 0;
                        return;
                    }
                    _self.setGearTooth(childData);
                } else {
                    gearChild[_self.index].innerHTML = "<div class='tooth'></div>";
                    gearChild[_self.index].setAttribute('val', 0);
                    if(_self.index==/*1*/0){
                        gearChild[/*2*/1].innerHTML = "<div class='tooth'></div>";
                        gearChild[/*2*/1].setAttribute('val', 0);
                    }
                    _self.index = 0;
                }
            }else if(idName.indexOf("Z")!=-1){
                var gearChild = _self.gearArea.querySelectorAll(".gear");
                var gearVal = gearChild[_self.index].getAttribute('val');
                var maxVal = l - 1;
                if (gearVal > maxVal) {
                    gearVal = maxVal;
                }
                gearChild[_self.index].setAttribute('data-len', l);
                if (l > 0) {
                    var id = item[gearVal][this.keys['id']];
                    var childData;
                    switch (_self.type) {
                        case 1:
                        childData = item[gearVal].child
                            break;
                        case 2:
                         var nextData= _self.data[_self.index+1]
                         for (var i in nextData) {
                             if(i==id){
                                childData = nextData[i];
                                break;
                             }
                         };
                            break;t
                    }
                    var itemStr = "";
                    for (var i = 0; i < l; i++) {
                      itemStr += "<div class='tooth'  ref='" + item[i].code + "'>" + item[i].region + "</div>";
                    }
                    gearChild[_self.index].innerHTML = itemStr;
                    gearChild[_self.index].style["-webkit-transform"] = 'translate3d(0,' + (-gearVal * 1) + 'rem,0)';
                    gearChild[_self.index].setAttribute('top', -gearVal+ 'rem');
                    gearChild[_self.index].setAttribute('val', gearVal);
                    _self.index++;
                    if (_self.index > 0) {
                        _self.index = 0;
                        return;
                    }
                    _self.setGearTooth(childData);
                } else {
                    gearChild[_self.index].innerHTML = "<div class='tooth'></div>";
                    gearChild[_self.index].setAttribute('val', 0);
                    if(_self.index==/*1*/0){
                        gearChild[0].innerHTML = "<div class='tooth'></div>";
                        gearChild[0].setAttribute('val', 0);
                    }
                    _self.index = 0;
                }
            }

        },
        finish: function(e) {
            var _self = this;
            if(idName.indexOf("X")!=-1){
                var area_province = _self.gearArea.querySelector(".area_province");
                var area_city = _self.gearArea.querySelector(".area_city");
                var area_county = _self.gearArea.querySelector(".area_county");
                var provinceVal = parseInt(area_province.getAttribute("val"));
                var provinceText = area_province.childNodes[provinceVal].textContent;
                var provinceCode = area_province.childNodes[provinceVal].getAttribute('ref');
                var cityVal = parseInt(area_city.getAttribute("val"));
                var cityText = area_city.childNodes[cityVal].textContent;
                var cityCode = area_city.childNodes[cityVal].getAttribute('ref');
                var countyVal = parseInt(area_county.getAttribute("val"));
                var countyText = area_county.childNodes[countyVal].textContent;
                var countyCode = area_county.childNodes[countyVal].getAttribute('ref');
                _self.trigger.value = provinceText + ((cityText)?(' ' + cityText):(''))+ ((countyText)?(' ' + countyText):(''));
                _self.value = [provinceVal, cityVal, countyVal];
                var data = {
                  firstVal:provinceText,
                  firstCode:provinceCode,
                  secondVal:cityText,
                  secondCode:cityCode,
                  thirdVal:countyText,
                  thirdCode:countyCode
                }
                _self.addPointer(JSON.stringify(data));
            }else if(idName.indexOf("S")!=-1){
                var area_province = _self.gearArea.querySelector(".area_province");
                var area_city = _self.gearArea.querySelector(".area_city");
                var provinceVal = parseInt(area_province.getAttribute("val"));
                var provinceText = area_province.childNodes[provinceVal].textContent;
                var provinceCode = area_province.childNodes[provinceVal].getAttribute('ref');
                var cityVal = parseInt(area_city.getAttribute("val"));
                var cityText = area_city.childNodes[cityVal].textContent;
                var cityCode = area_city.childNodes[cityVal].getAttribute('ref');
                _self.trigger.value = provinceText + ((cityText)?(' ' + cityText):(''));
                _self.value = [provinceVal, cityVal];
                var data = {
                      firstVal:provinceText,
                      firstCode:provinceCode,
                      secondVal:cityText,
                      secondCode:cityCode
                }
                 _self.addPointer(JSON.stringify(data));

            }else if(idName.indexOf("Z")!=-1){
                 var area_province = _self.gearArea.querySelector(".area_province");
                var provinceVal = parseInt(area_province.getAttribute("val"));
                var provinceText = area_province.childNodes[provinceVal].textContent;
                var provinceCode = area_province.childNodes[provinceVal].getAttribute('ref');
                _self.trigger.value = provinceText;
                _self.value = [provinceVal];
               var data = {
                firstVal:provinceText,
                firstCode:provinceCode,
                 id:idName
               }
              _self.addPointer(JSON.stringify(data));
                /*cjjVue.priceTypeBoth = provinceText;*/
               /* if(this.valueTo){
                    index.msg = provinceCode;
                }*/
            }

            _self.close(e);
        },
        close: function(e) {
            e.preventDefault();
            var _self = this;
            var evt = new CustomEvent('input');
            _self.trigger.dispatchEvent(evt);
            document.body.removeChild(_self.gearArea);
            _self.gearArea=null;
        }
    }
    return MobileArea;
})()
