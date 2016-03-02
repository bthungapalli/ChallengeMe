
var mongoose    = require('mongoose');
var counterModel     = require("./counterModel"); 
var Schema      = mongoose.Schema;

var counter = new counterModel({"_id":"commentId","seq": 0});
counter.save(function(err){
    if(err)
    	return err;
});

var comments = Schema({
    _id: {type: Number, required: true,default:0},
    userName:{type:String,required: true}, 
    comment : { type: String, required: true}
});




module.exports = mongoose.model('comments', comments);