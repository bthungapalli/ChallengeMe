
var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var likes = Schema({
    solutionId:{type:String,required: true}, 
    emailId : { type: String, required: true},
    name : {type:String,required: true}
});




module.exports = mongoose.model('likes', likes);