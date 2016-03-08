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
			var dt = new Date().getTime();
			console.log("Date::::",dt);
		console.log("parsed::::",Date.parseExact('03/10/2016', "MM/dd/yyyy").getTime());;
			challengeModel.aggregate([
					{ 
						"$group": {
						"_id":null,
						 "opened": { $sum: {$cond: [ { $gte: [ Date.parseExact('$date', "MM/dd/yyyy").getTime(), dt ] }, 1, 0 ]}}
//					    "opened": { "$sum": {$cond:{ $gte: [Date.parseExact("$date", "MM/dd/yyyy").getTime() , dt] ,1,0 } }}
					   // "closed": { "$sum": {$cond: { if: { $lt: [ Date.parseExact("$date", "MM/dd/yyyy").getTime(),dt] }, then: 1, else: 0 }}}
							}  
					}
			], function(err,result){
				if (err) {
					callbackStats(err);
				} else {
					callbackStats(null,result);
				}
			
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