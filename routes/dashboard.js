var express = require('express');
var app = express();
var router = express.Router();
var dashboardService=require("../services/dashboardService");
//var util = require('util');
var _ = require('underscore');

//All the Dashboard request comes here.
var checkSession=require("../services/checkSessionService");

	router.get('/byIntrest',checkSession.requireLogin,function(req,res,err){
		dashboardService.getChallengesByIntrest(function(err,data){
			if(err){
				console.log("Err",err);
				res.send("error");
			}
			else{
			var keys = _.pluck(data,'_id');
			var count = _.pluck(data,'count');
			var body = [];
			body.push(keys);
			body.push(count);
			res.send(body);
			}
		});
		
			});
	
	router.get('/lastsixmonths',checkSession.requireLogin,function(req,res,err){
		dashboardService.getLastSixMonths(function(err,data){
			if(err){
				console.log("Err",err);
				res.send("error");
			}
			else{
				var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun",
				                   "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
			var id = _.pluck(data,"_id").reverse().slice(0,6);
			var learnings =_.pluck(data,'learnings').reverse().slice(0,6);
			var challenges =_.pluck(data,'challenges').reverse().slice(0,6);
			var dates = [];
			var body=[];
			for(var i=0;i<id.length;i++)
			{
				var month = monthNames[(id[i].month)-1];
				dates.push((month+'-'+id[i].year));
			}
			body.push(dates);
			body.push(learnings);
			body.push(challenges);
			res.send(body);
			}
		});
		
	});
	
	router.get('/stats',checkSession.requireLogin,function(req,res,err){
		var counts = []
		var openedCount;
		dashboardService.getStats(function(err,data){
			if(err){
				console.log("Err",err);
				res.send("error");
			}
			else{
			var time = new Date().getTime() - 1 * 24 * 60 * 60 * 1000;
			console.log("data::"+data.length);
			
			openedCount = _.filter(data, function(challenge){ 
				return new Date(challenge.date).getTime() >= time;
			});
			var closedCount = data.length - openedCount.length;
			counts.push(openedCount.length);
			counts.push(closedCount);
			res.send(counts);
			}
		});
		
			});
	
	router.get('/userCount',checkSession.requireLogin,function(req,res,err){
		dashboardService.getUserCount(function(err,data){
			if(err){
				console.log("Err",err);
				res.send("error");
			}
			else{
				res.json(data);
			}
		});
		
			});	
	
	router.get('/CLStats',checkSession.requireLogin,function(req,res,err){
		dashboardService.getCLStats(function(err,data){
			if(err){
				console.log("Err",err);
				res.send("error");
			}
			else{
			var keys = _.pluck(data,'_id');
			var count = _.pluck(data,'count');
			var body = [];
			body.push(keys);
			body.push(count);
			res.send(body);
			}
		});
		
			});
	
	router.get('/solutionCount',checkSession.requireLogin,function(req,res,err){
		dashboardService.getSolutionsCount(function(err,data){
			if(err){
				console.log("Err",err);
				res.send("error");
			}
			else{
				res.json(data);
			}
		});
		
			});	
	
	router.get('/getBUData',checkSession.requireLogin,function(req,res,err){
		dashboardService.getBUData(function(err,data){
			if(err){
				console.log("Err",err);
				res.send("error");
			}
			else{
				var locations = _.pluck(data,'_id');
				var challenges = _.pluck(data,'challenges');
				var learnings = _.pluck(data,'learnings');
				var body = [];
				body.push(locations);
				body.push(challenges);
				body.push(learnings);
				res.send(body);
			}
		});
		
			});
	
	router.get('/topUsers',checkSession.requireLogin,function(req,res,err){
		dashboardService.getTopUsersFromChallenges(function(err,challenges){
			if(err){
				console.log("Err",err);
				res.send("error");
			}
			else{
				dashboardService.getTopUsersFromSolutions(function(err,solutions){
					if(err){
						console.log("Err",err);
						res.send("error");
					}
				else{
					for (var prop in solutions) {
							var a= _.findWhere(challenges,{"_id":solutions[prop]._id});
							if(a !== undefined){
							solutions[prop].count=solutions[prop].count+a.count
							}
						}

						for (var prop in challenges) {
							var a= _.findWhere(solutions,{"_id":solutions[prop]._id})
							if(a === undefined){
							solutions.push(a);
							}
						}	
					res.send(_.first(_.pluck(_.sortBy(solutions,"count").reverse(),'_id'),10));
					}
				})
			}
		});
		
			});
	

module.exports = router;
