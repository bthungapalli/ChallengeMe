var challengeMeApp=angular.module('challengeMeApp',["ui.router"]);

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
	});
	
}]);
