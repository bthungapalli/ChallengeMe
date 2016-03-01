var express = require('express');
var router = express.Router();
var http = require('http');
var challengeService=require("../services/challengeService");
var checkSession=require("../services/checkSessionService");
var solutionService=require("../services/solutionService");
var mailUtil = require("../utils/MailUtil");
var _ = require('underscore');
var categoryService=require("../services/categoryService");

router.post('/',checkSession.requireLogin,function (request,response,next){
	var challenge=request.body;
	var user=request.session.user;
	challengeService.createOrSaveChallenge(challenge,user,function(err,status){
		if(err)
			response.send("error");
			if(status==="create"){
				categoryService.getEmailIdsForCategories(challenge.categories,function(err,emailIds){
					if(err==="error")
						response.send("error");
					var ids=_.pluck(emailIds, 'emailId');
					console.log("emailIds...................."+ids);
				var categoryNames = challenge.categories.name;
				console.log("categories Details:::::",categoryNames);
				var context =  {
						title : 'ChallengeMe',
						username : user.name,
						categoryName:categoryNames,
						challengeName : challenge.title,
						description : challenge.description,
						prize : challenge.prize,
						lastDate : challenge.date
						
					};
				if(ids.length>0)
				mailUtil.sendMail('bthungapalli@osius.com','bthungapalli@osius.com','Challenge Posted','ChallengeMe.html',context);
				response.send("created");
			 });
			}else{
				response.send("created");
			}
		
	});
});

router.get('/categories',checkSession.requireLogin,function (request,response,next){
	var user=request.session.user;
	console.log("sess user"+user.categories);
	var categoriesJson = user.categories;
	var categories = [];
	for (var prop in user.categories) {
		var cat =categoriesJson[prop];
		categories.push(categoriesJson[prop]._id);
	}
	challengeService.getAllChallenges(categories,function(err,challenges){
		if(err)
			response.send("error");
		challengeService.getSubcribedChallengeIdsForEmail(user.emailId,function(err,challengeIds){
			if(err)
				response.send("error");
			for( var challenge in challenges){
				for( var id in challengeIds){
					if(challengeIds[id].challengeId===challenges[challenge]._id){
						challenges[challenge].isSubcribed=true;
						break;
					};
				}
			}
			response.send(challenges);
		});
		
	});
});

router.get('/mychallenges',checkSession.requireLogin,function (request,response,next){
	var emailId=request.session.user.emailId;
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


router.post('/',checkSession.requireLogin,function (request,response,next){
	var challenge=request.body;
});

module.exports = router;
