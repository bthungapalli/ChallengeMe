var express = require('express');
var router = express.Router();
var categoryService=require("../services/categoryService");
var checkSession=require("../services/checkSessionService");


router.get('/',checkSession.requireLogin,function (req,res,next){
	 console.log('came in get categories');
	categoryService.getCategories(function(categories){
		 res.json(categories);
	});
});

router.post('/',checkSession.requireLogin,function (req,res,next){
		var categoryDetails = req.body;
		categoryService.createOrUpdateCategories(categoryDetails,function(categoryId){
			res.json(categoryId);
		});
});

router.delete('/:id',checkSession.requireLogin,function (req,res,next){
        console.log('came in delete');
        categoryService.deleteCategory(req.params.id,function(response){
        	res.json(response);
        });
   });


module.exports = router;

