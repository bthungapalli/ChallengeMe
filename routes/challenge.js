var express = require('express');
var router = express.Router();
var http = require('http');
var challengeService=require("../services/challengeService");
var checkSession=require("../services/checkSessionService");
var solutionService=require("../services/solutionService");
var mailUtil = require("../utils/MailUtil");
var _ = require('underscore');
var categoryService=require("../services/categoryService");

String.prototype.toUpperCaseFirstChar = function() {
    return this.substr( 0, 1 ).toUpperCase() + this.substr( 1 );
}

router.post('/',checkSession.requireLogin,function (request,response,next){
	var challenge=request.body;
	var user=request.session.user;
	challengeService.createOrSaveChallenge(challenge,user,function(err,status){
		if(err)
			response.send("error");
			if(status==="create"){
				var categoriesForMailGroup=[];
				for(var i=0;i<challenge.mailGroups.length;i++){
					categoriesForMailGroup.push(challenge.mailGroups[i].name)
				}
				console.log("categoriesForMailGroup:"+categoriesForMailGroup);
				categoryService.getEmailIdsForCategories(categoriesForMailGroup,function(err,emailIds){
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
				if(ids.length>0 && !challenge.isCreated){
			//	mailUtil.sendMail(ids,'bthungapalli@osius.com','Challenge Posted','ChallengeMe.html',context);
				}
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
	var userId = request.session.user.emailId;
	challengeService.getChallengeForChallengeId(challengeId,function(err,challenge){
		if(err)
			response.send("error");
		solutionService.getSolutionsForChallengeId(challenge[0]._id,userId,function(err,solutions){
			challenge[0].solutions=solutions;
			response.send(challenge[0]);
		});
	});
});

router.post('/comment',checkSession.requireLogin,function (request,response,next){
	var challengeId = request.body.challengeId;
	var postedComment = request.body.comment;
	var user=request.session.user;
	
	challengeService.updateComments(challengeId,postedComment,user,function(err,challenge){
		if(err)
			response.send("error");
				var context =  {
						title : 'ChallengeMe',
						ownerName : challenge.createdByEmailId.substr(0,challenge.createdByEmailId.indexOf('@')),
						challengeTitle : challenge.title,
						userName : user.name,
						comments : postedComment
					};
				mailUtil.sendMail(challenge.createdByEmailId,'bthungapalli@osius.com','New Comment posted','Comments_Challenges.html',context);
				response.json(challenge);
		
	});
});


router.post('/',checkSession.requireLogin,function (request,response,next){
	var challenge=request.body;
});

module.exports = router;
