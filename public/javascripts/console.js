define(function(require, exports, module){
	var smallImg = "",
		isSave = false,
		bigImgList = [],
		xinxiData,
		showTab,
		port = location.port == "8080" ? ":8080" : "";

	function showUser(){
        $("#name").html(window.adminInfo.name);		
        if(window.adminInfo.super == 'true'){
        	$("#creat").show();
        }
	}

	function initCss(){
		$(".menu").attr("style", "height: " + ($(window).height() - 50) + "px;");
		$(".content").attr("style", "height: " + ($(window).height() - 80) + "px;width: " + ($(window).width() - 250) + "px;");
		showTab = window.sessionStorage.getItem("sungmianconsoletab") || "free";
		$("[data-type='" + showTab + "']").addClass("on");
		if(showTab == "tongji"){
			showTongji();
		}else{
			showData();
		}
	}

	function showData(){
		$(".content").children().hide();
		$(".content_right").show();
		getData();
	}

	function showTongji(){
		window.open("http://tongji.baidu.com/web/22335771/overview/sole?siteId=9908891");
	}

	function getData(pi){
		var _pi = pi || 1
		$.ajax({
		    type: 'POST',
		    url: '//www.sungmian.com' + port + '/consoleget?pi=' + _pi + '&type=' + showTab,
		    data: {},
		    success: function(json){
		    	showNum(json.dataNum);
		    	if(json.data && json.data.length > 0){
			  		var html = "";
			  		var nowTime = new Date().getTime();
			  		xinxiData = json.data;
			  		json.data.forEach(function(item){
			  			var _color = "";
			  			if(item.show_end <= nowTime){
			  				_color = "color:#737373";
			  			}
			  			html += '<div class="xinxi_item" data-id="' + item._id+ '"><a class="item_title" style="' + _color + '" href="javascript:;">' + item.title+ '</a><div class="item_view">' + item.real_renqi+ '</div><div class="item_user">' + item.auther+ '</div><button data-operation="first">置顶</button><button data-operation="up">上移</button><button data-operation="down">下移</button><button data-operation="delete">删除</button></div>';			  			
			  		});
			        $(".xinxi_list").html(html);
		    	}else{
		    		$(".xinxi_list").html("");
		    	}
		    	//判断渲染页码
		    	if(!pi){
		    		var pageHtml = "",
		    			pageNum = 1;
		    		for(var i = 0; i < json.count; i = i + 16){
		    			pageHtml += '<span data-page="' + pageNum + '">' + pageNum + '</span>';
		    			pageNum ++;
		    		}
		    		$(".page").html(pageHtml);
		    		$(".page").find("span").first().addClass("on");
		    	}
		    },
		    dataType: 'json'
		});			
	}

	function showNum(data){
		var total = 0;
		for(var item in data){
			total = total + data[item];
			$("[data-type='" + item + "']").find("span").html(data[item]);			
		}
		$(".menu").find(".title").first().find("span").html(total);
	}

	function showDetail(data){
		smallImg = data.smallImg;
		bigImgList = data.bigImgList;
		$("#title").val(data.title);
		if(data.smallImg){
			$("#xiaotu .add_content").html('<a style="font-size: 15px;"  data-href="' + data.smallImg + '">' + data.smallImg + '</a>');
		}
		if(bigImgList.length > 0){
			bigImgList.forEach(function(item){
				$("#datu .add_content").append('<div style="margin-top:10px;"><a style="font-size: 12px;"  data-href="' + item + '">' + item + '</a><button style="margin-left: 10px;">删除</button></div>');
			});
		}
		$("#company").val(data.company);
		$("#renqi").val(data.renqi);
		$("#renqi_xishu").val(data.renqi_xishu);
		$("#tag").val(data.tag);
		$("#show_begin").val(timeFormat(data.show_begin));
		$("#show_end").val(timeFormat(data.show_end));
		$("#active_begin").val(timeFormat(data.active_begin));
		$("#active_end").val(timeFormat(data.active_end));		
		$("#isMiao").attr("checked", data.isMiao);
		if(data.tuijian.length > 0){
			data.tuijian.forEach(function(item){
				$("#tuijian_list").append('<input type="text">');
				$("#tuijian_list").find("input").last().val(item);
			});
		}	
		if(data.huoqu.length > 0){
			data.huoqu.forEach(function(item){
				$("#huoqu_list").append('<input type="text">');
				$("#huoqu_list").find("input").last().val(item);
			});
		}	
		if(data.other.length > 0){
			data.other.forEach(function(item){
				$("#other_list").append('<input type="text">');
				$("#other_list").find("input").last().val(item);
			});
		}		
		$("#link").val(data.link);	
		isSave = data._id;
		$(".xinix_detail").show();
	}

	function creatNewAdmin(){
		var name = $(".creat_new input[type='text']").val(),
			pwd = $(".creat_new input[type='password']").val(),
			isSuper = $(".creat_new input[type='checkbox']").is(':checked');
		if(name == "" || pwd == ""){
			alert("账号和密码不能为空");
			return;
		}
		$.ajax({
		    type: 'POST',
		    url: '//www.sungmian.com' + port + '/creatadmin',
		    data: {
		    	name: name,
		    	pwd: pwd,
		    	isSuper: isSuper
		    },
		    cache: false,
		    success: function(json){
		    	if(json.errorCode == 0){
		    		alert("创建成功,用户名：" + json.data.name + "；密码：" + json.data.password + "。");
		    	}else{
		    		alert("创建失败，" + json.message);
		    	}
		    	$(".creat_new input[type='text']").val('');
		    	$(".creat_new input[type='password']").val('');
		    	$(".creat_new input[type='checkbox']").removeAttr("checked");
		    },
		    dataType: 'json'
		});		
	}

	function initXinxiDetail(){
		var nowTime = timeFormat(new Date().getTime());
		$("#title").val('');
		$("#company").val('');
		$("#renqi").val('');
		$("#renqi_xishu").val('');
		$("#tag").val('');
		$("#xiaotu .add_content").html('');
		$("#datu .add_content").html('');
		$("#show_begin").val(nowTime);
		$("#show_end").val(nowTime);
		$("#active_begin").val(nowTime);
		$("#active_end").val(nowTime);
		$("#tuijian_list").html('');
		$("#huoqu_list").html('');
		$("#other_list").html('');
		$("#link").val('');
		$("#isMiao").attr("checked", false);
		smallImg = "";
		bigImgList = [];
		isSave = false;
	}

	function uploadXinxi(){
		var errmsg = [],
			xinxiObj = {};
		if($("#title").val() == ""){
			errmsg.push("标题为空");
		}else{
			xinxiObj.title = $("#title").val();
		}
		if(smallImg == ""){
			errmsg.push("小图为空");
		}else{
			xinxiObj.smallImg = smallImg;
		}
		if(bigImgList.length ==0){
			errmsg.push("大图为空");
		}else{
			xinxiObj.bigImgList = bigImgList;
		}
		xinxiObj.tuijian = [];
		xinxiObj.huoqu = [];
		xinxiObj.other = [];
		xinxiObj.company = $("#company").val();
		xinxiObj.tag = $("#tag").val();
		xinxiObj.renqi = parseInt($("#renqi").val() || 0, 10);
		xinxiObj.renqi_xishu = Number($("#renqi_xishu").val() || 1);
		xinxiObj.show_begin = Date.parse($("#show_begin").val());
		xinxiObj.show_end = Date.parse($("#show_end").val());
		xinxiObj.active_begin = Date.parse($("#active_begin").val());
		xinxiObj.active_end = Date.parse($("#active_end").val());	
		xinxiObj.isMiao = $("#isMiao").is(':checked');
		if($("#tuijian_list").html() != ""){
			for(var i = 0 ; i < $("#tuijian_list input").length ; i ++){
				($($("#tuijian_list input")[i]).val() != "") && xinxiObj.tuijian.push($($("#tuijian_list input")[i]).val());
			}			
		}
		if($("#huoqu_list").html() != ""){
			for(var i = 0 ; i < $("#huoqu_list input").length ; i ++){
				($($("#huoqu_list input")[i]).val() != "") && xinxiObj.huoqu.push($($("#huoqu_list input")[i]).val());
			}			
		}	
		if($("#other_list").html() != ""){
			for(var i = 0 ; i < $("#other_list input").length ; i ++){
				($($("#other_list input")[i]).val() != "") && xinxiObj.other.push($($("#other_list input")[i]).val());
			}			
		}
		if(xinxiObj.tuijian.length == 0){
			errmsg.push("推荐理由为空");
		}
		if(xinxiObj.huoqu.length == 0){
			errmsg.push("获取方式为空");
		}		
		xinxiObj.link = $("#link").val();
		if(errmsg.length > 0){
			alert(errmsg.join(";"));
			return;
		}else{
			xinxiObj.tuijian = xinxiObj.tuijian.join("#");
			xinxiObj.huoqu = xinxiObj.huoqu.join("#");
			xinxiObj.other = xinxiObj.other.join("#");
			xinxiObj.bigImgList = xinxiObj.bigImgList.join("#");
			if(isSave){
				$.ajax({
				    type: 'POST',
				    url: '//www.sungmian.com' + port + '/updateXinxi?type=' + showTab + '&id=' + isSave,
				    data: xinxiObj,
				    success: function(json){
				    	if(json.errorCode == 0){  //成功
				    		alert("更新成功");
				    		initXinxiDetail();
				    		getData();
				    	}else{  //失败
				    		alert("更新失败");
				    	}
				    },
				    dataType: 'json'
				});					
			}else{
				$.ajax({
				    type: 'POST',
				    url: '//www.sungmian.com' + port + '/uploadXinxi?type=' + showTab,
				    data: xinxiObj,
				    success: function(json){
				    	if(json.errorCode == 0){  //成功
				    		alert("保存成功");
				    		initXinxiDetail();
				    		getData();
				    	}else{  //失败
				    		alert("保存失败");
				    	}
				    },
				    dataType: 'json'
				});				
			}		
		}			
	}

	function upData(dom){
		var id1 = dom.attr("data-id"),
			id2,
			nowPage;
		if(dom.prev().length > 0){
			id2 = dom.prev().attr("data-id");
		}else{
			nowPage = $(".page").find(".on").attr("data-page");
			if(nowPage == 1){
				alert("该数据已是第一个，无需上移");
				return;
			}else{
				nowPage --;
			}
		}
		$.ajax({
		    type: 'POST',
		    url: '//www.sungmian.com' + port + '/operatXinxi',
		    data: {
		    	tab: showTab,
		    	id1: id1,
		    	id2: id2,
		    	page: nowPage,
		    	type: "up"
		    },
		    success: function(json){
		    	if(json.errorCode == 0){  //成功
		    		// alert("上移成功");
		    		getData();
		    	}else{  //失败
		    		alert("上移失败");
		    	}
		    },
		    dataType: 'json'
		});			
	}

	function downData(dom){
		var id1 = dom.attr("data-id"),
			id2,
			nowPage;
		if(dom.next().length > 0){
			id2 = dom.next().attr("data-id");
		}else{
			nowPage = $(".page").find(".on").attr("data-page");
			if($(".page").find("[data-page]").last().attr("data-page") == nowPage){
				alert("该数据已是最后一个，无需下移");
				return;
			}else{
				nowPage ++;
			}
		}
		$.ajax({
		    type: 'POST',
		    url: '//www.sungmian.com' + port + '/operatXinxi',
		    data: {
		    	tab: showTab,
		    	id1: id1,
		    	id2: id2,
		    	page: nowPage,
		    	type: "down"
		    },
		    success: function(json){
		    	if(json.errorCode == 0){  //成功
		    		// alert("下移成功");
		    		getData();
		    	}else{  //失败
		    		alert("下移失败");
		    	}
		    },
		    dataType: 'json'
		});			
	}

	function firstData(dom){
		var id1 = dom.attr("data-id"),
			id2,
			nowPage;
		if(dom.prev().length == 0 && $(".page").find("[data-page]").first().attr("data-page") == $(".page").find(".on").attr("data-page")){
			alert("该数据已是第一个，无需置顶");
			return;
		}
		$.ajax({
		    type: 'POST',
		    url: '//www.sungmian.com' + port + '/operatXinxi',
		    data: {
		    	tab: showTab,
		    	id1: id1,
		    	id2: id2,
		    	page: nowPage,
		    	type: "first"
		    },
		    success: function(json){
		    	if(json.errorCode == 0){  //成功
		    		// alert("置顶成功");
		    		getData();
		    	}else{  //失败
		    		alert("置顶失败");
		    	}
		    },
		    dataType: 'json'
		});			
	}	

	function timeFormat(t){
		var time = new Date(t),
			y = time.getFullYear(),
			m = time.getMonth() + 1,
			d = time.getDate(),
			h = time.getHours(),
			m2 = time.getMinutes(),
			s = time.getSeconds();
		return y + '/' + m + '/' + d + ' ' + h + ":" + m2 + ":" + s;
	}

	function bindEvent(){
		$("#logout").bind("click", function(){
			$.ajax({
			    type: 'GET',
			    url: '//www.sungmian.com' + port + '/adminlogout',
			    data: {},
			    success: function(json){
			    	if(json.errorCode == 0){
			    		location.reload();
			    	}
			    }
			});			
		});
		$("#creat").bind("click", function(){
			$(".content").children().hide();
			$("[data-type]").removeClass("on");
			$(".creat_new").show();
		});
		$(".btn-primary").bind("click", function(){
			creatNewAdmin();
		});
		$("button[data-add]").bind("click", function(){
			var type = $(this).attr("data-add");
			$("#" + type + "_list").append('<input type="text">');
		});
		$("#datu").on("click", "button", function(){
			var _index = $(this).parent().index();
			$(this).parent().remove();
			bigImgList.splice(_index, 1);
		});
		$("button[data-dlt]").bind("click", function(){
			var type = $(this).attr("data-dlt");
			$("#" + type + "_list").find("input").last().remove();
		});	
		$(".xinxi_add").bind("click", function(){
			initXinxiDetail();
			$(".xinix_detail").show();
		});	
		$("#datu,#xiaotu").on("click", "[data-href]", function(){
			window.open($(this).attr("data-href"));
		});
		$("[data-type]").bind("click", function(){
			if($(this).hasClass("on")){
				return;
			}else{
				if($(this).attr("data-type") == "tongji"){
					showTongji();
				}else{
					$(this).addClass("on").siblings().removeClass("on");
					showTab = $(this).attr("data-type");
					window.sessionStorage.setItem("sungmianconsoletab", showTab);
					showData();
				}
			}
		});
	 	$('#xiaotu input').change(function(event){
	 	    if ($('#xiaotu input').val().length) {
	 	        var fileName = $('#xiaotu input').val();
	 	        var extension = fileName.substring(fileName.lastIndexOf('.'), fileName.length).toLowerCase();
	 	        if (extension == ".jpg" || extension == ".png") {
	 	            var data = new FormData();
	 	            data.append('upload', $('#xiaotu input')[0].files[0]);
	 	            $.ajax({
	 	                url: '//www.sungmian.com' + port + '/imgupload',
	 	                type: 'POST',
	 	                data: data,
	 	                cache: false,
	 	                contentType: false, //不可缺参数
	 	                processData: false, //不可缺参数
	 	                success: function(data) {
	 	                    if(data.errorCode == 0){
	 	                    	smallImg = data.path;
	 	                    	$("#xiaotu .add_content").html('<a style="font-size: 15px;"  data-href="' + data.path + '">' + data.path + '</a>');
	 	                    }else{
	 	                    	alert("图片格式不对，仅限jpg和png格式");
	 	                    }
	 	                },
	 	                error: function() {
	 	                    console.log('error');
	 	                }
	 	            });
	 	        }else{
	 	        	alert("图片格式不对，仅限jpg和png格式");
	 	        }
	 	    }
	 	});	
	 	$('#datu input').change(function(event){
	 	    if ($('#datu input').val().length) {
	 	        var fileName = $('#datu input').val();
	 	        var extension = fileName.substring(fileName.lastIndexOf('.'), fileName.length).toLowerCase();
	 	        if (extension == ".jpg" || extension == ".png") {
	 	            var data = new FormData();
	 	            data.append('upload', $('#datu input')[0].files[0]);
	 	            $.ajax({
	 	                url: '//www.sungmian.com' + port + '/imgupload',
	 	                type: 'POST',
	 	                data: data,
	 	                cache: false,
	 	                contentType: false, //不可缺参数
	 	                processData: false, //不可缺参数
	 	                success: function(data) {
	 	                    if(data.errorCode == 0){
	 	                    	bigImgList.push(data.path);
	 	                    	$("#datu .add_content").append('<div style="margin-top:10px;"><a style="font-size: 12px;"  data-href="' + data.path + '">' + data.path + '</a><button style="margin-left: 10px;">删除</button></div>');
	 	                    }else{
	 	                    	alert("图片格式不对，仅限jpg和png格式");
	 	                    }
	 	                },
	 	                error: function() {
	 	                    console.log('error');
	 	                }
	 	            });
	 	        }else{
	 	        	alert("图片格式不对，仅限jpg和png格式");
	 	        }
	 	    }
	 	});	
	 	$("#save").bind("click", function(){
	 		uploadXinxi();
	 	}); 	
	 	$(".page").on("click", "span", function(){
	 		if($(this).hasClass("on")){
	 			return;
	 		}
	 		getData($(this).attr("data-page"));
	 		$(this).addClass("on").siblings().removeClass("on");
	 	});
	 	$(".xinxi_list").on("click", "a", function(){
	 		var _id = $(this).parent().attr("data-id");
	 		for(var i = 0 , len = xinxiData.length ; i < len; i ++){
	 			if(xinxiData[i]._id == _id){
					initXinxiDetail();
	 				showDetail(xinxiData[i]);
	 				break;
	 			}
	 		}
	 	});
	 	$(".xinxi_list").on("click", "[data-operation]", function(){
	 		var _type = $(this).attr("data-operation");
	 		if(_type == "first"){
	 			firstData($(this).parent());
	 		}else if(_type == "up"){
	 			upData($(this).parent());
	 		}else if(_type == "down"){
	 			downData($(this).parent());
	 		}else{
	 			var _confirm = confirm("数据创建不易，是否真的删除？");
	 			if(_confirm == true){
					$.ajax({
					    type: 'POST',
					    url: '//www.sungmian.com' + port + '/operatXinxi',
					    data: {
					    	tab: showTab,
					    	id1: $(this).parent().attr("data-id"),
					    	id2: null,
					    	page: null,
					    	type: "drop"
					    },
					    success: function(json){
					    	if(json.errorCode == 0){  //成功
					    		alert("删除成功");
					    		getData();
					    	}else{  //失败
					    		alert("删除失败");
					    	}
					    },
					    dataType: 'json'
					});	 				
	 			}			
	 		}
	 	});
	}

    exports.init = function(){
    	showUser();
    	initCss();
    	bindEvent();
    }
});