var express = require('express');
var router = express.Router();
var http = require('http');
var challengeService=require("../services/challengeService");

router.post('/',function (request,response,next){
	var challenge=request.body;
	challengeService.createOrSaveChallenge(challenge,function(err,status){
		if(err)
			response.send("error");
		if(status==="create"){
			// logic for mail
		}
		response.send("created");
	});
});

router.get('/',function (request,response,next){
	challengeService.getAllChallenges(function(err,challenges){
		if(err)
			response.send("error");
		response.send(challenges);
	});
});

router.get('/mychallenges/:emailId',function (request,response,next){
	var emailid=request.params.emailId;
	challengeService.getChallengeForEmailId(emailid,function(err,challenges){
		if(err)
			response.send("error");
		response.send(challenges);
	});
});

module.exports = router;
