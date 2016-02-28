var catModel = require("../models/catModel.js");
var counterModel = require("../models/counterModel"); 
var userModel=require("../models/userModel");
var categoryService =function(){

return{
	
getCategories : function(callbackForCategories){
   catModel.find(function(err,categories){
       if(err)
    	   callbackForCategories(err);
       callbackForCategories(categories);
		});
},

createOrUpdateCategories : function(categoryDetails,callbackForCreateOrUpdateCategories){
		var catId;
		console.log(categoryDetails._id);
        if(categoryDetails._id !== undefined){
        console.log('came in update');
        	 var conditions = { "_id":categoryDetails._id };
        	 var update = { $set: {"name": categoryDetails.name,"description": categoryDetails.description}};
        	 catModel.update(conditions, update, function callback (err, numAffected) {
         		console.log(numAffected.n + "rows updates");
         		userModel.update( {"categories._id":categoryDetails._id},{$set:{"categories.$.name":categoryDetails.name}},{multi:true},function(err, numAffected){
             		console.log("updated user model as well");
             		callbackForCreateOrUpdateCategories(categoryDetails._id );
         		});
         	});
        	 
        }else{
        	counterModel.findByIdAndUpdate({_id : "catId"}, {$inc: {seq: 1} }, function(error, counter)   {
   		       if(error)
   		    	callbackForCreateOrUpdateCategories("error");
   		    catId = counter.seq;
        	var category = new catModel({"_id":counter.seq ,"name": categoryDetails.name,"description": categoryDetails.description});
        	category.save(function(err){
                if(err)
                	counterModel.findByIdAndUpdate({_id : "catId"}, {$inc: {seq: -1} }, function(error, counter){});
                callbackForCreateOrUpdateCategories(catId);
        	});
        });
        }
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