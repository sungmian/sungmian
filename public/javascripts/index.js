define(function(require, exports, module){
	var cacheState = {
			tab: 0,
			sort: "default",
			pi: 1,
			height: 0
		},
		dataType = ["free", "little", "coupon", "cheep"],
		backHeightNum = 0,
		backingToOldHeight = true,
		dataBack = true,
		listDom = $(".list"),
		port = location.port == "8080" ? ":8080" : "";

	function initPage(){
		var randomArr = [0, 1, 2, 3];
		if(window.defaultTab != -1){
			cacheState.tab = window.defaultTab;
		}else{
			cacheState.tab = randomArr[parseInt(Math.random() * randomArr.length, 10)];
		}
		try{
			if(window.sessionStorage.getItem("sungmian_index_state")){
				cacheState = JSON.parse(window.sessionStorage.getItem("sungmian_index_state"));
			}
		}catch(e){

		}
		if(cacheState.tab > 3){
			cacheState.tab = 0;
		}
		$("[data-index='" + cacheState.tab + "']").first().hide();
		$("[data-index='" + cacheState.tab + "']").last().show();
		// $("[data-index='" + cacheState.tab + "']").addClass("on");
		$("[data-sort='" + cacheState.sort + "']").addClass("on");
		if(cacheState.pi == 1){
			getData();
		}else{
			for(var i = 1 ; i <= cacheState.pi ; i ++){
				getData(i);
			}
		}
		backToOldHeight();
        document.onreadystatechange = function() {
            if (document.readyState == "complete") {
                $("body").prepend("<div style='margin:0 auto;width:0px;height:0px;overflow:hidden;'><img src='./images/logo.jpg' width='300'></div>");
            }
        }		
	}

    function backToOldHeight() {
        if (document.body.scrollTop != cacheState.height) {
            window.scrollTo(0, cacheState.height);
            if (backHeightNum < 100) {
                backHeightNum++;
                window.backHeightTimer = setTimeout(backToOldHeight, 100);
            } else {
                backingToOldHeight = false;
            }
        } else {
            backingToOldHeight = false;
        }
    }	

	function getData(pi){
		var _pi = pi || 1,
			_cache = false;
		if(!pi){
			listDom.html("");
			$(".end").hide();
		}
		try{
			if(window.sessionStorage.getItem("sungmian_index_data_" + cacheState.tab + "_" + cacheState.sort + "_" + _pi)){
				var _data = JSON.parse(window.sessionStorage.getItem("sungmian_index_data_" + cacheState.tab + "_" + cacheState.sort + "_" + _pi));
				dataBack = true;
				showData(_data);
				_cache = true;
	    		if(_data.length < 10){
	    			$(".end").show();
	    		}				
			}
		}catch(e){

		}
		if(_cache){
			return;
		}
		$.ajax({
		    type: 'POST',
		    url: '//www.sungmian.com' + port + '/getdata',
		    data: {
		    	type: dataType[cacheState.tab],
		    	sort: cacheState.sort,
		    	pi: _pi
		    },
		    success: function(json){
		    	dataBack = true;
		    	if(json.errorCode == 0){  //成功
		    		if(json.data.length > 0){
						showData(json.data);
						try{
							window.sessionStorage.setItem("sungmian_index_data_" + cacheState.tab + "_" + cacheState.sort + "_" + _pi, JSON.stringify(json.data));
						}catch(e){

						}
		    		}
		    		if(json.data.length < 10){
		    			$(".end").show();
		    		}
		    	}else{  //失败

		    	}
		    },
		    dataType: 'json'
		});			
	}

	function showData(data){
		var html = "";
		for(var i = 0, len = data.length ; i < len ; i ++){
			html += '<div class="item"><a href="http://www.sungmian.com' + port + '/detail?id=' + data[i]._id + '&type=' + dataType[cacheState.tab] + '"><div class="item_left"><img src="' + data[i].smallImg + '"></div>';
			html += '<div class="item_right"><div class="title">' + data[i].title + '</div><div class="mid"><div class="date">' + timeFormat(data[i].show_begin) + '</div>';
			if(data[i].tag){
				html += '<div class="tag">' + data[i].tag + '</div>';
			}
			html += '</div><div class="bottom"><div class="company">' + data[i].company + '</div><div class="eye"></div><div class="renqi">' + data[i].show_renqi + '</div></div></div></a></div>';
		}
		listDom.append(html);
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

	function bindEvent(){
		var tabBefore = $("#tabBefore"),
			tabDom = $(".sort_tab"),
			listDom = $(".list"),
			oldHeight = 0;
			backShowHeight = $(window).height()/2,
			backDom = $(".WX_backtop"),
			endDom = $(".end");
		$(".wrap").on("click", function(){
			try{
				window.sessionStorage.setItem("sungmian_index_state", JSON.stringify(cacheState));
			}catch(e){

			}
		});	
        $("body").on("touchstart", function(e) {
            if (backingToOldHeight) {
                backingToOldHeight = false;
                window.clearTimeout(window.backHeightTimer);
            }
        });			
		$(".button1").bind("click", function(){
			$(".mask").show();
		});
		$(".button2, .follow p").bind("click", function(){
			if(!$(".mod_foot_v2_layer img").attr("src")){
				$(".mod_foot_v2_layer img").attr("src", "./images/qrcode.jpg");
			}
			$(".mod_foot_v2_layer").show();
		});		
		$(".mask .close").bind("click", function(){
			$(".mask").hide();
		});
		$(".mod_foot_v2_layer .close").bind("click", function(){
			$(".mod_foot_v2_layer").hide();
		});
		$("[data-index]").bind("click", function(){
			if($(this).hasClass("on")){
				return;
			}
			$("[data-index='" + cacheState.tab + "']").first().show();
			$("[data-index='" + cacheState.tab + "']").last().hide();
			cacheState.tab = $(this).attr("data-index");
			cacheState.pi = 1;
			$("[data-index='" + cacheState.tab + "']").first().hide();
			$("[data-index='" + cacheState.tab + "']").last().show();
			window.scrollTo(0, tabBefore.offset().top);
			getData();
		});
		$("[data-sort]").bind("click", function(){
			if($(this).hasClass("on")){
				return;
			}
			cacheState.sort = $(this).attr("data-sort");
			cacheState.pi = 1;
			$(this).addClass("on").siblings().removeClass("on");
			window.scrollTo(0, tabBefore.offset().top);
			getData();
		});	
		backDom.bind("click", function(){
			window.scrollTo(0, 0);
		});	
		window.onscroll = function(){
			if(document.body.scrollTop >= tabBefore.offset().top && oldHeight > document.body.scrollTop){
				tabDom.addClass("fixed");
			}else{
				tabDom.removeClass("fixed");
			}
			if(document.body.scrollTop >= backShowHeight){
				backDom.show();
			}else{
				backDom.hide();
			}
			if(document.body.scrollTop + backShowHeight + $(window).height() >= document.body.scrollHeight){
				if(endDom.css("display") == "none" && dataBack){
					dataBack = false;
					getData(++ cacheState.pi);
				}
			}
			cacheState.height = document.body.scrollTop;
			oldHeight = document.body.scrollTop;
		}
	}

    exports.init = function(){
    	initPage();
    	bindEvent();
    }
});