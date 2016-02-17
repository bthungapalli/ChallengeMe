angular.module("challengeMeApp").controller("mainController",["$scope","$http","$state","$rootScope",function($scope,$http,$state,$rootScope){
	

	$state.go("main.profile");
}]);
