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
			"status":"",
			"createdByEmailId":$scope.userDetails.emailId,
			"createdBy":$scope.userDetails.name
	};
	$scope.editChallenge=false;
	$scope.view=$state.current.name;;
	$scope.challengeTemplate;
	
	$scope.getAllCategories=function(){
		
		$http.get("/categories").success(function(response){
			$scope.categories=response;
			}).error(function(error){
				$scope.category.errorMessage="Some thing went wrong.";
			});
		};
		
		$scope.getAllCategories();
		
		$scope.saveChallenge=function(){
			$scope.errorMessage="";
			$http.post("/challenge",$scope.challenge).success(function(response){
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
			
				$http.get("/challenge/"+challenge._id).success(function(response){
					$scope.challenge=response[0];
					$scope.challengeTemplate="angularjs/partials/viewChallenge.html";
				}).error(function(error){
						$scope.errorMessage="Some thing went wrong.";
				});
				
		};
		
		$scope.checkCategory=function(categoryId){
				  var checked=false;
				  angular.forEach($scope.challenge.categories,function(category,index){
						if(category._id===categoryId){
							checked=true;
						}
					});
				  return checked;
		};
		
}]);
