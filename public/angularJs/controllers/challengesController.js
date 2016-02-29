angular.module("challengeMeApp").controller("challengesController",["$scope","$http","$state","$rootScope","challengeMeConstants",function($scope,$http,$state,$rootScope,challengeMeConstants){
	

	$scope.challenges=[];
	$rootScope.previousOpenedChallengeIndex=-1;
	$scope.colspan=5;
	$scope.itemsPerPage="5";
	$scope.addAttributesToChallenge=function(challenges){
		angular.forEach(challenges,function(challenge,index){
			challenge.collapse=false;
			challenge.index=index;
			if(new Date(challenge.date).getTime()>new Date().getTime()){
				challenge.closed=false;
			}else{
				challenge.closed=true;
			}
		});
		$scope.challenges=challenges;
	};
	
	$scope.getMyChallenges=function(){
		$http.get(challengeMeConstants.myChallenges).success(function(response){
			$scope.redirectToLoginIfSessionExpires(response);
			$scope.addAttributesToChallenge(response);
			}).error(function(error){
				$scope.errorMessage=challengeMeConstants.errorMessage;
			});
	};
	
	$scope.getAllChallenges=function(){
		$http.get(challengeMeConstants.allChallenges).success(function(response){
			$scope.redirectToLoginIfSessionExpires(response);
			$scope.addAttributesToChallenge(response);
			}).error(function(error){
				$scope.errorMessage=challengeMeConstants.errorMessage;
			});
	};
	
	   $scope.getSubcribeChallenges=function(){
			$http.get(challengeMeConstants.subcribeChallenge).success(function(response){
				$scope.redirectToLoginIfSessionExpires(response);
				$scope.addAttributesToChallenge(response);
				}).error(function(error){
					$scope.errorMessage=challengeMeConstants.errorMessage;
				});
		};

	if($state.current.name==="main.myChallenges"){
		$scope.setCurrentTab("myChallenges");
		$scope.getMyChallenges();
	}else if($state.current.name==="main.allChallenges"){
		$scope.setCurrentTab("allChallenges");
		$scope.getAllChallenges();
	}else if($state.current.name==="main.subcribedChallenges"){
		$scope.setCurrentTab("subcribedChallenges");
		$scope.getSubcribeChallenges();
	}
	
	$scope.subcribeChallenge=function(challengeObj){
		var data={"challengeId":challengeObj._id};
		$http.post(challengeMeConstants.subcribeChallenge,data).success(function(response){
		if(response==="subcribed"){
			$state.go("main.subcribedChallenges");
		}else{
			$scope.errorMessage=challengeMeConstants.errorMessage;
		}
			}).error(function(error){
				$scope.errorMessage=challengeMeConstants.errorMessage;
			});
	};
	
}]);
