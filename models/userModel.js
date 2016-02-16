var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;
var counterModel     = require("./counterModel"); 

var counter = new counterModel({"_id":"userId","seq": 0});
counter.save(function(err){
    if(err)
    	return err;
});

var UserSchema = new Schema({
	_id:{type: Number, required: true,default:0},
    username: {type: String, required: true},
    name:{type: String, required: true},
    emailId: {type: String, required: true},
    title:{type: String},
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

    now = new Date();
    this.updated_at = now;
    if(!this.created_at) {
        this.created_at = now
    }
    next();
});

module.exports = mongoose.model('users', UserSchema);