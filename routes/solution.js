var express = require('express');
var router = express.Router();
var http = require('http');
var solutionService=require("../services/solutionService");
var checkSession=require("../services/checkSessionService");

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


module.exports = router;
