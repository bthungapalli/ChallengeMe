var express = require('express');
var app = express();
var router = express.Router();
var http = require('http');
var userService=require("../services/userService");
var formidable = require('formidable');
var util = require('util');
var fs   = require('fs-extra');
var  multer = require('multer');
var busboy = require('connect-busboy');
var path = require('path');


var checkSession=require("../services/checkSessionService");
var filepath = "/Users/bthungapalli/Documents/uploads/";

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

	router.get('/imagePath',checkSession.requireLogin,function(req,res,err){
		var filename = req.session.user.emailId+".jpg";
		var defaultPic = "/../public/images/defaultphoto.jpg";
		var absolutePath = filepath+filename;
		
		fs.access(absolutePath, fs.R_OK | fs.W_OK, function(err) {
			if (!err) { 
				res.sendFile(path.resolve(absolutePath));
				} else{
					res.sendFile(path.resolve(__dirname+defaultPic));
					}
				});
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






/*router.post('/upload',function (req, res, next) {

    var fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
        console.log("Uploading: " + filename);

        //Path where image will be uploaded
        var path = "/Users/bthungapalli/Documents/uploads/";
        console.log("Path::",path);
        fstream = fs.createWriteStream(path + filename);
        file.pipe(fstream);
        fstream.on('close', function () {    
            console.log("Upload Finished of " + filename);     
            res.json("uploading Finished");
        });
    });
});*/
/*
router.post('/file-upload', function (req, res){
	  var form = new formidable.IncomingForm();
	  form.parse(req, function(err, fields, files) {
	    res.writeHead(200, {'content-type': 'text/plain'});
	    res.write('received upload:\n\n');
	    res.end(util.inspect({fields: fields, files: files}));
	  });

	  form.on('end', function(fields, files) {
	     Temporary location of our uploaded file 
	    var temp_path = this.openedFiles[0].path;
	     The file name of the uploaded file 
	    var file_name = this.openedFiles[0].name;
	     Location where we want to copy the uploaded file 
	    var new_location = 'uploads/';

	    fs.copy(temp_path, new_location + file_name, function(err) {  
	      if (err) {
	        console.error(err);
	      } else {
	        console.log("success!")
	      }
	    });
	  });
	});*/


module.exports = router;
