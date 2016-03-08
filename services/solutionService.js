var counterModel = require("../models/counterModel"); 
var solutionModel = require("../models/solutionModel"); 
var likesModel = require("../models/likesModel"); 
var _ = require('underscore');

var solutionService =function(){

return{

	createOrSaveSolution : function(solutionObj,user,callbackForcreateOrSaveSolution){
	
        if(solutionObj._id !==""){
        console.log('came in update');
        	 var conditions = { "_id":solutionObj._id };
        	 var update = { $set: {"challengeId": solutionObj.challengeId,"solution": solutionObj.solution,"anonymous":solutionObj.anonymous,"status":solutionObj.status,"solutionByEmailId":user.emailId,"solutionBy":user.name}};
        	 solutionModel.update(conditions, update, callback);
        	 
        	function callback (err, numAffected) {
        		console.log(numAffected.n + "rows updates");
        		callbackForcreateOrSaveSolution(null,solutionObj._id);
        	};
        	 
        }else{
        	counterModel.findByIdAndUpdate({_id : "solutionId"}, {$inc: {seq: 1} }, function(error, counter)   {
   		       if(error)
   		    	callbackForcreateOrSaveSolution(error);
        	var solution = new solutionModel({"_id":counter.seq,"challengeId": solutionObj.challengeId,"solution": solutionObj.solution,"anonymous":solutionObj.anonymous,"status":solutionObj.status,"solutionByEmailId":user.emailId,"solutionBy":user.name});
        	solution.save(function(err){
                if(err)
                callbackForcreateOrSaveSolution(err);
                callbackForcreateOrSaveSolution(null,counter.seq);
            });
        	});
  		      
        }
},
getSolution:function(challengeId,userEmailId,callbackForSolution){
	
	var query = solutionModel.findOne({"challengeId":challengeId,"solutionByEmailId":userEmailId});
    query.exec(function(err, solution){
        if(err)
        	callbackForSolution(err);
        callbackForSolution(null,solution);
    });
},

getSolutionsForChallengeId:function(challengeId,userId,callbackForSolutions){
	var query = solutionModel.find({"challengeId":challengeId}).sort({"created_at":-1});
    query.exec(function(err, solutions){
        if(err){
        	callbackForSolutions(err);}else{
        		var solutionIds = _.pluck(solutions,"_id");
        		likesModel.find({"solutionId" :{$in:solutionIds}},function(err,likes){
        			for(var i=0;i<solutions.length;i++){
        				for(var j=0;j<likes.length;j++){
        					if(likes[j].solutionId == solutions[i]._id){
        						solutions[i].likes.push(likes[j]);
        					}
        				}
        				
        			}
        			callbackForSolutions(null,solutions);	
        		});
        		
        	}
        
    });
},

updateComments : function(solutionId, comment, user,callbackForComments) {
	counterModel.findByIdAndUpdate({
		_id : "commentId"
	}, {
		$inc : {
			seq : 1
		}
	}, function(error, counter) {
		if (error)
			callbackForComments("error");
		solutionModel.findById(solutionId, function(err, solution) {
			solution.comments.push({
				_id:counter.seq,
				comment : comment,
				emailId : user.emailId,
				userName : user.name,
				commentedDate:new Date()
			});

			solution.save(function(err, item) {
				if (err)
					callbackForComments("error");
				callbackForComments(null, item);
			});
		}); // end item.save
	});
},

updateIsCorrectAnswer:function(solutionObj,callbackForIsCorrectAnswer){
	solutionModel.update({"_id":solutionObj._id},{$set:{"isCorrect":solutionObj.isCorrect}},function(err,item){
		if(err)
			callbackForIsCorrectAnswer("error");
		console.log(item);
		callbackForIsCorrectAnswer(null,"updated");
	});
},
likeChallenge:function(solutionId,user,callbackForLikes){
	
	
	counterModel.findByIdAndUpdate({_id : "solutionId"}, {$inc: {seq: 1} }, function(error, counter)   {
	       if(error)
	    	   callbackForLikes(error);
	var likes = new likesModel({"_id":counter.seq,"solutionId": solutionId,"emailId": user.emailId,"name":user.name});
	   
	likes.save(function(err){
	            if(err)
	           	 callbackForLikes(err);
	            
	            callbackForLikes(null,{"_id":counter.seq,"solutionId": solutionId,"emailId": user.emailId,"name":user.name});
	        });
	});
	
},
unlikeChallenge:function(solutionId,user,callbackForUnLikes){
	
	likesModel.remove({"solutionId":solutionId,"emailId":user.emailId},function callback (err, numAffected) {
		if(err)
			callbackForUnLikes("error");
		console.log(solutionId +"solutionId deleted.");
		callbackForUnLikes(null,"deleted");
	});
}
	
}

}

module.exports=solutionService();