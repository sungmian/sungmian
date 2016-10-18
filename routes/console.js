var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){
    if(!req.session.adminUser){
    	res.redirect(302, '/adminlogin');
    }else{
    	next();
    }	
}, function(req, res, next) {
    res.render('console.html', {
    	name: req.session.adminUser.name,
    	superAdmin: req.session.adminUser.super
    });
});

module.exports = router;