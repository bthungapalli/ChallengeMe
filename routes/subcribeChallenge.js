var express = require('express');
var router = express.Router();
var http = require('http');
var challengeService=require("../services/challengeService");
var checkSession=require("../services/checkSessionService");
var mailUtil = require("../utils/MailUtil");
var nconf = require('nconf');

router.post('/',checkSession.requireLogin,function (request,response,next){
	var challenge = request.body.challenge
	var challengeId=challenge._id;
	var user = request.session.user;
	
	challengeService.subcribeChallenge(challengeId,user.emailId,function(err,createdMsg){
		if(err){
			console.log("Error uis ::;;",err);
			response.send("error");}
		else{
		var context =  {
				title : 'ChallengeMe',
				owner : challenge.createdBy,
				challengeName : challenge.title,
				user:user.name
			};
		mailUtil.sendMail(challenge.createdByEmailId,nconf.get('mail').challengeMeSupport,'Challenge Subscribed','Subscribe.html',context);
		response.send(createdMsg);
			}
	});
});

router.get('/',checkSession.requireLogin,function (request,response,next){
	var userEmailId=request.session.user.emailId;
	console.log("userEmailId"+userEmailId);
	challengeService.getSubcribedChallengeIds(userEmailId,function(err,subcribedChallengesIds){
		if(err)
			response.send("error");
		var challengeIds = [];
		for (var prop in subcribedChallengesIds) {
			challengeIds.push(subcribedChallengesIds[prop].challengeId);
		}
		challengeService.getSubcribedChallenges(challengeIds,function(err,subcribedChallenges){
			response.send(subcribedChallenges);
		});
	});
});


module.exports = router;
