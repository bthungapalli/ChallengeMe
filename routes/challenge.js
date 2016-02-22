var express = require('express');
var router = express.Router();
var http = require('http');
var challengeService=require("../services/challengeService");
var checkSession=require("../services/checkSessionService");
var solutionService=require("../services/solutionService");

router.post('/',checkSession.requireLogin,function (request,response,next){
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

router.get('/categories/:categories',checkSession.requireLogin,function (request,response,next){
	var user=request.session.user;
	console.log("sess user"+user);
	var categoriesJson = JSON.parse(request.params.categories);
	var categories = [];
	for (var prop in categoriesJson) {
		var cat =categoriesJson[prop];
		categories.push(categoriesJson[prop]._id);
	}
	challengeService.getAllChallenges(categories,function(err,challenges){
		if(err)
			response.send("error");
		response.send(challenges);
	});
});

router.get('/mychallenges/:emailId',checkSession.requireLogin,function (request,response,next){
	var emailId=request.params.emailId;
	challengeService.getChallengeForEmailId(emailId,function(err,challenges){
		if(err)
			response.send("error");
		response.send(challenges);
	});
});

router.get('/:challengeId',checkSession.requireLogin,function (request,response,next){
	var challengeId=request.params.challengeId;
	challengeService.getChallengeForChallengeId(challengeId,function(err,challenge){
		if(err)
			response.send("error");
		solutionService.getSolutionsForChallengeId(challenge[0]._id,function(err,solutions){
			challenge[0].solutions=solutions;
			response.send(challenge[0]);
		});
	});
});

module.exports = router;
