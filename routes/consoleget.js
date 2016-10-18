var express = require('express');
var dbutil = require('./dbutil');
var router = express.Router();

router.post('/', function(req, res, next) {
	var page = parseInt(req.query.pi || 1, 10);
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
    model.count({},function(err, count){ 
	    model.find().sort({'time': -1}).skip((page - 1) * 16).limit(16).exec(function(err, docs){
	    	if(err){
		        res.json({
		            errorCode: 1,
		            message: err
		        }); 	    		
	    	}else{
		        res.json({
		            errorCode: 0,
		            data: docs,
		            count: count,
		            pc: page,
		            pi: 16,
		            message: 'success'
		        });	    		
	    	}	    	
	    });    	
    });

});

module.exports = router;