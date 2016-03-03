var express = require('express');
var app = express();
var router = express.Router();
var http = require('http');
var userService=require("../services/userService");
var util = require('util');
var fs   = require('fs-extra');
var fileSystem = require('fs');
var  multer = require('multer');
//var busboy = require('connect-busboy');
var path = require('path');


var checkSession=require("../services/checkSessionService");
var filepath = "F:/";

router.post('/update', checkSession.requireLogin,function(request, response,next) {
	
	  userService.updateUser(request.body,function(err,updatedUser){
		  if(err)
			  response.send("Invalid");
		  request.session.user=updatedUser;
		  response.send("updated");
	  });
		
	});

   var storage =   multer.diskStorage({
	  destination: function (req, file, callback) {
		  
	    callback(null, filepath);
	  },
	  filename: function (req, file, callback) {
		  var filename = req.session.user.emailId+".jpg";
	    callback(null, filename);
	  }
	});

	var upload = multer({ storage : storage}).single('userPhoto');

	router.get('/imagePath/emailId/:emailId/number/:randomNumber',checkSession.requireLogin,function(req,res,err){
		var filename = req.params.emailId+".jpg";
		var defaultPic = "/../public/images/defaultphoto.jpg";
		var absolutePath = filepath+filename;
		
		/*fs.access(absolutePath, fs.R_OK | fs.W_OK, function(err) {
			if (!err) { 
				res.sendFile(path.resolve(absolutePath));
				} else{
					res.sendFile(path.resolve(__dirname+defaultPic));
					}
				});*/
		
		/*if(fileSystem.existsSync(path.resolve(absolutePath))){
			console.log("inside exist");
			res.sendFile(path.resolve(absolutePath));
		}else{
			console.log("inside not exist");
			res.sendFile(path.resolve(__dirname+defaultPic));
		}*/
		
		try{
			var fd=fileSystem.openSync(path.resolve(absolutePath),'r');
			fileSystem.closeSync(fd);
			res.sendFile(path.resolve(absolutePath));
		}catch(err){
			res.sendFile(path.resolve(__dirname+defaultPic));
		}
		
			});
	
	router.post('/upload',checkSession.requireLogin,function(req,res){
	    upload(req,res,function(user,err) {
	        if(err) {
	            return res.end("Error uploading file.");
	        }
	        var filename = req.session.user.emailId+".jpg";
	        	return res.send("<div  class='ui segment' id='profileImage'> <img  class='ui centered medium image' src='/profile/imagePath'></div>");
	    });
	});

module.exports = router;
