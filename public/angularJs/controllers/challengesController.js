angular.module("challengeMeApp").controller("challengesController",["$scope","$http","$state","$rootScope",function($scope,$http,$state,$rootScope){
	

	$scope.challenges=[];
	$rootScope.previousOpenedChallengeIndex=-1;
	
	$scope.addAttributesToChallenge=function(challenges){
		angular.forEach(challenges,function(challenge,index){
			challenge.collapse=false;
			challenge.index=index;
		});
		$scope.challenges=challenges;
	};
	
	$scope.getMyChallenges=function(){
		
		$http.get("/challenge/mychallenges/"+$scope.userDetails.emailId).success(function(response){
			$scope.addAttributesToChallenge(response);
			}).error(function(error){
				$scope.category.errorMessage="Some thing went wrong.";
			});
	};
	
	$scope.getAllChallenges=function(){
		
		$http.get("/challenge").success(function(response){
			$scope.addAttributesToChallenge(response);
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
