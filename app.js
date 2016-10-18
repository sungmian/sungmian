var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session')
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var console = require('./routes/console');
var detail = require('./routes/detail');
var adminLogin = require('./routes/adminLogin');
var imgUpload = require('./routes/imgUpload');
var adminLogout = require('./routes/adminLogout');
var creatAdmin = require('./routes/creatAdmin');
var uploadXinxi = require('./routes/uploadXinxi');
var updateXinxi = require('./routes/updateXinxi');
var operatXinxi = require('./routes/operatXinxi');
var consoleget = require('./routes/consoleget');
var getdata = require('./routes/getdata');

var app = express();

// 定义视图路径
app.set('views', path.join(__dirname, 'views'));

//设置环境
// app.set('env', 'production');

//使用ejs
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());

//定义静态文件路径
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieSession({
    secret: 'sungmian_admin',
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));

//路由
app.use('/', routes);
app.use('/console', console);
app.use('/adminlogin', adminLogin);
app.use('/detail', detail);
app.use('/imgupload', imgUpload);
app.use('/adminlogout', adminLogout);
app.use('/creatadmin', creatAdmin);
app.use('/uploadXinxi', uploadXinxi);
app.use('/updateXinxi', updateXinxi);
app.use('/operatXinxi', operatXinxi);
app.use('/consoleget', consoleget);
app.use('/getdata', getdata);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        // res.render('index.html', {errCode: err.status || 500, tab: -1});
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    // res.render('index.html', {errCode: err.status || 500, tab: -1});
});

module.exports = app;