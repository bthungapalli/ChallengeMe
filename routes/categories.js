var express = require('express');
var router = express.Router();
var catService=require("../services/categoryService");
var checkSession=require("../services/checkSessionService");
var counterModel = require("../models/counterModel"); 
var catModel = require("../models/catModel.js");


router.get('/',checkSession.requireLogin,function (req,res,next){
	catModel.find(function(err,users)
		{
          if(err)
          		{
                console.log('Came to Error');
                res.send(err);
                }
                res.json(users);
		});
});

router.post('/',checkSession.requireLogin,function (req,res,next){
		var catid;
		var categoryDetails = req.body;
		
        if(categoryDetails.id !== undefined){
        console.log('came in update');
        	 var conditions = { "_id":categoryDetails.id };
        	 var update = { $set: {"name":req.body.name,"description":req.body.description}};
        	 catModel.update(conditions, update, callback);
        	 
        	function callback (err, numAffected) {
        		console.log(numAffected + "rows updates");
        		res.json(categoryDetails.id);
        	};
        	 
        	}else{
        			counterModel.findByIdAndUpdate({_id : "catId"}, {$inc: {seq: 1} }, function(error, counter)   {
   		       	if(error)
   		            return next(error);
   		    		catid = counter.seq;
        			var category = new catModel({"_id":counter.seq ,"name": req.body.name,"description": req.body.description});
        			category.save(function(err){
                		if(err)
                			counterModel.findByIdAndUpdate({_id : "catId"}, {$inc: {seq: -1} }, function(error, counter){});
    			        });
    			           res.json(catid);
	        		});
        	}
	
});

router.delete('/:id',checkSession.requireLogin,function (req,res,next){
        if(req.params.id !== undefined){
        console.log('came in delete');
        catModel.remove({"_id":req.params.id},callback);
        	function callback (err, numAffected) {
        		console.log(numAffected+ "rows updates");
        		}
        		  res.json("success:Record deleted");
        	}
        	else
	        	{
	        		res.json("error:No record to delete");
	        	}
   });


module.exports = router;

