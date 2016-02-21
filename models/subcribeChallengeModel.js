
var mongoose    = require('mongoose');
var counterModel     = require("./counterModel"); 
var Schema      = mongoose.Schema;


var counter = new counterModel({"_id":"subcribeChallengeId","seq": 0});
counter.save(function(err){
    if(err)
    	return err;
});

var subcribeChallengeSchema = Schema({
    _id: {type: Number, required: true,default:0},
    challengeId:{type:Number,required: true},
    emailId:{type:String,required: true},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

module.exports = mongoose.model('subcribe', subcribeChallengeSchema);;