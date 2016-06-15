var express = require('express');
var router = express.Router();
var mailUtil = require("../utils/MailUtil");
var checkSession=require("../services/checkSessionService");
var nconf = require('nconf');

router.post('/',checkSession.requireLogin,function (request,response,next){
	var contactUs=request.body;
	var user=request.session.user;
	subject =  nconf.get("mail").subject+contactUs.subject;
	var context =  {
			title : nconf.get("mail").appName,
			username : user.name,
			query:contactUs.query,
			appName : nconf.get("mail").appName,
			contextPath : nconf.get("context").path
		};
	mailUtil.sendMail(nconf.get('mail').challengeMeSupport,nconf.get("smtpConfig").authUser,subject,'ContactUs.html',context);
	response.send("Mail Sent.");
});

module.exports = router;
