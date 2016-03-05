var challengeModel = require("../models/challengeModel");

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
//			var time = new Date().getTime() - 180 * 24 * 60 * 60 * 1000;
			challengeModel.aggregate(
					
//        	   { $limit: 6
//	           },
//	           	{
//	        	   $sort: {
//	               'created_at': -1
//	               }
//	           },
				[ {
				$group : { 
			           _id : {year: { $year : "$created_at" }, month: { $month : "$created_at" }}, 
			           count : { $sum : 1 }
			           }
			           
			}],function(err, result) {
				if (err) {
					callback(err);
				} else {
					callback(null,result);
				}
			});

		}	
		

	}

}

module.exports=dashboardService();