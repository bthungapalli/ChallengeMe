var challengeMeApp=angular.module('challengeMeApp',["ui.router","angularUtils.directives.dirPagination","darthwade.loading","chart.js","ngSanitize","multipleSelect"]);

challengeMeApp.config(["$stateProvider",function($stateProvider){
	
	$stateProvider.state("/",{
		url: "/login",
		templateUrl : "angularJs/partials/login.html",
	}).state("main",{
		url: "/main",
		controller:"mainController",
		templateUrl : "angularJs/partials/main.html",
	}).state("main.dashboard",{
		url: "/dashboard",
		controller:"dashboardController",
		templateUrl : "angularJs/partials/dashboard.html",
	}).
	state("main.categories",{
		url: "/categories",
		controller:"categoriesController",
		templateUrl : "angularJs/partials/categories.html",
	}).state("main.profile",{
		url: "/profile",
		controller:"profileController",
		templateUrl : "angularJs/partials/profile.html",
	}).state("main.createChallenge",{
		url: "/postChallenge",
		templateUrl : "angularJs/partials/createChallenge.html",
	}).state("main.createLearning",{
		url: "/shareLearning",
		templateUrl : "angularJs/partials/createChallenge.html",
	}).state("main.myChallenges",{
		url: "/myPosts",
		controller:"challengesController",
		templateUrl : "angularJs/partials/challenges.html",
	}).state("main.allChallenges",{
		url: "/allPosts",
		controller:"challengesController",
		templateUrl : "angularJs/partials/challenges.html",
	}).state("main.logout",{
		url: "/",
		controller:"mainController"
	}).state("main.subcribedChallenges",{
		url: "/subcribed",
		controller:"challengesController",
		templateUrl : "angularJs/partials/challenges.html"
	}).state("main.contactUs",{
		url: "/contactUs",
		controller:"contactUsController",
		templateUrl : "angularJs/partials/contactUs.html"
	}).state("main.faq",{
		url: "/faq",
		controller:"faqController",
		templateUrl : "angularJs/partials/faq.html"
	});
	
}]);
