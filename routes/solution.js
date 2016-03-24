var express = require('express');
var router = express.Router();
var http = require('http');
var solutionService=require("../services/solutionService");
var checkSession=require("../services/checkSessionService");
var mailUtil = require("../utils/MailUtil");
var nconf = require('nconf');
var _ = require('underscore');

router.post('/',checkSession.requireLogin,function (request,response,next){
	var solutionObj=request.body;
	var user=request.session.user;
	solutionService.createOrSaveSolution(solutionObj,user,function(err,solutionId){
		if(err)
			response.send("error");
		solutionObj._id=solutionId;
		response.send(solutionObj);
	});
});

router.get('/:challengeId',checkSession.requireLogin,function (request,response,next){
	var userEmailId=request.session.user.emailId;
	var challengeId=request.params.challengeId;
	solutionService.getSolution(challengeId,userEmailId,function(err,solution){
		if(err)
			response.send("error");
		response.send(solution[0]);
	});
});

router.post('/comment',checkSession.requireLogin,function (request,response,next){
	var solutionId = request.body.solutionId;
	var postedComment = request.body.comment;
	var user=request.session.user;
	var challengeEmailId = request.body.challengeEmailId;
	var challengeTitle = request.body.title;
	
	solutionService.updateComments(solutionId,postedComment,user,function(err,solution) {
		if(err)
			response.send("error");
		
		var subject = nconf.get("mail").subject + 'New Comment posted';
		var comments = _.pluck(solution,'comments');
		var ids = _.pluck(_.flatten(_.compact(comments)),'emailId');
		ids.push(solution.solutionByEmailId);
		ids.push(challengeEmailId);
		
		if(solution!=="solution Needed"){
			var context =  {
					title : nconf.get("mail").appName,
					solutionBy : solution.solutionBy,
					challengeTitle : challengeTitle,
					userName : user.name,
					comments : postedComment,
					appName : nconf.get("mail").appName
				};
			mailUtil.sendMail(_.uniq(ids),nconf.get('mail').challengeMeSupport,subject,'Comments_Solutions.html',context);
			
		}
				response.json(solution);
		
	});
});

router.put('/correctAnswer',checkSession.requireLogin,function (request,response,next){
	var solutionObj=request.body;
	solutionService.updateIsCorrectAnswer(solutionObj,function(err,updated){
		if(err || response==="error")
			response.send("error");
		response.send(updated);
	});
});

router.post('/like',checkSession.requireLogin,function (request,response,next){
	var solutionId=request.body.solutionId;
	var user=request.session.user;
	solutionService.likeChallenge(solutionId,user,function(err,like){
		if(err){
			response.send("error");
		}else{
		response.json(like);
		}
	});
});


router.post('/unlike',checkSession.requireLogin,function (request,response,next){
	var solutionId=request.body.solutionId;
	var user=request.session.user;
	solutionService.unlikeChallenge(solutionId,user,function(err,like){
		if(err){
			response.send("error");
		}else{
		response.json("unliked");
		}
	});
});

module.exports = router;
