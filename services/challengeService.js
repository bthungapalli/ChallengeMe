var challengeModel = require("../models/challengeModel");
var counterModel = require("../models/counterModel"); 

var categoryService =function(){

return{

createOrSaveChallenge : function(challenge,callbackForChallenge){
	
        if(challenge._id !==""){
        console.log('came in update');
        	 var conditions = { "_id":challenge._id };
        	 var update = { $set: {"title": challenge.title,"description": challenge.description,"date":challenge.date,"prize":challenge.prize,"status":challenge.status,"categories":challenge.categories}};
        	 challengeModel.update(conditions, update, callback);
        	 
        	function callback (err, numAffected) {
        		console.log(numAffected + "rows updates");
        		callbackForChallenge(null,challenge.status);
        	};
        	 
        }else{
        	counterModel.findByIdAndUpdate({_id : "challengeId"}, {$inc: {seq: 1} }, function(error, counter)   {
   		       if(error)
   		    	callbackForChallenge(error);
        	var challenge1 = new challengeModel({"_id":counter.seq, "title": challenge.title,"description": challenge.description,"date":challenge.date,"prize":challenge.prize,"status":challenge.status,"categories":challenge.categories,"createdByEmailId":challenge.createdByEmailId,"createdBy":challenge.createdBy});
        	challenge1.save(function(err){
                if(err)
                	callbackForChallenge(err);
                callbackForChallenge(null,challenge.status);
            });
        	});
  		      
        }
},
getChallengeForEmailId:function(emailId,callbackForChallengesForEmailId){
	
	var query = challengeModel.find({"createdByEmailId":emailId});
    query.exec(function(err, challenges){
        if(err)
        	callbackForChallengesForEmailId(err);
        callbackForChallengesForEmailId(null,challenges);
    });
},
getAllChallenges:function(callbackForAllChallenges){
	
	var query = challengeModel.find();
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
}
	
}

}

module.exports=categoryService();