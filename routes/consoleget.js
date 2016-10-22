var express = require('express');
var dbutil = require('./dbutil');
var router = express.Router();
var dataNum = {
    free: -1,
    little: -1,
    coupon: -1,
    cheep: -1
};

router.post('/', function(req, res, next) {
	var page = parseInt(req.query.pi || 1, 10);
    var schema = {
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
    };    
    var model = dbutil.model(req.app.get('env'), req.query.type, 'xinxi', schema); 
    var model_free = dbutil.model(req.app.get('env'), 'free', 'xinxi', schema); 
    var model_little = dbutil.model(req.app.get('env'), 'little', 'xinxi', schema); 
    var model_coupon = dbutil.model(req.app.get('env'), 'coupon', 'xinxi', schema); 
    var model_cheep = dbutil.model(req.app.get('env'), 'cheep', 'xinxi', schema);     
    var year =  new Date().getFullYear(),
        month =  new Date().getMonth(),
        day =  new Date().getDate();
    var beginTime = new Date(year, month, day).getTime(),
        endTime =  new Date(year, month, day + 1).getTime();  
    model_free.find({auther: req.session.adminUser.name}).where('time').gt(beginTime).lt(endTime).exec(function(err, docs){
        if(err){
            dataNum.free = 0;
        }else{
            dataNum.free = docs.length;
        }
        model_little.find({auther: req.session.adminUser.name}).where('time').gt(beginTime).lt(endTime).exec(function(err, docs){
            if(err){
                dataNum.little = 0;
            }else{
                dataNum.little = docs.length;
            }
            model_coupon.find({auther: req.session.adminUser.name}).where('time').gt(beginTime).lt(endTime).exec(function(err, docs){
                if(err){
                    dataNum.coupon = 0;
                }else{
                    dataNum.coupon = docs.length;
                }
                model_cheep.find({auther: req.session.adminUser.name}).where('time').gt(beginTime).lt(endTime).exec(function(err, docs){
                    if(err){
                        dataNum.cheep = 0;
                    }else{
                        dataNum.cheep = docs.length;
                    }
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
                                    dataNum: dataNum,
                                    count: count,
                                    pc: page,
                                    pi: 16,
                                    message: 'success'
                                });             
                            }           
                        });     
                    });
                });  
            });
        });
    }); 
});

module.exports = router;