
var mongoose    = require('mongoose');
var counterModel     = require("./counterModel");
var Schema      = mongoose.Schema;


var counter = new counterModel({"_id":"likeId","seq": 0});
counter.save(function(err){
    if(err)
    	return err;
});

var likes = Schema({
	_id: {type: Number, required: true,default:0},
    typeId:{type:String,required: true}, 
    emailId : { type: String, required: true},
    name : {type:String,required: true},
    type : {type:String,required:true}
});

module.exports = mongoose.model('likes', likes);