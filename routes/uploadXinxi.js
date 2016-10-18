var express = require('express');
var dbutil = require('./dbutil');
var router = express.Router();

router.post('/', function(req, res, next) {
    if(!req.session.adminUser){  //未登录
        res.render('adminlogin.html', {error: (req.session.adminLoginCheck ? 1 : 0)});
    }else{  //已登录
    	req.body.real_renqi = 0;
    	req.body.time = new Date().getTime();
    	req.body.auther = req.session.adminUser.name;
    	req.body.show_renqi = parseInt(req.body.renqi * req.body.renqi_xishu, 10);
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
        new model(req.body).save(function(err){
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
        });         		
    }
});

module.exports = router;