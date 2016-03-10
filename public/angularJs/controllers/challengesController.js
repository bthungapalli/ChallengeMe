angular.module("challengeMeApp").controller("challengesController",["$scope","$http","$state","$rootScope","challengeMeConstants","$loading",function($scope,$http,$state,$rootScope,challengeMeConstants,$loading){
	

	$scope.challenges=[];
	$rootScope.previousOpenedChallengeIndex=-1;
	$scope.colspan=5;
	$scope.itemsPerPage="5";
	$scope.addAttributesToChallenge=function(challenges){
		angular.forEach(challenges,function(challenge,index){
			challenge.collapse=false;
			challenge.index=index;
			if(new Date(challenge.date).getTime()>new Date().getTime()){
				challenge.challengeStatus="Open"
			}else{
				challenge.challengeStatus="Closed";
			}
			if(challenge.learning){
				challenge.challengeLearningStatus="Learning";
				alert(challenge.challengeLearningStatus);
			}
		});
		$scope.challenges=challenges;
	};
	
	$scope.getMyChallenges=function(){
		$scope.loadingMessage="fetching my challenges...";
		$loading.start('challenge');
		$http.get(challengeMeConstants.myChallenges).success(function(response){
			$scope.redirectToLoginIfSessionExpires(response);
			if(response==="error")
				$scope.errorMessage=challengeMeConstants.errorMessage;
			$scope.addAttributesToChallenge(response);
			if(response.length===0)$scope.errorMessage=challengeMeConstants.noChallengeMessage;
			$loading.finish('challenge');
			}).error(function(error){
				$scope.errorMessage=challengeMeConstants.errorMessage;
				$loading.finish('challenge');
			});
	};
	
	$scope.getAllChallenges=function(){
		$scope.loadingMessage="fetching all challenges...";
		$loading.start('challenge');
		$http.get(challengeMeConstants.allChallenges).success(function(response){
			$scope.redirectToLoginIfSessionExpires(response);
			if(response==="error")
				$scope.errorMessage=challengeMeConstants.errorMessage;
			$scope.addAttributesToChallenge(response);
			if(response.length===0)$scope.errorMessage=challengeMeConstants.noChallengeMessage;
			$loading.finish('challenge');
			}).error(function(error){
				$scope.errorMessage=challengeMeConstants.errorMessage;
				$loading.finish('challenge');
			});
	};
	
	   $scope.getSubcribeChallenges=function(){
		   $scope.loadingMessage="fetching subcribed challenges...";
			$loading.start('challenge');
			$http.get(challengeMeConstants.subcribeChallenge).success(function(response){
				$scope.redirectToLoginIfSessionExpires(response);
				if(response==="error")
					$scope.errorMessage=challengeMeConstants.errorMessage;
				$scope.addAttributesToChallenge(response);
				if(response.length===0)$scope.errorMessage=challengeMeConstants.noChallengeMessage;
				$loading.finish('challenge');
				}).error(function(error){
					$scope.errorMessage=challengeMeConstants.errorMessage;
					$loading.finish('challenge');
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
		$scope.loadingMessage=" subcribing challenge...";
		$loading.start('challenge');
		var data={"challengeId":challengeObj._id};
		$http.post(challengeMeConstants.subcribeChallenge,data).success(function(response){
			$scope.redirectToLoginIfSessionExpires(response);
		if(response==="subcribed"){
			$state.go("main.subcribedChallenges");
		}else{
			$scope.errorMessage=challengeMeConstants.errorMessage;
		}
		$loading.finish('challenge');
			}).error(function(error){
				$scope.errorMessage=challengeMeConstants.errorMessage;
				$loading.finish('challenge');
			});
	};
	
}]);
