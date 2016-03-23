angular.module("challengeMeApp").controller("challengesController",["$scope","$http","$state","$rootScope","challengeMeConstants","$loading",function($scope,$http,$state,$rootScope,challengeMeConstants,$loading){
	

	$scope.challenges=[];
	$rootScope.previousOpenedChallengeIndex=-1;
	$scope.colspan=5;
	$scope.itemsPerPage="5";
	$scope.addAttributesToChallenge=function(challenges){
		angular.forEach(challenges,function(challenge,index){
			challenge.collapse=false;
			challenge.index=index;
			var date=challenge.date.split("/");
			var closedDate=new Date(date[2], date[0]-1,  date[1] , "23", "59", "59" );
			if(closedDate.getTime()>new Date().getTime()){
				challenge.challengeStatus="Open"
			}else{
				challenge.challengeStatus="Closed";
			}
			if(challenge.learning){
				challenge.challengeLearningStatus="Learning";
			}
			if(challenge.anonymous){
				challenge.createdByEmailId="Anonymous";
			}
			
			if($state.current.name==="main.subcribedChallenges" ){
				if(challenge.solutions.length===0){
					challenge.solutionStatus="draft";
				}else if(challenge.solutions[0].solutionByEmailId===$scope.userDetails.emailId){
					challenge.solutionStatus=challenge.solutions[0].status;
				}
			}
			
		});
		$scope.challenges=challenges;
	};
	
	$scope.fetchAll=function(){
		$scope.loadingMessage="fetching all challenges...";
		$loading.start('challenge');
		var url=""
		if($scope.allChallenges){
			url='/challenge/all';
		}else{
			url=challengeMeConstants.allChallenges;
		}
		
		$http.get(url).success(function(response){
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
		$scope.getAllChallenges()
	}else if($state.current.name==="main.subcribedChallenges"){
		$scope.setCurrentTab("subcribedChallenges");
		$scope.getSubcribeChallenges();
		
	}
	
	$scope.subcribeChallenge=function(challengeObj){
		$scope.loadingMessage=" subcribing challenge...";
		$loading.start('challenge');
		var data={"challenge":challengeObj};
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
