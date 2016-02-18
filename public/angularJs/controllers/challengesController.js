angular.module("challengeMeApp").controller("challengesController",["$scope","$http","$state","$rootScope",function($scope,$http,$state,$rootScope){
	

	$scope.challenges=[];
	
	$scope.getMyChallenges=function(){
		
		$http.get("/challenge/mychallenges/"+$scope.userDetails.emailId).success(function(response){
			$scope.challenges=response;
			}).error(function(error){
				$scope.category.errorMessage="Some thing went wrong.";
			});
	};
	
    $scope.getAllChallenges=function(){
		
		$http.get("/challenge").success(function(response){
			$scope.challenges=response;
			}).error(function(error){
				$scope.category.errorMessage="Some thing went wrong.";
			});
	};

	if($state.current.name==="main.myChallenges"){
		$scope.getMyChallenges();
	}else{
		$scope.getAllChallenges();
	}
	
	
}]);
