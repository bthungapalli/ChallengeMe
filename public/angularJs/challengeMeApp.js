var challengeMeApp=angular.module('challengeMeApp',["ui.router","angularUtils.directives.dirPagination"]);

challengeMeApp.config(["$stateProvider",function($stateProvider){
	
	$stateProvider.state("/",{
		url: "/login",
		templateUrl : "angularjs/partials/login.html",
	}).state("main",{
		url: "/main",
		controller:"mainController",
		templateUrl : "angularjs/partials/main.html",
	}).state("main.categories",{
		url: "/categories",
		controller:"categoriesController",
		templateUrl : "angularjs/partials/categories.html",
	}).state("main.profile",{
		url: "/profile",
		controller:"profileController",
		templateUrl : "angularjs/partials/profile.html",
	}).state("main.createChallenge",{
		url: "/createChallenge",
		controller:"createChallengeController",
		templateUrl : "angularjs/partials/createChallenge.html",
	}).state("main.myChallenges",{
		url: "/myChallenges",
		controller:"challengesController",
		templateUrl : "angularjs/partials/challenges.html",
	}).state("main.allChallenges",{
		url: "/allChallenges",
		controller:"challengesController",
		templateUrl : "angularjs/partials/challenges.html",
	}).state("main.logout",{
		url: "/",
		controller:"mainController"
	}).state("main.subcribedChallenges",{
		url: "/subcribed",
		controller:"challengesController",
		templateUrl : "angularjs/partials/challenges.html"
	}).state("main.contactUs",{
		url: "/contactUs",
		controller:"contactUsController",
		templateUrl : "angularjs/partials/contactUs.html"
	});
	
}]);
