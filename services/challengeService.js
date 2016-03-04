var challengeModel = require("../models/challengeModel");
var counterModel = require("../models/counterModel"); 
var subcribeChallengeModel = require("../models/subcribeChallengeModel"); 

var challengeService =function(){

return{

createOrSaveChallenge : function(challenge,user,callbackForChallenge){
	
        if(challenge._id !==""){
        console.log('came in update');
        var isCreated;
        if(challenge.status==="create"){
        	isCreated=true;
        }else {
        	isCreated=false;
		}
        	 var conditions = { "_id":challenge._id };
        	 var update = { $set: {"title": challenge.title,"description": challenge.description,"date":challenge.date,"prize":challenge.prize,"status":challenge.status,"categories":challenge.categories,"isCreated":isCreated}};
        	 challengeModel.update(conditions, update, callback);
        	 
        	function callback (err, numAffected) {
        		console.log(numAffected + "rows updates");
        		callbackForChallenge(null,challenge.status);
        	};
        	 
        }else{
        	counterModel.findByIdAndUpdate({_id : "challengeId"}, {$inc: {seq: 1} }, function(error, counter)   {
   		       if(error)
   		    	callbackForChallenge(error);
        	var challenge1 = new challengeModel({"_id":counter.seq, "title": challenge.title,"description": challenge.description,"date":challenge.date,"prize":challenge.prize,"status":challenge.status,"categories":challenge.categories,"createdByEmailId":user.emailId,"createdBy":user.name,"learning":challenge.learning,"mailGroups":challenge.mailGroups});
        	challenge1.save(function(err){
                if(err)
                	callbackForChallenge(err);
                callbackForChallenge(null,challenge.status);
            });
        	});
  		      
        }
},
getChallengeForEmailId:function(emailId,callbackForChallengesForEmailId){
	
	var query = challengeModel.find({"createdByEmailId":emailId}).sort({"created_at":-1});
    query.exec(function(err, challenges){
        if(err)
        	callbackForChallengesForEmailId(err);
        callbackForChallengesForEmailId(null,challenges);
    });
},
getAllChallenges:function(categories,callbackForAllChallenges){
	console.log("categories"+categories);
	var query = challengeModel.find({"categories._id":{$in:categories},"status":"create"}).sort({"created_at":-1});
    query.exec(function(err, challenges){
        if(err)
        	callbackForAllChallenges(err);
        callbackForAllChallenges(null,challenges);
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
	        callbackForSubcribedChallenges(null,challenges);
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
			// var query = challengeModel.insert({})
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
				}); // end item.save
			});
		}
	}

}

module.exports=challengeService();