var express = require('express');
var router = express.Router();
var http = require('http');
var locationModel=require("../models/locationModel");

router.get('/',function (req,res,next){
	locationModel.find(function(err,locations){
          if(err)
                res.send(err);
                res.json(locations);
		});
});

module.exports = router;
