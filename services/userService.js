var userModel=require("../models/userModel");
var counterModel     = require("../models/counterModel"); 

var userService =function(){

return{

createOrSaveUser : function(userDetails,callback){
	
    var query = userModel.findOne({"emailId":userDetails.emailId});
    query.exec(function(err, users){
        if(err)
           callback(err);
        
        var user ;
        if(users!==null){
        	 var conditions = { "_id":users._id }; 
        	 var update = { $set: {"username": userDetails.username,"name": userDetails.name,"emailId":userDetails.emailId ,"title":userDetails.title,"phone":userDetails.phone,"businessUnit":userDetails.businessUnit,"adminIndicator":userDetails.adminIndicator }};
        	 userModel.update(conditions, update, callback1);

        	function callback1 (err, numAffected) {
        		console.log(numAffected + "rows updates");
        	};
        	 
        }else{
        	counterModel.findByIdAndUpdate({_id : "userId"}, {$inc: {seq: 1} }, function(error, counter)   {
  		       if(error)
  		            callback(error);
  		       
  		      user = new userModel({"_id":counter.seq ,"username": userDetails.username,"name": userDetails.name,"emailId":userDetails.emailId ,"title":userDetails.title,"phone":userDetails.phone,"businessUnit":userDetails.businessUnit,"adminIndicator":userDetails.adminIndicator});
  		      user.save(function(err){
                if(err)
                	callback(err);
                
                var query = userModel.findOne({"emailId":userDetails.emailId});
                query.exec(function(err, newUser){
                    if(err)
                    	callback(err);
                    callback(null,newUser);
                });
              });
        	});
        }
         callback(null,users);
    });
    
}



};
};


module.exports=userService();


/*exports.createOrSaveUser=function(userDetails,callback){
	
    var query = userModel.findOne({"emailId":userDetails.emailId});
    
    query.exec(function(err, users){
        if(err)
        	  callback(err);
        
        var user ;
        if(users!==null){
        	 var conditions = { "_id":users._id }; 
        	 var update = { $set: {"username": userDetails.username,"name": userDetails.name,"emailId":userDetails.emailId ,"title":userDetails.title,"phone":userDetails.phone,"businessUnit":userDetails.businessUnit,"adminIndicator":userDetails.adminIndicator }};
        	 userModel.update(conditions, update, callback1);

        	function callback1 (err, numAffected) {
        		console.log(numAffected + "rows updates");
        	};
        	 
        }else{
        	counterModel.findByIdAndUpdate({_id : "userId"}, {$inc: {seq: 1} }, function(error, counter)   {
  		       if(error)
  		            callback(err);
  		       
  		      user = new userModel({"_id":counter.seq ,"username": userDetails.username,"name": userDetails.name,"emailId":userDetails.emailId ,"title":userDetails.title,"phone":userDetails.phone,"businessUnit":userDetails.businessUnit,"adminIndicator":userDetails.adminIndicator});
  		      user.save(function(err){
                if(err)
                	 callback(err);
                
                var query1 = userModel.findOne({"emailId":userDetails.emailId});
                query1.exec(function(err, newUser){
                    if(err)
                     callback(err);
                    callback(null,newUser);
                });
              });
        	});
        }
        callback(null,users);
    });
    
	};*/

	