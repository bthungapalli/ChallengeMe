angular.module("challengeMeApp").controller("challengesController",["$scope","$http","$state","$rootScope","challengeMeConstants","$loading",function($scope,$http,$state,$rootScope,challengeMeConstants,$loading){
	

	$scope.challenges=[];
	$rootScope.previousOpenedChallengeIndex=-1;
	$scope.colspan=5;
	$scope.itemsPerPage="5";
	$scope.list="All";
	$scope.allChallenges=false;
	$scope.addAttributesToChallenge=function(challenges){
		
		var openChallenges=[];
		var closedChallenges=[];
		
		angular.forEach(challenges,function(challenge,index){
			challenge.collapse=false;
			challenge.index=index;
			var date=challenge.date.split("/");
			var closedDate=new Date(date[2], date[0]-1,  date[1] , "23", "59", "59" );
			if((closedDate.getTime()>new Date().getTime() && !challenge.explicitClose) || challenge.status==='draft'){
				challenge.challengeStatus="Open";
				openChallenges.push(challenge);
			}else{
				challenge.challengeStatus="Closed";
				closedChallenges.push(challenge);
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
			challenge.profileImageOfChallengeOwner="profile/imagePath/emailId/"+challenge.createdByEmailId+"/number/"+Math.random();
		});
		
		if($rootScope.ocValue==="CLOSED"){
			$scope.challenges=closedChallenges;
		}else if($rootScope.ocValue==="OPEN"){
			$scope.challenges=openChallenges;
		}else{
			$scope.challenges=challenges;
		}
		
		
	};
	
	$scope.getListOfSelectedForMyPosts=function(){
		var url="";
		
		if($scope.list==="All"){
			url="/challenge/mychallenges/All";
		}else if($scope.list==="CHALLENGES"){
			url="/challenge/mychallenges/false";
		}else if($scope.list==="LEARNINGS"){
			url="/challenge/mychallenges/true";
		}
		$scope.getMyChallenges(url);
	};
	
	$scope.getListOfSelected=function(){
		var url="";
			$scope.allChallenges=false;
			$rootScope.ocValue = "";
		if($scope.list==="All"){
			$scope.fetchAll();
		}else if($scope.list==="CHALLENGES"){
			url="/challenge/challengeOrLearning/false/"+$scope.allChallenges;
		}else if($scope.list==="LEARNINGS"){
			url="/challenge/challengeOrLearning/true/"+$scope.allChallenges;
		}
		$scope.fetchChallengesOrLearning(url);
		$rootScope.clickedValue = undefined;
		$scope.search='';
	};
	
	$scope.fetchAll=function(){
		$scope.loadingMessage="fetching all posts...";
		$loading.start('challenge');
		var url="";
		if($scope.allChallenges){
			url='/challenge/all/'+$scope.list;
		}else{
			url=challengeMeConstants.allChallenges+'/'+$scope.list;
		}
		
		$scope.fetchChallengesOrLearning(url);
		$rootScope.clickedValue = undefined
	};
	
	$scope.fetchChallengesOrLearning=function(url){
		$scope.errorMessage="";
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
	}
	
	$scope.getMyChallenges=function(url){
		$scope.loadingMessage="fetching my challenges...";
		$loading.start('challenge');
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
	
	$scope.getAllChallenges=function(){
		$scope.loadingMessage="fetching all challenges...";
		$loading.start('challenge');
		$http.get(challengeMeConstants.allChallenges+"/All").success(function(response){
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
		$scope.getMyChallenges("/challenge/mychallenges/All");
	}else if($state.current.name==="main.allChallenges"){
			$scope.setCurrentTab("allChallenges");
			if($rootScope.clickedValue !== undefined){
				$scope.list=$rootScope.clickedValue;
				$scope.allChallenges=true;
				$scope.fetchAll();
			}else{
				$rootScope.ocValue = "";
				$rootScope.clickedValue = undefined;
				$scope.getAllChallenges();
			}
		
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
