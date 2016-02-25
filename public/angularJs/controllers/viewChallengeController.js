angular.module("challengeMeApp").controller("viewChallengeController",["$scope","$http","$state","$rootScope",function($scope,$http,$state,$rootScope){
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
	$scope.view=$state.current.name;
	
	$scope.getAllCategories=function(){
		
		$http.get("/categories").success(function(response){
			$scope.redirectToLoginIfSessionExpires(response);
			$scope.categories=response;
			}).error(function(error){
				$scope.category.errorMessage="Some thing went wrong.";
			});
		};
		
		$scope.getAllCategories();
		
		$scope.saveChallenge=function(){
			$scope.errorMessage="";
			$scope.challenge.categories= JSON.parse($scope.challenge.categories);
			$http.post("/challenge",$scope.challenge).success(function(response){
				$scope.redirectToLoginIfSessionExpires(response);
				if(response=="error"){
					$scope.errorMessage="Some thing went wrong.";
				}else{
					$scope.editChallenge=!$scope.editChallenge;
				};
				}).error(function(error){
					$scope.errorMessage="Some thing went wrong.";
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
				$http.get("/challenge/"+challenge._id).success(function(response){
					$scope.redirectToLoginIfSessionExpires(response);
					$scope.challenge=response;
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
				}).error(function(error){
						$scope.errorMessage="Some thing went wrong.";
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
		
}]);
