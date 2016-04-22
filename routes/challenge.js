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
		var month=  new Date().getMonth()+1;
		 filename=new Date().getDate()+"-"+month+"-"+new Date().getFullYear()+"_"+file.originalname;
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
	
router.get('/all/:challengeOrLearningOrBoth', checkSession.requireLogin, function(request,
			response, next) {
		challengeService.fetchAllChallenges(request.params.challengeOrLearningOrBoth,function(err, challenges) {
			if (err)
				response.send("error");
			response.send(challenges);
		});
	});

router.get('/challengeOrLearning/:learning/:allChallenges', checkSession.requireLogin, function(request,
		response, next) {
	challengeService.fetchChallengesOrLearning(request.params.learning,request.params.allChallenges,request.session.user,function(err, challenges) {
		if (err)
			response.send("error");
		response.send(challenges);
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
					var ids;
					if(nconf.get('AllHands').flag){
						ids= nconf.get('AllHands').emailId;
					}else{
						ids=_.pluck(emailIds, 'emailId');
					}
					console.log("emailIds...................."+ids);
					var categoryNames = challenge.categories.name;
					console.log("categories Details:::::",categoryNames);
				var subject;
				var template;
					if(challenge.learning ){
						subject =  nconf.get("mail").subject+"New Learning is shared";
						template = "Learning.html";
					}else{
						subject = nconf.get("mail").subject+"New Challenge has been posted";
						template = "Challenge.html";
					}
				
						
				var context =  {
						title : nconf.get("mail").appName,
						username : challenge.anonymous ? "Anonymous":user.name,
						categoryName:categoryNames,
						challengeName : challenge.title,
						description : challenge.description,
						prize : challenge.prize,
						lastDate : challenge.date,
						appURL : nconf.get("mail").appURL,
						appName : nconf.get("mail").appName,
						contextPath : nconf.get("context").path
						
					};

				if(ids.length>0 && !challenge.isCreated)
				mailUtil.sendMail(ids,nconf.get('mail').challengeMeSupport,subject,template,context);
				response.send("created");
			 });
			}else{
				response.send("created");
			}
		
	});
});

router.get('/categories/:challengeOrLearningOrBoth',checkSession.requireLogin,function (request,response,next){
	var user=request.session.user;
	console.log("sess user"+user.categories);
	var categoriesJson = user.categories;
	var categories = [];
	for (var prop in user.categories) {
		var cat =categoriesJson[prop];
		categories.push(categoriesJson[prop]._id);
	}
	challengeService.getAllChallenges(categories,request.params.challengeOrLearningOrBoth,function(err,challenges){
		if(err)
			response.send("error");
		challengeService.getSubcribedChallengeIdsForEmail(user.emailId,function(err,challengeIds){
			if(err)
				response.send("error");
			
			solutionService.getSolutionsForChallenges(function(err,count){
				if(err)
				response.send("error");
				
				for( var challenge in challenges){
					for( var id in challengeIds){
						if(challengeIds[id].challengeId===challenges[challenge]._id){
							challenges[challenge].isSubcribed=true;
							break;
						};
					}
					
					for(var id in count){
						if(challenges[challenge]._id===count[id]._id){
							challenges[challenge].solutionsCount=count[id].count;
						}
					}
				}
				
				response.send(challenges);
			});
			
			
		});
		
	});
});

router.get('/mychallenges/:challengeOrLearningOrBoth',checkSession.requireLogin,function (request,response,next){
	var emailId=request.session.user.emailId;
	challengeService.getChallengeForEmailId(emailId,request.params.challengeOrLearningOrBoth,function(err,challenges){
		if(err)
			response.send("error");
		
		solutionService.getSolutionsForChallenges(function(err,count){
			if(err)
			response.send("error");
			
			for( var challenge in challenges){
				
				for(var id in count){
					if(challenges[challenge]._id===count[id]._id){
						challenges[challenge].solutionsCount=count[id].count;
					}
				}
			}
			
			response.send(challenges);
		});
		
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


router.get('/categoryFromDashboard/:category',checkSession.requireLogin,function (request,response,next){
	var categories=[request.params.category];
	var user=request.session.user;
	challengeService.getAllChallengesForCategoryName(categories,"All",function(err,challenges){
		if(err)
			response.send("error");
		challengeService.getSubcribedChallengeIdsForEmail(user.emailId,function(err,challengeIds){
			if(err)
				response.send("error");
			
			solutionService.getSolutionsForChallenges(function(err,count){
				if(err)
				response.send("error");
				
				for( var challenge in challenges){
					for( var id in challengeIds){
						if(challengeIds[id].challengeId===challenges[challenge]._id){
							challenges[challenge].isSubcribed=true;
							break;
						};
					}
					
					for(var id in count){
						if(challenges[challenge]._id===count[id]._id){
							challenges[challenge].solutionsCount=count[id].count;
						}
					}
				}
				
				response.send(challenges);
			});
			
			
		});
});
});

router.get('/monthWisePosts/:month',checkSession.requireLogin,function (request,response,next){
	var user=request.session.user;
	challengeService.getAllChallengesForMonth(request.params.month,function(err,challenges){
		if(err)
			response.send("error");
		challengeService.getSubcribedChallengeIdsForEmail(user.emailId,function(err,challengeIds){
			if(err)
				response.send("error");
			
			solutionService.getSolutionsForChallenges(function(err,count){
				if(err)
				response.send("error");
				
				for( var challenge in challenges){
					for( var id in challengeIds){
						if(challengeIds[id].challengeId===challenges[challenge]._id){
							challenges[challenge].isSubcribed=true;
							break;
						};
					}
					
					for(var id in count){
						if(challenges[challenge]._id===count[id]._id){
							challenges[challenge].solutionsCount=count[id].count;
						}
					}
				}
				
				response.send(challenges);
			});
			
			
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
			var subject = nconf.get("mail").subject + 'New Comment posted';
			var comments = _.pluck(challenge,'comments');
			var ids = _.pluck(_.flatten(_.compact(comments)),'emailId');
			ids.push(challenge.createdByEmailId);
			
				var context =  {
						title : nconf.get("mail").appName,
						ownerName : challenge.createdBy,
						challengeTitle : challenge.title,
						userName : user.name,
						comments : postedComment,
						appName : nconf.get("mail").appName,
						contextPath : nconf.get("context").path
					};
				mailUtil.sendMail(_.uniq(ids),nconf.get('mail').challengeMeSupport,subject,'Comments_Challenges.html',context);
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

router.post('/like',checkSession.requireLogin,function (request,response,next){
	var challengeId=request.body.challengeId;
	var user=request.session.user;
	challengeService.likeChallenge(challengeId,user,function(err,like){
		if(err){
			console.log("Error",err);
			response.send("error");
		}else{
			response.json(like);
		}
	});
});


router.post('/unlike',checkSession.requireLogin,function (request,response,next){
	var challengeId=request.body.challengeId;
	var user=request.session.user;
	challengeService.unlikeChallenge(challengeId,user,function(err,like){
		if(err){
			response.send("error");
		}else{
		response.json("unliked");
		}
	});
});

router.post('/close',checkSession.requireLogin,function (request,response,next){
	var challengeId=request.body._id;
	var date=request.body.date;
	console.log("challengeId......"+challengeId);
	challengeService.closeChallenge(challengeId,date,function(err,res){
		if(err){
			response.send("error");
		}else{
		response.send("closed");
		}
	});
});

router.post('/',checkSession.requireLogin,function (request,response,next){
	var challenge=request.body;
});

module.exports = router;
