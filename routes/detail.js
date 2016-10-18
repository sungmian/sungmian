var express = require('express');
var dbutil = require('./dbutil');
var router = express.Router();

router.get('/', function(req, res, next) {
	if(!req.query.type || !req.query.id){
		res.render('detail.html', {
            errCode: 1,
            title: 1,
            _id: 1,
            bigImgList: 1,
            tuijian: 1,
            huoqu: 1,
            other: 1,
            company: 1,
            show_renqi: 1,
            active_begin: 1,
            active_end: 1,
            isMiao: 1,
            link: 1
        });
		return;
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
    	if(err || !doc){
    		res.render('detail.html', {errCode: 1});
    		return;
    	}
    	var backData = doc;
    	backData.errCode = 0;
    	res.render('detail.html', backData);
    	doc.real_renqi ++;
    	doc.show_renqi = parseInt((parseInt(doc.real_renqi, 10) + parseInt(doc.renqi, 10)) * doc.renqi_xishu, 10);
    	doc.save();
    });
});

module.exports = router;