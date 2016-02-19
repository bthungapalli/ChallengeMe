
var checkSession =function(){

return{

 requireLogin :function(req, res, next) {
	 console.log("inside require login"+req.session.user);
	  if (!req.session.user) {
	    res.send("sessionExpired");
	  } else {
	    next();
	  }
	}


};
};


module.exports=checkSession();
