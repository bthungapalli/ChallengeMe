angular.module("challengeMeApp").controller("viewChallengeController",["$scope","$http","$state","$rootScope","challengeMeConstants","$loading",function($scope,$http,$state,$rootScope,challengeMeConstants,$loading){
	$scope.errorMessage;
	$scope.categories=[];
    $scope.challenge={
			"_id":"",
			"categories":[],
			"title":"",
			"description":"",
			"date":"",
			"prize":"",
			"status":""
	};
	$scope.editChallenge=false;
	$scope.challengeTemplate;
	$scope.solutionTemplate;
	$scope.solutionTemplateForView;
	$scope.challengeCommentsTemplate;
	$scope.solutionCommentTemplate="angularjs/partials/solutionComments.html";
	$scope.view=$state.current.name;
	$scope.viewComments=false;
	$scope.challengeComment="";
	
	$scope.getAllCategories=function(){
		
		$http.get(challengeMeConstants.categoriesURL).success(function(response){
			$scope.redirectToLoginIfSessionExpires(response);
			$scope.categories=response;
			}).error(function(error){
				$scope.category.errorMessage=challengeMeConstants.errorMessage;
			});
		};
		
		$scope.getAllCategories();
		
		$scope.saveChallenge=function(){
			$scope.loadingMessage="saving challenge..";
			$loading.start('challenges');
			
			$scope.errorMessage="";
			$scope.challenge.categories= (typeof $scope.challenge.categories === 'string') ?  JSON.parse($scope.challenge.categories) : $scope.challenge.categories;
			$http.post(challengeMeConstants.challenge,$scope.challenge).success(function(response){
				$scope.redirectToLoginIfSessionExpires(response);
				if(response=="error"){
					$scope.errorMessage=challengeMeConstants.errorMessage;
				}else{
					$scope.editChallenge=!$scope.editChallenge;
				};
				$loading.finish('challenges');
				}).error(function(error){
					$scope.errorMessage=challengeMeConstants.errorMessage;
					$loading.finish('challenges');
				});
		};
		
		$scope.showEditFields=function(){
			$scope.editChallenge=!$scope.editChallenge;
		};
		
		$scope.toggleSelection = function toggleSelection(category) {
			var idx=-1;
		    angular.forEach($scope.challenge.categories,function(allCategory,index){
				if(allCategory._id===category._id){
					idx=index;
				}
			});

		    if (idx > -1) {
		      $scope.challenge.categories.splice(idx, 1);
		    }
		    else {
		      $scope.challenge.categories.push(category);
		    }
		  };
		  
		$scope.getChallenge=function(challenge){
			
			if($rootScope.previousOpenedChallengeIndex===-1){
				$scope.challenges[challenge.index].collapse=!$scope.challenges[challenge.index].collapse;
				$rootScope.previousOpenedChallengeIndex=challenge.index;
			}else if($rootScope.previousOpenedChallengeIndex===challenge.index){
				$scope.challenges[$rootScope.previousOpenedChallengeIndex].collapse=!$scope.challenges[$rootScope.previousOpenedChallengeIndex].collapse;
			}else{
				$scope.challenges[$rootScope.previousOpenedChallengeIndex].collapse=false;
				$rootScope.previousOpenedChallengeIndex=challenge.index;
				$scope.challenges[challenge.index].collapse=true;
				
			}
			if($scope.challenges[challenge.index].collapse){
				$scope.solutionTemplate="";
				$scope.solutionTemplateForView="";
				$scope.loadingMessage="fetching challenge..";
				$loading.start('challenges');
				$http.get(challengeMeConstants.challenge+"/"+challenge._id).success(function(response){
					$scope.redirectToLoginIfSessionExpires(response);
					$scope.challenge=response;
					$scope.challengeCommentsTemplate="angularjs/partials/challengeComments.html";
					if($scope.view==="main.myChallenges"){
						$scope.challengeTemplate="angularjs/partials/viewMyChallenge.html";
					}else{
						$scope.challengeTemplate="angularjs/partials/challenge.html";
					}
					
					if($scope.view==="main.subcribedChallenges"){
						$scope.solutionTemplate="angularjs/partials/solution.html";
					}else{
						$scope.solutionTemplateForView="angularjs/partials/viewSolutions.html";
					};
					$loading.finish('challenges');
				}).error(function(error){
						$scope.errorMessage=challengeMeConstants.errorMessage;
						$loading.finish('challenges');
				});
			}
			
				
		};
		
		$scope.checkCategory=function(categoryId){
				  var checked=false;
						if($scope.challenge.categories._id===categoryId){
							checked=true;
						}
				  return checked;
		};
		
		$scope.showComments=function(){
			$scope.viewComments=!$scope.viewComments;
		};
		
		$scope.addChallengeComment=function(challenge){
			var data={"challengeId":challenge._id,"comment":$("#commentTextArea").val()}
			$http.post(challengeMeConstants.challenge+"/"+challengeMeConstants.challengeComment,data).success(function(response){
				$scope.redirectToLoginIfSessionExpires(response);
				if(response==="error"){
					$scope.errorMessage=challengeMeConstants.errorMessage;
				}else{
					
					var commentData={"comment":$("#commentTextArea").val(),"userName":$scope.userDetails.name,"emailId":$scope.userDetails.emailId,"commentedDate":new Date().toISOString()}
					$scope.challenge.comments.push(commentData);
					$scope.challengeComment="";
					$("#commentTextArea").val("")
				};
				}).error(function(error){
					$scope.errorMessage=challengeMeConstants.errorMessage;
				});
		};
		
		$scope.getProfilePathForSolutions=function(solutionObj){
			$scope.solutionUserImagePath= "profile/imagePath/emailId/"+solutionObj.solutionByEmailId+"/number/"+Math.random() ;
		};
}]);
