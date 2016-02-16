var challengeMeApp=angular.module('challengeMeApp',["ui.router"]);

challengeMeApp.config(["$stateProvider",function($stateProvider){
	
	$stateProvider.state("/",{
		url: "/login",
		controller:"loginController",
		templateUrl : "angularjs/partials/login.html",
	}).state("dashBoard",{
		url: "/dashBoard",
		templateUrl : "angularjs/partials/dashBoard.html",
	});
	
}]);
