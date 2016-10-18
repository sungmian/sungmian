var express = require('express');
var dbutil = require('./dbutil');
var router = express.Router();

router.post('/', function(req, res, next) {
    if(!req.session.adminUser){  //未登录
        res.render('adminlogin.html', {error: (req.session.adminLoginCheck ? 1 : 0)});
    }else{  //已登录
	    var model = dbutil.model(req.app.get('env'), req.body.tab, 'xinxi', {
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
	    model.findById(req.body.id1, function(err, doc1){
	    	if(req.body.type == "drop"){  //删除
	    		doc1.remove(function(err){
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
	    	}else if(req.body.type == "first"){  //置顶
			    model.find().sort({'time': -1}).skip(0).limit(1).exec(function(err, docs){
			    	var doc2 = docs[0];
			    	var doc1_time = doc1.time;
			    	doc1.time = doc2.time;
			    	doc2.time = doc1_time;
			    	doc1.save();
			    	doc2.save();
			        res.json({
			            errorCode: 0,
			            message: 'success'
			        });					    	
			    });	    		
	    	}else{  //上下移
	    		if(req.body.id2){
				    model.findById(req.body.id2, function(err, doc2){
				    	var doc1_time = doc1.time;
				    	doc1.time = doc2.time;
				    	doc2.time = doc1_time;
				    	doc1.save();
				    	doc2.save();
				        res.json({
				            errorCode: 0,
				            message: 'success'
				        });	 				    	
				    });  	    			
	    		}else{
				    model.find().sort({'time': -1}).skip((req.body.page - 1) * 16).limit(16).exec(function(err, docs){
				    	if(err || docs.length == 0){
					        res.json({
					            errorCode: 1,
					            message: req.body.type == "up" ? "上移失败" : "下移失败"
					        }); 	    		
				    	}else{
				    		var doc2 = req.body.type == "up" ? docs.pop() : docs[0];
					    	var doc1_time = doc1.time;
					    	doc1.time = doc2.time;
					    	doc2.time = doc1_time;
					    	doc1.save();
					    	doc2.save();				    		
					        res.json({
					            errorCode: 0,
					            message: 'success'
					        });	    		
				    	}	    	
				    });  	    			
	    		}
	    	}
	    });  	        		
    }
});

module.exports = router;