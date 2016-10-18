var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

//创建model
function model(env, dbname, modelname, schema){
    var dev = env === 'development' ? "_dev" : "";
    var db = mongoose.createConnection('localhost', dbname + dev);
    db.on('error', console.error.bind(console,'连接错误:'));
    var _model = new mongoose.Schema(schema);  
    return db.model(modelname, _model);  
}

exports.model = model;