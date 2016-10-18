var express = require('express');
var dbutil = require('./dbutil');
var router = express.Router();

router.post('/', function(req, res, next) {
    var name = req.body.name,
        password = req.body.pwd,
        isSuper = req.body.isSuper;
    if(!req.session.adminUser.super){ //只有超级用户才能创建
        res.json({
            errorCode: 1,
            message: '操作账号不是超级管理员',
            data: {}
        });  
        return;         
    }
    var model = dbutil.model('production', 'adminuser', 'Person', {
        username:String,
        password:String,
        super:Boolean
    });      
    model.find({username: name}, function (err, datas){
        if(datas.length){  //已有账号
            res.json({
                errorCode: 1,
                message: '该帐号用户名已存在',
                data: {}
            });  
            return; 
        }
        new model({
            username: name,
            password: password,
            super: (isSuper == "true" ? true : false)
        }).save();
        res.json({
            errorCode: 0,
            message: 'success',
            data:{
                name: name,
                password: password
            }
        });
    });
});

module.exports = router;