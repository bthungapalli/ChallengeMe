var challengeModel = require("../models/challengeModel");
var solutionsModel = require("../models/solutionModel");
var userModel = require("../models/userModel");
var date = require('../utils/date.js');


var dashboardService = function() {

	return {
		getChallengesByIntrest : function(callback) {
			challengeModel.aggregate([ {
				$group : {
					_id : '$categories.name', //$region is the column name in collection
					count : {
						$sum : 1
					}
				}
			} ], function(err, result) {
				if (err) {
					callback(err);
				} else {
					callback(null,result);
				}
			});

		},
		getLastSixMonths : function(callback) {
			var time = new Date().getTime() - 200 * 24 * 60 * 60 * 1000;
			challengeModel.aggregate(
				[
				 { $match: {$and : [{created_at: {$gte: new Date(time)}},{status:'create'},{learning:false}]}},
				 	{ $sort: {'created_at': -1}},
				 	//,
				{ $group : { 
			           _id : {year: { $year : "$created_at" }, month: { $month : "$created_at" }}, 
			           count : { $sum : 1 }
			           }
				}  
			
			],function(err, result) {
				if (err) {
					callback(err);
				} else {
					callback(null,result);
				}
			});

		},
		
	getStats : function(callbackStats){
		var query = challengeModel.find({status:'create'},{learning:false}).sort({"created_at":-1});
	    query.exec(function(err, challenges){
	    	if(err){
		    	   console.log("error:"+error);
		    	   callbackStats("error");
		       }
	    	callbackStats(null,challenges);
	    });
	},
		
		getUserCount:function(callbackUserCount){
		 userModel.count({},function(err,result){
				if (err) {
					callbackUserCount(err);
				} else {
					callbackUserCount(null,result);
				}
			
			});
		 
	 }
		}
	}
module.exports=dashboardService();