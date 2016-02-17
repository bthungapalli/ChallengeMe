var catModel = require("../models/catModel.js");
var counterModel = require("../models/counterModel"); 

var categoryService =function(){

return{
	fetchCategories : function(){
    var query = catModel.find();
    query.exec(function(err, categories){
        if(err)
            res.send(err);
        if(categories!==null){
        	  return categories;
        }else{
        	res.send("No categories found");
        }
      
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
    }
	
}

}

module.exports=categoryService();