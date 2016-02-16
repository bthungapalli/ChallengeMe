var userModel=require("../models/userModel.js");
var counterModel     = require("../models/counterModel"); 

var userService =function(){

return{

createOrSaveUser : function(userDetails){
	
    var query = userModel.findOne({"emailId":userDetails.emailId});
    query.exec(function(err, users){
        if(err)
            res.send(err);
        
        var user ;
        if(users!==null){
        	 var conditions = { "_id":users._id };
        	 var update = { $set: {"username": userDetails.username,"name": userDetails.name,"emailId":userDetails.emailId ,"title":userDetails.title,"empId":userDetails.empId,"phone":userDetails.phone,"workPhone":userDetails.workPhone,"location":userDetails.location,"businessUnit":userDetails.businessUnit,"adminIndicator":userDetails.adminIndicator }};
        	 userModel.update(conditions, update, callback);

        	function callback (err, numAffected) {
        		console.log(numAffected + "rows updates");
        	};
        	 
        }else{
        	counterModel.findByIdAndUpdate({_id : "userId"}, {$inc: {seq: 1} }, function(error, counter)   {
  		       if(error)
  		            return next(error);
  		       
  		      user = new userModel({"_id":counter.seq ,"username": userDetails.username,"name": userDetails.name,"emailId":userDetails.emailId ,"title":userDetails.title,"empId":userDetails.empId,"phone":userDetails.phone,"workPhone":userDetails.workPhone,"location":userDetails.location,"businessUnit":userDetails.businessUnit,"adminIndicator":userDetails.adminIndicator});
  		      user.save(function(err){
                if(err)
                	return err;
            });
  		      
        	});
        }
        return users;
    });
    
}

};

};


module.exports=userService();