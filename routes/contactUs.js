var express = require('express');
var router = express.Router();
var mailUtil = require("../utils/MailUtil");
var checkSession=require("../services/checkSessionService");

router.post('/',checkSession.requireLogin,function (request,response,next){
	var contactUs=request.body;
	var user=request.session.user;
	var context =  {
			title : 'ChallengeMe',
			username : user.name,
			query:contactUs.query
		};
	mailUtil.sendMail('apatha@osius.com',user.emailId,contactUs.subject,'contactUs.html',context);
	response.send("Mail Sent.");
});

module.exports = router;
