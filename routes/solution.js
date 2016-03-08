var express = require('express');
var router = express.Router();
var http = require('http');
var solutionService=require("../services/solutionService");
var checkSession=require("../services/checkSessionService");
var mailUtil = require("../utils/MailUtil");
var nconf = require('nconf');
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
		response.send(solution);
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
				var context =  {
						title : 'ChallengeMe',
						solutionBy : solution.solutionBy,
						challengeTitle : challengeTitle,
						userName : user.name,
						comments : postedComment.comment
					};
				mailUtil.sendMail([solution.solutionByEmailId,challengeEmailId],nconf.get('mail').challengeMeSupport,'Comment posted','Comments_Solutions.html',context);
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

router.post('/likes',checkSession.requireLogin,function (request,response,next){
	var challengeId=request.body.challengeId;
	var user=request.session.user;
	solutionService.likeChallenge(challengeId,user,function(err,like){
		if(err){
			response.send(err);
		}else{
		response.json(like);
		}
		
	});
});

module.exports = router;
