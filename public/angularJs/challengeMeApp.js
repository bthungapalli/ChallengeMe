var challengeMeApp=angular.module('challengeMeApp',["ui.router"]);

challengeMeApp.config(["$stateProvider",function($stateProvider){
	
	$stateProvider.state("/",{
		url: "/login",
		controller:"loginController",
		templateUrl : "angularjs/partials/login.html",
	}).state("categories",{
		url: "/categories",
		controller:"categoriesController",
		templateUrl : "angularjs/partials/categories.html",
	});
	
}]);
