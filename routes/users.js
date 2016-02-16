var express = require('express');
var app = express();
var router = express.Router();
var http = require('http');

var optionsget = {
	host : 'impact.osius.com', // here only the domain name
	path : '/api/user/login', // the rest of the url with parameters if needed
	method : 'GET',
	headers : {
		'Authorization' : 'Basic '
				+ new Buffer('bthungapalli@osius.com' + ':' + 'Eeshu@05')
						.toString('base64')
	}
};

/* GET users listing. */
router.get('/login', function(req, res,next) {
	var body = "";
	var reqGet = http.request(optionsget, function(response) {
		console.log("statusCode: ", response.statusCode);
		response.on("data", function(d) {
			body += d;
			reqGet.write(body);
		});
	});
	

	reqGet.end();
	reqGet.on('error', function(e) {
		console.error(e);
	});

	
	res.json(body);
	
});

module.exports = router;
