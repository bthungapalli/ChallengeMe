var express = require('express');
var router = express.Router();
var http = require('http');
var userService=require("../services/userService");
var formidable = require('formidable');
var util = require('util');
var fs   = require('fs-extra');

router.post('/update', function(request, response,next) {

	  userService.updateUser(request.body,function(err,rows){
		  if(err)
			  response.send("Invalid");
		  response.send("updated");
	  });
		
	});


router.post('/file-upload', function (req, res){
	  var form = new formidable.IncomingForm();
	  form.parse(req, function(err, fields, files) {
	    res.writeHead(200, {'content-type': 'text/plain'});
	    res.write('received upload:\n\n');
	    res.end(util.inspect({fields: fields, files: files}));
	  });

	  form.on('end', function(fields, files) {
	    /* Temporary location of our uploaded file */
	    var temp_path = this.openedFiles[0].path;
	    /* The file name of the uploaded file */
	    var file_name = this.openedFiles[0].name;
	    /* Location where we want to copy the uploaded file */
	    var new_location = 'uploads/';

	    fs.copy(temp_path, new_location + file_name, function(err) {  
	      if (err) {
	        console.error(err);
	      } else {
	        console.log("success!")
	      }
	    });
	  });
	});


module.exports = router;
