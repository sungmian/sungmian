var express = require('express');
var dbutil = require('./dbutil');
var router = express.Router();

router.get('/', function(req, res, next) {
    if(!req.session.adminUser){  //未登录
        res.render('adminlogin.html', {error: (req.session.adminLoginCheck ? 1 : 0)});
    }else{  //已登录
        req.session.adminLoginCheck = null;
        res.redirect(302, '/console');
    }
});

router.post('/check', function(req, res, next) {  //登录接口
    var model = dbutil.model('production', 'adminuser', 'Person', {
        username:String,
        password:String,
        super:Boolean
    });    
    var name = req.body.username,
        password = req.body.password;
    model.find(function(err, datas){
    	if(datas.length){
            for(var i = 0, len = datas.length; i < len ; i ++){
                if(datas[i].username == name && datas[i].password == password){  //验证成功
                    req.session.adminUser = {
                        name: name,
                        super: datas[i].super
                    };
                    res.redirect(302, '/console');
                    return;
                }
            }
            req.session.adminLoginCheck = true;
            res.redirect(302, '/adminlogin');    
    	} 	
    });
});

module.exports = router;