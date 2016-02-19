var express = require('express');
var router = express.Router();
var http = require('http');
var userService=require("../services/userService");

router.get('/', function(req, res, next) {
  res.sendFile('index.html');
});

router.post('/authenticate', function(request, response,next) {
	var optionsget = {
			host : 'impact.osius.com',
			path : '/api/user/login', 
			method : 'GET',
			headers : {
			'Authorization' : 'Basic '
			+ new Buffer(request.body.userName + ':' + request.body.password)
			.toString('base64')
			}
			};

	var resBody = '';
	var req = http.request(optionsget, function(res) {
		  res.setEncoding('utf8');
		  res.on('data', function(chunk){
			  resBody += chunk;
		  });
		  res.on('end', function(){
			 var resBodyJson=  JSON.parse(resBody);
			  userService.createOrSaveUser(resBodyJson.user.principal,request.body.categories,function(err,userDetails){
				  if(err)
					  response.send("Invalid");
				  request.session.user = userDetails;
				  response.send(userDetails);
			  });
		  });
		});

		req.on('error', function(e){
		  console.log("problem with request :"+e.message);
		  response.send("Not able to access server");
		});

		req.end();
	});

router.get('/logout', function(request, response) {
	request.session.reset();
	console.log("logout.."+ request.session.user)
	response.send('logout');
	});

module.exports = router;
