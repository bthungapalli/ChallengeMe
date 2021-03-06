var express = require('express');
var router = express.Router();
var http = require('http');
var userService=require("../services/userService");
var checkSession=require("../services/checkSessionService");
var nconf = require('nconf');

router.get('/', function(req, res, next) {
  res.sendFile('index.html');
});

router.post('/authenticate', function(request, response,next) {
	var optionsget = {
			host : nconf.get('impact').URL,
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
			  var resBodyJson;
			  try {
				   resBodyJson=  JSON.parse(resBody);
				   console.log("resBodyJson.user.principal"+resBodyJson.user.principal)
				   userService.createOrSaveUser(resBodyJson.user.principal,request.body.categories,function(err,userDetails){
						  if(err)
							  response.send("Invalid");
						  request.session.user = userDetails;
						  console.log("UserDetails::",userDetails);
						  response.send(userDetails);
					  });
				}
				catch(err) {
					console.log("Error:::",err);
					  response.send("Invalid Credentials");
				}
			 
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

router.get('/userDetails',checkSession.requireLogin, function(request, response) {
	response.send(request.session.user);
	});

module.exports = router;
