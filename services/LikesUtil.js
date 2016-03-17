/**
 * http://usejsdoc.org/
 */

var likesModel = require("../models/likesModel"); 
var _ = require('underscore');

var likesUtil =function(){

return{
	
	fetchLikes : function(challenges,callbackForLikes){
		var challengeIds = _.pluck(challenges,"_id");
		likesModel.find({"typeId" :{$in:challengeIds}},function(err,likes){
			for(var i=0;i<challenges.length;i++){
				for(var j=0;j<likes.length;j++){
					if(likes[j].typeId == challenges[i]._id && likes[j].type === 'C'){
						challenges[i].likes.push(likes[j]);
								}
							}
						}
				callbackForLikes(null,challenges);
				})
			
			}
		}	
	}	
module.exports=likesUtil();