var express = require('express');
var router = express.Router();
var http = require('http');
var challengeService=require("../services/challengeService");
var checkSession=require("../services/checkSessionService");

router.post('/',checkSession.requireLogin,function (request,response,next){
	var challengeId=request.body.challengeId;
	var userEmailId=request.session.user.emailId;
	challengeService.subcribeChallenge(challengeId,userEmailId,function(err,createdMsg){
		if(err)
			response.send("error");
		response.send(createdMsg);
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
