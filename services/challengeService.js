var challengeModel = require("../models/challengeModel");
var counterModel = require("../models/counterModel"); 
var subcribeChallengeModel = require("../models/subcribeChallengeModel"); 
var likesModel = require("../models/likesModel"); 
var _ = require('underscore');
var likesUtil = require("../services/LikesUtil");


var challengeService =function(){

return{


	
createOrSaveChallenge : function(challenge,user,callbackForChallenge){
	 var isCreated;
     if(challenge.status==="create"){
     	isCreated=true;
     }else {
     	isCreated=false;
		}
        if(challenge._id !==""){
        console.log('came in update');
       
        	 var conditions = { "_id":challenge._id };
        	 var update = { $set: {"title": challenge.title,"description": challenge.description,"date":challenge.date,"prize":challenge.prize,"status":challenge.status,"categories":challenge.categories,"isCreated":isCreated,"mailGroups":challenge.mailGroups,"file":challenge.file,"anonymous":challenge.anonymous,"location":user.location,"tag":challenge.tag}};
        	 challengeModel.update(conditions, update, callback);
        	 
        	function callback (err, numAffected) {
        		if(err)
        			callbackForChallenge(err);
        		console.log(numAffected + "rows updates");
        		callbackForChallenge(null,challenge.status);
        	};
        	 
        }else{
        	counterModel.findByIdAndUpdate({_id : "challengeId"}, {$inc: {seq: 1} }, function(error, counter)   {
   		       if(error){
   		    	   console.log("error:"+error);
   		    	callbackForChallenge(error);
   		       }
        	var challenge1 = new challengeModel({"_id":counter.seq, "title": challenge.title,"description": challenge.description,"date":challenge.date,"prize":challenge.prize,"status":challenge.status,"categories":challenge.categories,"createdByEmailId":user.emailId,"createdBy":user.name,"learning":challenge.learning,"mailGroups":challenge.mailGroups,"isCreated":isCreated,"file":challenge.file,"anonymous":challenge.anonymous,"location":user.location,"tag":challenge.tag});
        	challenge1.save(function(err){
                if(err)
                	callbackForChallenge(err);
                callbackForChallenge(null,challenge.status);
            });
        	});
  		      
        }
},
getChallengeForEmailId:function(emailId,challengeOrLearningOrBoth,callbackForChallengesForEmailId){
	var q="";
	
	if(challengeOrLearningOrBoth==='All'){
		q={"createdByEmailId":emailId};
	}else{
		q={"createdByEmailId":emailId,"learning":challengeOrLearningOrBoth};
	}
	
	var query = challengeModel.find(q).sort({"created_at":-1});
    query.exec(function(err, challenges){
    	if(err){
	    	   console.log("error:"+error);
	    	   callbackForChallengesForEmailId(error);
	       }
        callbackForChallengesForEmailId(null,challenges);
    });
},
getAllChallenges:function(categories,challengeOrLearningOrBoth,callbackForAllChallenges){
	var q="";
	if(challengeOrLearningOrBoth==='All'){
		q={"mailGroups._id":{$in:categories},"status":"create"};
	}else{
		if(challengeOrLearningOrBoth==="LEARNINGS"){
			q={"mailGroups._id":{$in:categories},"status":"create","learning":true} ;
		}else{
			q={"mailGroups._id":{$in:categories},"status":"create","learning":false} ;
		}
	}
	console.log("categories"+categories);
	var query = challengeModel.find(q).sort({"created_at":-1});
    query.exec(function(err, challenges){
        if(err){
        	callbackForAllChallenges(err);
        }else{
        	   likesUtil.fetchLikes(challenges,function(err,challenges){
   	        	if(err)
   	        		callbackForAllChallenges(err);
   	        	callbackForAllChallenges(null,challenges)
   	        	
   	        });
       }
    });
},
getAllChallengesForCategoryName:function(categories,challengeOrLearningOrBoth,callbackForAllChallenges){
	var q="";
	if(challengeOrLearningOrBoth==='All'){
		q={"categories.name":{$in:categories},"status":"create"};
	}/*else{
		if(challengeOrLearningOrBoth==="LEARNINGS"){
			q={"mailGroups._id":{$in:categories},"status":"create","learning":true} ;
		}else{
			q={"mailGroups._id":{$in:categories},"status":"create","learning":false} ;
		}
	}*/
	console.log("categories"+categories);
	var query = challengeModel.find(q).sort({"created_at":-1});
    query.exec(function(err, challenges){
        if(err){
        	callbackForAllChallenges(err);
        }else{
        	   likesUtil.fetchLikes(challenges,function(err,challenges){
   	        	if(err)
   	        		callbackForAllChallenges(err);
   	        	callbackForAllChallenges(null,challenges)
   	        	
   	        });
       }
    });
},
getAllChallengesForMonth:function(month,callbackForAllChallenges){
	
	var year=new Date().getFullYear();
	var startDate=year+"-"+month+"-01T00:00:00.000Z";
	var endDate=year+"-"+month+"-31T23:59:59.000Z"
	var q={ created_at: { $gte: new Date(startDate), $lte: new Date(endDate) },"status":"create" };
	console.log("getAllChallengesForMonth::::"+startDate+ ";::"+endDate);
	var query = challengeModel.find(q).sort({"created_at":-1});
    query.exec(function(err, challenges){
        if(err){
        	callbackForAllChallenges(err);
        }else{
        	   likesUtil.fetchLikes(challenges,function(err,challenges){
   	        	if(err)
   	        		callbackForAllChallenges(err);
   	        	callbackForAllChallenges(null,challenges)
   	        	
   	        });
       }
    });
},
getAllChallengesForLocation:function(location,callbackForAllChallenges){
	
	var q={ "location":location,"status":"create" };
	var query = challengeModel.find(q).sort({"created_at":-1});
    query.exec(function(err, challenges){
        if(err){
        	callbackForAllChallenges(err);
        }else{
        	   likesUtil.fetchLikes(challenges,function(err,challenges){
   	        	if(err)
   	        		callbackForAllChallenges(err);
   	        	callbackForAllChallenges(null,challenges)
   	        	
   	        });
       }
    });
},
getChallengeForChallengeId:function(challengeId,callbackForchallenge){
	
	var query = challengeModel.find({"_id":challengeId});
    query.exec(function(err, challenge){
        if(err)
        	callbackForchallenge(err);
        	 callbackForchallenge(null,challenge);
       
    });
},
subcribeChallenge:function(challengeId,emailId,callbackForSubcribe){
 	counterModel.findByIdAndUpdate({_id : "subcribeChallengeId"}, {$inc: {seq: 1} }, function(error, counter)   {
	       if(error)
	    	   callbackForSubcribe(error);
 	var subcribeChallenge = new subcribeChallengeModel({"_id":counter.seq, "challengeId": challengeId,"emailId": emailId});
 	subcribeChallenge.save(function(err){
         if(err)
        	 callbackForSubcribe(err);
         callbackForSubcribe(null,"subcribed");
     });
 	});
},
getSubcribedChallengeIds:function(emailId,callbackForSubcribedChallengeIds){
console.log("in side getSubcribedChallengeIds" +emailId );
	var query = subcribeChallengeModel.find({"emailId":emailId}).sort({"created_at":-1});
    query.exec(function(err, challengeIds){
        if(err)
        	callbackForSubcribedChallengeIds(err);
        callbackForSubcribedChallengeIds(null,challengeIds);
    });
},
getSubcribedChallenges:function(ids,callbackForSubcribedChallenges){
	console.log("in side getSubcribedChallenges" +ids );
		var query = challengeModel.find({"_id":{$in:ids}});
	    query.exec(function(err, challenges){
	        if(err)
	        	callbackForSubcribedChallenges(err);
	        likesUtil.fetchLikes(challenges,function(err,challenges){
	        	if(err)
	        		callbackForSubcribedChallenges(err);
	        	callbackForSubcribedChallenges(null,challenges)
	        	
	        });
	    });
},
getSubcribedChallengeIdsForEmail:function(emailId,callbackForSubcribedChallengeIdsForEmail){
		var query = subcribeChallengeModel.find({"emailId":emailId},{"challengeId":1,"_id":0});
	    query.exec(function(err, challengeIds){
	        if(err)
	        	callbackForSubcribedChallengeIdsForEmail(err);
	        console.log("challengeIds"+challengeIds);
	        callbackForSubcribedChallengeIdsForEmail(null,challengeIds);
	    });
	},
	

updateComments : function(challengeId, comment, user,
				callbackForComments) {
			
			counterModel.findByIdAndUpdate({
				_id : "commentId"
			}, {
				$inc : {
					seq : 1
				}
			}, function(error, counter) {
				if (error)
					callbackForChallenge(error);
				challengeModel.findById(challengeId, function(err, challenge) {
					challenge.comments.push({
						_id:counter.seq,
						comment : comment,
						emailId : user.emailId,
						userName : user.name,
						commentedDate:new Date()
					});

					challenge.save(function(err, item) {
						if (err)
							callbackForComments("error");
						callbackForComments(null, item);
					});
				}); 
			});
},
updateFilePath:function(challengeId, filePath,callbackForUpdateFile){
	 var conditions = { "_id":challengeId };
	 var update = { $set: {"file":filePath}};
	 challengeModel.update(conditions, update,function(err,num){
		 if(err)
			 callbackForUpdateFile(err);
		 callbackForUpdateFile(null,"updated");
	 });
},

likeChallenge:function(challengeId,user,callbackForLikes){
	
	
	counterModel.findByIdAndUpdate({_id : "challengeId"}, {$inc: {seq: 1} }, function(error, counter)   {
	       if(error)
	    	   callbackForLikes(error);
	var likes = new likesModel({"_id":counter.seq,"typeId": challengeId,"emailId": user.emailId,"name":user.name,"type":'C'});
	   
	likes.save(function(err){
	            if(err)
	           	 callbackForLikes(err);
	            
	            callbackForLikes(null,{"_id":counter.seq,"typeId": challengeId,"emailId": user.emailId,"name":user.name,"type":"C"});
	        });
	});
	
},
unlikeChallenge:function(challengeId,user,callbackForUnLikes){
	
	likesModel.remove({"typeId":challengeId,"emailId":user.emailId,"type":"C"},function callback (err, numAffected) {
		if(err)
			callbackForUnLikes("error");
		console.log(challengeId +"challengeId deleted.");
		callbackForUnLikes(null,"deleted");
	});
},
closeChallenge:function(challengeId,date,callbackForCloseChallenge){
	var conditions = { "_id":challengeId };
	 var update = { $set: {"explicitClose": true,"date":date}};
	 challengeModel.update(conditions, update, callback);
	 
	function callback (err, numAffected) {
		if(err)
			callbackForCloseChallenge(err);
		console.log(numAffected + "rows updates");
		callbackForCloseChallenge(null,numAffected);
	};
	
},	
fetchAllChallenges:function(challengeOrLearningOrBoth,callbackForAllChallenges){
	var q="";
	if(challengeOrLearningOrBoth==='All'){
		q={"status":"create"};
	}else{
		if(challengeOrLearningOrBoth==="LEARNINGS"){
			q={"status":"create","learning":true};
		}else{
			q={"status":"create","learning":false};
		}
	}
	var query = challengeModel.find(q).sort({"created_at":-1});
			    query.exec(function(err, challenges) {
				if (err) {
					callbackForAllChallenges(err);
				} else {
					likesUtil.fetchLikes(challenges, function(err, challenges) {
						if (err)
							callbackForAllChallenges(err);
						callbackForAllChallenges(null, challenges)
					});
				}
			});
		},
		
fetchChallengesOrLearning:function(learning,allChallenges,user,callbackForChallengesOrLearning){
	var q="";
	if(allChallenges){
		var categories = [];
		var categoriesJson = user.categories;
		for (var prop in user.categories) {
			var cat =categoriesJson[prop];
			categories.push(categoriesJson[prop]._id);
		}
		q={"status":"create","learning":learning,"mailGroups._id":{$in:categories}};
	}else{
		q={"status":"create","learning":learning};
	}
	
			var query = challengeModel.find(q).sort({"created_at":-1});
					    query.exec(function(err, challenges) {
						if (err) {
							callbackForAllChallenges(err);
						} else {
							likesUtil.fetchLikes(challenges, function(err, challenges) {
								if (err)
									callbackForChallengesOrLearning(err);
								callbackForChallengesOrLearning(null, challenges)
							});
						}
					});
},


	fetchTags : function(callback){
		console.log("Came here");
		challengeModel.find({},{'tag':1,'_id':0},function(err,categories){
	       if(err)
	    	   callback("error");
	       callback(null,categories);
			});
		},
		
		updateComment:function(challengeId,commentId,comment,callbackForUpdateComment){
			var conditions = { "_id":challengeId , "comments._id":commentId};
			 var update = { $set: {"comments.$.comment" : comment,"comments.$.commentedDate":new Date()}};
			 challengeModel.update(conditions, update, callback);
			 
			function callback (err, numAffected) {
				if(err)
					callbackForUpdateComment(err);
				console.log(numAffected + "rows updates");
				callbackForUpdateComment(null,numAffected);
			};
			
		}
	
	}

}

module.exports=challengeService();