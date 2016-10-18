var express = require('express');
var dbutil = require('./dbutil');
var router = express.Router();

router.post('/', function(req, res, next) {
    var model = dbutil.model(req.app.get('env'), req.body.type, 'xinxi', {
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
    var sortObj = {};
    var nowTime = new Date().getTime();
    if(req.body.sort == "default"){  //推荐排序
    	sortObj.time = -1;
    }else if(req.body.sort == "new"){  //最新
    	sortObj.show_begin = -1;
    }else{  //最热
    	sortObj.show_renqi = -1;
    }
    model.find({show_end: {"$gte": new Date().getTime(), "$lt": new Date('3000/01/01').getTime()}}, {_id: 1, smallImg: 1, title: 1, show_begin: 1, tag: 1, company: 1, show_renqi: 1}).sort(sortObj).skip(10 * (req.body.pi - 1)).limit(10).exec(function(err, docs){
    	if(err){
	        res.json({
	            errorCode: 1,
	            message: err
	        });	    		
	    }else{
	        res.json({
	            errorCode: 0,
	            data: docs,
	            message: 'success'
	        });	    	
	    }		    	
    });	    
});

module.exports = router;