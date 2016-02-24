angular.module("challengeMeApp").controller("challengesController",["$scope","$http","$state","$rootScope",function($scope,$http,$state,$rootScope){
	

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
		$http.get("/challenge/mychallenges").success(function(response){
			$scope.redirectToLoginIfSessionExpires(response);
			$scope.addAttributesToChallenge(response);
			}).error(function(error){
				$scope.errorMessage="Some thing went wrong.";
			});
	};
	
	$scope.getAllChallenges=function(){
		$http.get("/challenge/categories").success(function(response){
			$scope.redirectToLoginIfSessionExpires(response);
			$scope.addAttributesToChallenge(response);
			}).error(function(error){
				$scope.errorMessage="Some thing went wrong.";
			});
	};
	
	   $scope.getSubcribeChallenges=function(){
			$http.get("/subcribeChallenge").success(function(response){
				$scope.redirectToLoginIfSessionExpires(response);
				$scope.addAttributesToChallenge(response);
				}).error(function(error){
					$scope.errorMessage="Some thing went wrong.";
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
		$http.post("/subcribeChallenge",data).success(function(response){
		if(response==="subcribed"){
			$state.go("main.subcribedChallenges");
		}else{
			$scope.errorMessage="Some thing went wrong.";
		}
			}).error(function(error){
				$scope.errorMessage="Some thing went wrong.";
			});
	};
	
}]);
