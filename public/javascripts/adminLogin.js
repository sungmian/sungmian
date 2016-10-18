define(function(require, exports, module){

    exports.init = function(){
    	if(window.loginError == 1){
    		alert("账号或密码错误，请重新登录！");
    	}
    }
});