var express = require('express');
var router = express.Router();

//首页
router.get('/', function(req, res, next) {
	var tab = req.query.tab || -1;
    res.render('index.html', {errCode: 0, tab: tab});
});

module.exports = router;