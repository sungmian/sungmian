define(function(require, exports, module){
	var loopScroll = require("loopScroll");  

    exports.init = function(){  	
        try{
            if(window.sessionStorage.getItem("sungmian_detail_data_" + xinxiData._id)){
                xinxiData = JSON.parse(window.sessionStorage.getItem("sungmian_detail_data_" + xinxiData._id));
            }else{
                window.sessionStorage.setItem("sungmian_detail_data_" + xinxiData._id, JSON.stringify(xinxiData));
            }
        }catch(e){

        }
        var bannerHtml = "",
            barHtml = "",
            bigImgList = xinxiData.bigImgList.split(",");
        for(var i = 0 , len = bigImgList.length ; i < len ; i ++){
            bannerHtml += '<div class="slider_item"><img src="' + bigImgList[i] + '"></div>';
            barHtml += '<li></li>';
        }
        $(".slider_list").html(bannerHtml);
        if(bigImgList.length > 1){
            $(".slider").append('<ul class="slider_nav">' + barHtml + '</ul>');
            var bannerLoopScroll = loopScroll.init({
                tp: "img",
                moveDom: $(".slider_list"),
                moveChild: $(".slider_item"),
                tab: $(".slider_nav li"),
                len: bigImgList.length,
                index: 1,
                loopScroll: true,
                lockScrY: true,
                enableTransX: true,
                autoTime: 5000
            });             
        }
        $(".name").html(xinxiData.title);
        $(".company").html(xinxiData.company);
        $(".renqi").html("人气：" + xinxiData.show_renqi);
        var tuijian = xinxiData.tuijian.split(","),
            huoqu = xinxiData.huoqu.split(","),
            other = xinxiData.other.split(","),
            tuijianHtml = '<div class="content"><div class="title">推荐理由</div>',
            huoquHtml = '<div class="content"><div class="title">获取方式</div>',
            otherHtml = "";
        tuijian.forEach(function(item, idx){
            item = item.replace(/\&lt;/g, '<span>');
            item = item.replace(/\&gt;/g, '</span>');
            tuijianHtml += '<p>' + (idx + 1) + '.' + item + '</p>';
        });
        tuijianHtml += '<div class="line"></div></div>';
        huoqu.forEach(function(item, idx){
            item = item.replace(/\&lt;/g, '<span>');
            item = item.replace(/\&gt;/g, '</span>');
            huoquHtml += '<p>' + (idx + 1) + '.' + item + '</p>';
        });
        if(other.length > 0 && other[0] != ""){
            huoquHtml += '<div class="line"></div></div>'; 
            otherHtml += '<div class="content"><div class="title">其他</div>';
            other.forEach(function(item, idx){
                item = item.replace(/\&lt;/g, '<span>');
                item = item.replace(/\&gt;/g, '</span>');
                otherHtml += '<p>' + (idx + 1) + '.' + item + '</p>';
            });          
        }else{
            huoquHtml += '</div>';
        }      
        $(".detail_mid").append(tuijianHtml + huoquHtml + otherHtml);
        if(xinxiData.link){
            $(".detail_bottom").show();
            $(".button").bind("click", function(){  
                if(xinxiData.link.indexOf("￥") > -1){
                    $(".copy .kouling").html(xinxiData.link);
                    $(".copy .desc").html("复制上方的淘口令，打开淘宝即可看到");
                    $(".copy").show();
                }else if(xinxiData.link.indexOf("share.laiwang.com") > -1){
                    $(".copy .kouling").html(xinxiData.link);
                    $(".copy .desc").html("复制上方的喵口令，打开天猫即可看到");
                    $(".copy").show();
                }else{
                   location.href = xinxiData.link; 
               }
            });          
        }
        var nowTime = new Date().getTime(),
            timeWenan,
            timeDom;
        if(xinxiData.active_begin - nowTime > 0){
            if(xinxiData.isMiao == "true"){
                $(".time").html('<div class="time_3" data-time="' + (xinxiData.active_begin - nowTime) + '"></div>');
                timeDom = $(".time_3");
                timeWenan = "距离开始还剩：";
                showTime();
            }else{
                $(".time").html('<div class="time_1">开始时间：' + timeFormat(parseInt(xinxiData.active_begin, 10)) + '</div>');
            }
        }else{
            if(xinxiData.isMiao == "true"){
                $(".time").html('<div class="time_4" data-time="' + (xinxiData.active_end - nowTime) + '"></div>');
                timeDom = $(".time_4");
                timeWenan = "距离结束还剩：";
                showTime();
            }else{
                $(".time").html('<div class="time_2">结束时间：' + timeFormat(parseInt(xinxiData.active_end, 10)) + '</div>');
            }            
        }
        function showTime() {
            var endTime = parseInt(timeDom.attr("data-time"), 10);
            if (endTime < 0) {
                if(timeDom.hasClass("time_4")){
                    timeDom.html("已结束");
                }else{
                    nowTime = new Date().getTime();
                    timeDom.attr("data-time", xinxiData.active_end - nowTime).attr("class", "time_4");
                    timeWenan = "距离结束还剩：";
                    showTime();
                }
                return;
            }
            var remainDay = parseInt(endTime / 86400000, 10),
                remainHour = parseInt((endTime % 86400000) / 3600000, 10), 
                remainMinu = parseInt((endTime % 3600000) / 60000, 10), 
                remianSec = parseInt((endTime % 60000) / 1000, 10);
            if (remainDay < 10) {
                remainDay = "0" + remainDay;
            }                
            if (remainHour < 10) {
                remainHour = "0" + remainHour;
            }
            if (remainMinu < 10) {
                remainMinu = "0" + remainMinu;
            }
            if (remianSec < 10) {
                remianSec = "0" + remianSec;
            }
            timeDom.html(timeWenan + '<span>' + remainDay + '</span>天<span>' + remainHour + '</span>时<span>' + remainMinu + '</span>分<span>' + remianSec + '</span>秒').attr("data-time", endTime - 1000);
            setTimeout(showTime, 1000);
        } 
        function timeFormat(t){
            var time = new Date(t),
                m = time.getMonth() + 1,
                d = time.getDate(),
                h = time.getHours(),
                m2 = time.getMinutes();
            if(m < 10){
                m = '0' + m;
            }
            if(d < 10){
                d = '0' + d;
            }   
            if(h < 10){
                h = '0' + h;
            }   
            if(m2 < 10){
                m2 = '0' + m2;
            }       
            return m + "-" + d + " " + h + ":" + m2;        
        }    
        $("#follow").bind("click", function(){
            if(!$(".mod_foot_v2_layer img").attr("src")){
                $(".mod_foot_v2_layer img").attr("src", "./images/qrcode.jpg");
            }            
            $(".mod_foot_v2_layer").show();
        });
        $(".mod_foot_v2_layer .close").bind("click", function(){
            $(".mod_foot_v2_layer").hide();
        });
        $(".copy .close").bind("click", function(){
            $(".copy").hide();
        });        
    }
});