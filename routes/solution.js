var express = require('express');
var router = express.Router();
var http = require('http');
var solutionService=require("../services/solutionService");
var checkSession=require("../services/checkSessionService");
var mailUtil = require("../utils/MailUtil");
var nconf = require('nconf');
var _ = require('underscore');
var  multer = require('multer');
var fs   = require('fs-extra');
var fileSystem = require('fs');
var path = require('path');

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

var filename="";
var storage =   multer.diskStorage({
	  destination: function (req, file, callback) {
		  console.log("AttachmentPaht::::::::"+nconf.get("solution").attachmentPath)
	    callback(null, nconf.get("solution").attachmentPath);
	  },
	  filename: function (req, file, callback) {
		var month=  new Date().getMonth()+1;
		 filename=new Date().getDate()+"-"+month+"-"+new Date().getFullYear()+"_"+file.originalname;
		  console.log("filename::::"+filename);
	    callback(null, filename);
	  }
	});

	var upload = multer({ storage : storage}).single('attachment'); 
	
router.post('/upload/:solutionId',checkSession.requireLogin,function(req,res){
	var solutionId=req.params.solutionId;
	console.log("solutionId::::::"+solutionId);
    upload(req,res,function(user,err) {
        if(err) {
             res.end("error");
        }
        	 res.send(filename);
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
					appName : nconf.get("mail").appName,
					contextPath : nconf.get("context").path
				};
			mailUtil.sendMail(_.uniq(ids),nconf.get("smtpConfig").authUser,subject,'Comments_Solutions.html',context , function(err){
			});
			
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

router.get('/download/:fileName',function(request,response,next){
	var fileName = request.params.fileName;
	  var file = nconf.get("solution").attachmentPath + fileName ;
	  console.log("solution download file "+file)
	  response.download(file,fileName,function(err){
		  if(err)
			  response.json("Error Occured while downloading");
	  })
	
});


router.post('/updatecomment',checkSession.requireLogin,function (request,response,next){
	var solutionId=request.body.solutionId;
	var commentId=request.body.commentId;
	var comment = request.body.comment;
	console.log("SolutionId......"+solutionId);
	solutionService.updateComment(solutionId,commentId,comment,function(err,res){
		if(err){
			response.send("error");
		}else{
		response.send("ok");
		}
	});
});

router.post('/deleteComment',checkSession.requireLogin,function (request,response,next){
	var solutionId=request.body.solutionId;
	var commentId=request.body.commentId;
	console.log("solutionId......"+solutionId);
	solutionService.deleteComment(solutionId,commentId,function(err,res){
		if(err){
			response.send("error");
		}else{
		response.send("ok");
		}
	});
});

module.exports = router;
