/**
 * http://usejsdoc.org/
 */
var mongoose    = require('mongoose');
var counterModel     = require("./counterModel"); 
var Schema      = mongoose.Schema;


var counter = new counterModel({"_id":"catId","seq": 0});
counter.save(function(err){
    if(err)
    	return err;
});

var categorySchema = Schema({
    _id: {type: String, required: true,default:0},
    name: { type: String, required: true},
    description:{type:String},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

module.exports = mongoose.model('category', categorySchema);;