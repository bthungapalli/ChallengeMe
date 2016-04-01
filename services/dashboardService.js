var challengeModel = require("../models/challengeModel");
var solutionsModel = require("../models/solutionModel");
var userModel = require("../models/userModel");

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
			challengeModel.aggregate([
					{ "$group": {
						"_id":null,
					    "opened": { "$sum": {$cond: [ { $gte: [ new Date("$date").getTime(), new Date().getTime() ] },1,0 ]} },
					    "closed": { "$sum": {$cond: [ { $lt: [ new Date("$date").getTime(), new Date().getTime() ] },1,0 ]} }
					}  
					}
			], function(err,result){
				if (err) {
					callbackStats(err);
				} else {
					callbackStats(null,result);
				}
			
			});
			}
		}
	}
module.exports=dashboardService();