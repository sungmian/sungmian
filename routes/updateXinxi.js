var express = require('express');
var dbutil = require('./dbutil');
var router = express.Router();

router.post('/', function(req, res, next) {
    if(!req.session.adminUser){  //未登录
        res.render('adminlogin.html', {error: (req.session.adminLoginCheck ? 1 : 0)});
    }else{  //已登录
    	req.body.auther = req.session.adminUser.name;
    	req.body.bigImgList = req.body.bigImgList.split("#");
    	req.body.tuijian = req.body.tuijian.split("#");
    	req.body.huoqu = req.body.huoqu.split("#");
    	if(req.body.other != ""){
    		req.body.other = req.body.other.split("#");
    	}else{
    		req.body.other = [];
    	}
	    var model = dbutil.model(req.app.get('env'), req.query.type, 'xinxi', {
	        title: String,
	        smallImg: String,
	        bigImgList: [String],
	        tuijian: [String],
	        huoqu: [String],
	        other: [String],
	        company: String,
	        real_renqi: Number,
        	show_renqi: Number,
	        renqi: Number,
	        renqi_xishu: Number,
	        show_begin: Number,
	        show_end: Number,
	        active_begin:  Number,
	        active_end:  Number,
	        isMiao: Boolean,
	        link: String,
	        tag: String,
	        time: Number,
	        auther: String
	    }); 
	    model.findById(req.query.id, function(err, doc){
	    	if(err){
		        res.json({
		            errorCode: 1,
		            message: err
		        });	    		
	    	}else{
	    		doc.title = req.body.title;
	    		doc.smallImg = req.body.smallImg;
	    		doc.bigImgList = req.body.bigImgList;
	    		doc.tuijian = req.body.tuijian;
	    		doc.huoqu = req.body.huoqu;
	    		doc.other = req.body.other;
	    		doc.company = req.body.company;
	    		doc.show_renqi = parseInt((parseInt(doc.real_renqi, 10) + parseInt(req.body.renqi, 10)) * req.body.renqi_xishu, 10);
	    		doc.renqi = req.body.renqi;
	    		doc.renqi_xishu = req.body.renqi_xishu;
	    		doc.show_begin = req.body.show_begin;
	    		doc.show_end = req.body.show_end;
	    		doc.active_begin = req.body.active_begin;
	    		doc.active_end = req.body.active_end;
	    		doc.isMiao = req.body.isMiao;
	    		doc.link = req.body.link;
	    		doc.tag = req.body.tag;
	    		doc.auther = req.body.auther;
	    		doc.save(function(err){
	    			if(err){
				        res.json({
				            errorCode: 1,
				            message: err
				        });	 	    				
	    			}else{
				        res.json({
				            errorCode: 0,
				            message: 'success'
				        }); 	    				
	    			}
	    		})
	    	}
	    });         		
    }
});

module.exports = router;