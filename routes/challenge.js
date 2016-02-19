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

router.get('/:categories',function (request,response,next){
	var categoriesJson = JSON.parse(request.params.categories);
	var categories = [];
	for (var prop in categoriesJson) {
		var cat =categoriesJson[prop];
		/*cat.created_at="ISODate("+cat.created_at+")";
		cat.updated_at="ISODate("+cat.updated_at+")";
		categories=categories+(JSON.stringify(cat))+",";*/
		categories.push(categoriesJson[prop]._id);
	}
	challengeService.getAllChallenges(categories,function(err,challenges){
		if(err)
			response.send("error");
		response.send(challenges);
	});
});

router.get('/mychallenges/:emailId',function (request,response,next){
	var emailId=request.params.emailId;
	challengeService.getChallengeForEmailId(emailId,function(err,challenges){
		if(err)
			response.send("error");
		response.send(challenges);
	});
});

router.get('/:id',function (request,response,next){
	var challengeId=request.params.id;
	challengeService.getChallengeForChallengeId(challengeId,function(err,challenge){
		if(err)
			response.send("error");
		response.send(challenge);
	});
});

module.exports = router;
