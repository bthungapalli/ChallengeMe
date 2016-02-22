
var mongoose    = require('mongoose');
var counterModel     = require("./counterModel"); 
var categorySchema = require("./catModel").schema;
var Schema      = mongoose.Schema;


var counter = new counterModel({"_id":"challengeId","seq": 0});
counter.save(function(err){
    if(err)
    	return err;
});

var challengeSchema = Schema({
    _id: {type: Number, required: true,default:0},
    description:{type:String,required: true},
    title:{type:String,required: true},
    date:{type:String,required: true},
    prize:{type:String},
    status:{type:String,required: true},
    categories : [categorySchema],
    createdByEmailId:{type:String,required: true},
    createdBy:{type:String,required: true},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now},
    solutions: {type: Array}
});

module.exports = mongoose.model('challenge', challengeSchema);;