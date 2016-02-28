var catModel = require("../models/catModel.js");
var counterModel = require("../models/counterModel"); 

var categoryService =function(){

return{
	
getCategories : function(callbackForCategories){
   catModel.find(function(err,categories){
       if(err)
    	   callbackForCategories(err);
       callbackForCategories(categories);
		});
},

createOrUpdateCategories : function(categoryDetails){
		var catid;
		console.log(categoryDetails._id);
        if(categoryDetails._id !== undefined){
        console.log('came in update');
        	 var conditions = { "_id":categoryDetails._id };
        	 var update = { $set: {"name": categoryDetails.name,"description": categoryDetails.description,"updated_at":Date.now}};
        	 catModel.update(conditions, update, callback);
        	 
        	function callback (err, numAffected) {
        		console.log(numAffected + "rows updates");
        	};
        	 
        }else{
        	counterModel.findByIdAndUpdate({_id : "catId"}, {$inc: {seq: 1} }, function(error, counter)   {
   		       if(error)
   		            return next(error);
   		    catid = counter.seq;
        	var category = new catModel({"_id":counter.seq ,"name": categoryDetails.name,"description": categoryDetails.description});
        	category.save(function(err){
                if(err)
                	return err;
            });
        	});
        }
        
        return catid;
},
deleteCategory:function(categoryId,callbackForDeleteCategory){
	catModel.remove({"_id":categoryId},function callback (err, numAffected) {
		if(err)
			callbackForDeleteCategory("error:No record to delete");
		console.log(categoryId +"category deleted.");
		callbackForDeleteCategory("success:Record deleted");
	});
	
}
	
}

}

module.exports=categoryService();