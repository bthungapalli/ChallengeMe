var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;
var counterModel     = require("./counterModel"); 

var counter = new counterModel({"_id":"userId","username": 0});
counter.save(function(err){
    if(err)
    	return err;
});

var UserSchema = new Schema({
	_id:{type: Number, required: true,default:0},
    username: {type: String, required: true},
    name:{type: String, required: true},
    emailId: {type: String, required: true},
    title:{type: String, required: true},
    empId: {type: String, required: false},
    phone:{type: String, required: false},
    workPhone:{type: String, required: false},
    location: {type: String, required: false},
    businessUnit:{type: String, required: false},
    adminIndicator:{type: String, required: true},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});



    UserSchema.pre('save', function(next){
	if(this._id===0){
		
		/* var query = counterModel.find({_id : "userId"});
		    query.exec(function(err, counter){
		    	 console.log("counter:"+counter.toString());
		    });*/
		
		counterModel.findByIdAndUpdate({"_id" : "userId"}, {$inc: {seq: 1} }, function(error, counter)   {
			  console.log("counter:"+counter.toString());
		       if(error)
		            return next(error);
		        this._id = counter.seq;
		    });
	}
  
    now = new Date();
    this.updated_at = now;
    if(!this.created_at) {
        this.created_at = now
    }
    next();
});

module.exports = mongoose.model('users', UserSchema);