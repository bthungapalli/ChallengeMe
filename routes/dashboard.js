var express = require('express');
var app = express();
var router = express.Router();
var dashboardService=require("../services/dashboardService");
//var util = require('util');
var _ = require('underscore');


var checkSession=require("../services/checkSessionService");

	router.get('/byIntrest',checkSession.requireLogin,function(req,res,err){
		dashboardService.getChallengesByIntrest(function(err,data){
			if(err){
				console.log("Err",err);
				res.send("error);
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
			var count =_.pluck(data,'count').reverse().slice(0,6);
			var dates = [];
			var body=[];
			for(var i=0;i<id.length;i++)
			{
				var month = monthNames[(id[i].month)-1];
				dates.push((month+'-'+id[i].year));
			}
			body.push(dates);
			body.push(count);
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

module.exports = router;
