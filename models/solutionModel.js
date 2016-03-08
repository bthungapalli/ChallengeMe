
var mongoose    = require('mongoose');
var counterModel     = require("./counterModel"); 
var Schema      = mongoose.Schema;


var counter = new counterModel({"_id":"solutionId","seq": 0});
counter.save(function(err){
    if(err)
    	return err;
});

var solutionSchema = Schema({
    _id: {type: Number, required: true,default:0},
    challengeId: {type: Number, required: true},
    solution:{type:String,required: true},
    anonymous  :{type:Boolean,required: true,default: false},
    status:{type:String,required: true},
    solutionByEmailId:{type:String,required: true},
    solutionBy:{type:String,required: true},
    comments :{type: Array},
    likes :{type:Array},
    isCorrect:{type:Boolean,default: false},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

module.exports = mongoose.model('solution', solutionSchema);;