var userModel=require("../models/userModel.js");

var userService =function(){

return{

createOrSaveUser : function(userDetails){
	
    var query = userModel.findOne({"emailId":userDetails.emailId});
    query.exec(function(err, users){
        if(err)
            res.send(err);
      //  if(users.length===0){
        var user ;
        if(users!==null){
        	 user = new userModel({"_id":users._id,"username": userDetails.username,"name": userDetails.name,"emailId":userDetails.emailId ,"title":userDetails.title,"empId":userDetails.empId,"phone":userDetails.phone,"workPhone":userDetails.workPhone,"location":userDetails.location,"businessUnit":userDetails.businessUnit,"adminIndicator":userDetails.adminIndicator});
        }else{
        	 user = new userModel({"username": userDetails.username,"name": userDetails.name,"emailId":userDetails.emailId ,"title":userDetails.title,"empId":userDetails.empId,"phone":userDetails.phone,"workPhone":userDetails.workPhone,"location":userDetails.location,"businessUnit":userDetails.businessUnit,"adminIndicator":userDetails.adminIndicator});
        }
        	
            user.save(function(err){
                if(err)
                	return err;
            });
        //}

        return users;
    });
    
}

};

};


module.exports=userService();