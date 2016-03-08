var express = require('express');
var router = express.Router();
var categoryService=require("../services/categoryService");
var checkSession=require("../services/checkSessionService");


router.get('/',checkSession.requireLogin,function (req,res,next){
	 console.log('came in get categories');
	categoryService.getCategories(function(err,categories){
		if(err)
    		res.send("error");
		 res.json(categories);
	});
});

router.post('/',checkSession.requireLogin,function (req,res,next){
		var categoryDetails = req.body;
		categoryService.createOrUpdateCategories(categoryDetails,function(err,categoryId){
			if(err)
        		res.send("error");
			res.json(categoryId);
		});
});

router.delete('/:id',checkSession.requireLogin,function (req,res,next){
        console.log('came in delete');
        categoryService.deleteCategory(req.params.id,function(err,response){
        	if(err)
        		res.send("error");
        	res.json(response);
        });
   });


module.exports = router;

