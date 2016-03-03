var counterModel = require("../models/counterModel"); 
var solutionModel = require("../models/solutionModel"); 

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

getSolutionsForChallengeId:function(challengeId,callbackForSolutions){
	var query = solutionModel.find({"challengeId":challengeId}).sort({"created_at":-1});
    query.exec(function(err, solutions){
        if(err)
        	callbackForSolutions(err);
        callbackForSolutions(null,solutions);
    });
},

updateComments : function(solutionId, comment, user,
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
}
	
}

}

module.exports=solutionService();