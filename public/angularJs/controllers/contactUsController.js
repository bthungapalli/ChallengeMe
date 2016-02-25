angular.module("challengeMeApp").controller("contactUsController",["$scope","$http","$state","$rootScope",function($scope,$http,$state,$rootScope){
	

	
	
	$scope.getUserDetails=function(){
		$http.get("/userDetails").success(function(response){
			$rootScope.userDetails=response;
			$state.go("main.allChallenges");
			$scope.currentTab="allChallenges";
			}).error(function(error){
			});
	};
	
}]);
