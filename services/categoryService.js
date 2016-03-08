var catModel = require("../models/catModel.js");
var counterModel = require("../models/counterModel"); 
var userModel=require("../models/userModel");
var challengeModel=require("../models/challengeModel");
var categoryService =function(){

return{
	
getCategories : function(callbackForCategories){
   catModel.find(function(err,categories){
       if(err)
    	   callbackForCategories("error");
       callbackForCategories(null,categories);
		}).sort({"created_at":-1});
},

createOrUpdateCategories : function(categoryDetails,callbackForCreateOrUpdateCategories){
		var catId;
		console.log(categoryDetails._id);
        if(categoryDetails._id !== undefined){
        console.log('came in update');
        	 var conditions = { "_id":categoryDetails._id };
        	 var update = { $set: {"name": categoryDetails.name,"description": categoryDetails.description}};
        	 catModel.update(conditions, update, function callback (err, numAffected) {
        		 if(err)
        			 callbackForCreateOrUpdateCategories("error");
         		console.log(numAffected.n + "rows updates");
         		userModel.update( {"categories._id":categoryDetails._id},{$set:{"categories.$.name":categoryDetails.name}},{multi:true},function(err, numAffected){
         			 if(err)
            			 callbackForCreateOrUpdateCategories("error");
             		challengeModel.update({"mailGroups._id":categoryDetails._id},{$set:{"mailGroups.$.name":categoryDetails.name}},{multi:true},function(err,numAffected){
             			console.log("err:"+err);
             			console.log("numAffected:"+numAffected);
             			console.log("inside mailgroupos")
             		});
             		challengeModel.update({"categories._id":categoryDetails._id},{$set:{"categories.name":categoryDetails.name}},{multi:true},function(err,numAffected){
             			console.log("err:"+err);
             			console.log("numAffected:"+numAffected);
             			console.log("inside categ")
             		});
             		console.log("updated user model as well");
             		callbackForCreateOrUpdateCategories(null,categoryDetails._id );
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
                callbackForCreateOrUpdateCategories(null,catId);
        	});
        });
        }
},
deleteCategory:function(categoryId,callbackForDeleteCategory){
	catModel.remove({"_id":categoryId},function callback (err, numAffected) {
		if(err)
			callbackForDeleteCategory("error");
		console.log(categoryId +"category deleted.");
		callbackForDeleteCategory(null,"success:Record deleted");
	});
	
},
getEmailIdsForCategories:function(categories,callbackFoEmailIdsForCategories){

	userModel.find({"categories.name":{$in:categories}},{"emailId":1,"_id":0},function(err,emailIds){
		 if(err){
		    	   console.log("error:"+error);
		    	   callbackFoEmailIdsForCategories(error);
		       }
		callbackFoEmailIdsForCategories(null,emailIds);
	});

}

	
}

}

module.exports=categoryService();