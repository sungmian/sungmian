var express = require('express');
var formidable = require('formidable');
var fs = require('fs');
var router = express.Router();

var imgFolder = 'public/images/upload';

router.post('/', function(req, res, next) {
    var form = new formidable.IncomingForm(); //创建上传表单
    form.encoding = 'utf-8'; //设置编辑
    form.uploadDir = imgFolder; //设置上传目录
    form.keepExtensions = true; //保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024; //文件大小2M
    form.type = true;
    var displayUrl;
    form.parse(req, function(err, fields, files) {
        if (err) {
            res.send(err);
            return;
        }
        var extName = ''; //后缀名
        switch (files.upload.type) {
            case 'image/pjpeg':
                extName = 'jpg';
                break;
            case 'image/jpeg':
                extName = 'jpg';
                break;
            case 'image/png':
                extName = 'png';
                break;
            case 'image/x-png':
                extName = 'png';
                break;
        }
        if (extName.length === 0) {
            res.json({
                errorCode: 1,
                path: ''
            }); 
            return;
        } else {
            var yearAndMonth = new Date().getFullYear() + '' + (new Date().getMonth() + 1);
            var fileName = imgFolder + '/' + yearAndMonth;
            var avatarName = '/' + Date.now() + parseInt(Math.random() * 1000)+ '.' + extName;
            var newPath = fileName + avatarName;
            var port = req.app.get('env') === 'development' ? ":8080" : "";
            if (!fs.existsSync(fileName)) {
                fs.mkdirSync(fileName);
            }            
            fs.renameSync(files.upload.path, newPath); //重命名
            res.json({
                errorCode: 0,
                path: 'http://www.sungmian.com' + port + '/images/upload/' + yearAndMonth + avatarName
            }); 
        }
    });
});

module.exports = router;