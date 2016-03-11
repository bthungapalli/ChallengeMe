var express = require('express');
var router = express.Router();
var http = require('http');
var challengeService=require("../services/challengeService");
var checkSession=require("../services/checkSessionService");
var solutionService=require("../services/solutionService");
var mailUtil = require("../utils/MailUtil");
var _ = require('underscore');
var categoryService=require("../services/categoryService");
var fs   = require('fs-extra');
var fileSystem = require('fs');
var  multer = require('multer');
var path = require('path');
var nconf = require('nconf');

var filename="";
var storage =   multer.diskStorage({
	  destination: function (req, file, callback) {
		  console.log("AttachmentPaht::::::::"+nconf.get("challenge").attachmentPath)
	    callback(null, nconf.get("challenge").attachmentPath);
	  },
	  filename: function (req, file, callback) {
		 filename=new Date().getDate()+"-"+new Date().getMonth()+"-"+new Date().getFullYear()+"_"+file.originalname;
		  console.log("filename::::"+filename);
	    callback(null, filename);
	  }
	});

	var upload = multer({ storage : storage}).single('attachment');

	router.post('/upload/:challengeId',checkSession.requireLogin,function(req,res){
		var challengeId=req.params.challengeId;
		console.log("challengeId::::::"+challengeId);
	    upload(req,res,function(user,err) {
	        if(err) {
	             res.end("error");
	        }
	        if(challengeId!=="-1"){
	        	console.log("inside:::: update for file");
	        	challengeService.updateFilePath(challengeId,filename,function(err,response){
	        		if(err)
	        			res.end("error");
	        		 res.send(filename);
	        	});
	        }else{
	        	 res.send(filename);
	        }
	        	
	    });
	});
	

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
					if(err)
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

				if(ids.length>0 && !challenge.isCreated)
				mailUtil.sendMail(ids,nconf.get('mail').challengeMeSupport,'Challenge Posted','ChallengeMe.html',context);
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
			if(err)
				response.send("error");
			challenge[0].solutions=solutions;
			console.log("challenge[0]::"+challenge[0]);
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
				mailUtil.sendMail(challenge.createdByEmailId,nconf.get('mail').challengeMeSupport,'New Comment posted','Comments_Challenges.html',context);
				response.json(challenge);
		
	});
});

router.get('/download/:fileName',function(request,response,next){
	var fileName = request.params.fileName;
	  var file = nconf.get("challenge").attachmentPath + fileName ;
	  response.download(file,fileName,function(err){
		  if(err)
			  response.json("Error Occured while downloading");
	  })
	
});

router.post('/',checkSession.requireLogin,function (request,response,next){
	var challenge=request.body;
});

module.exports = router;
