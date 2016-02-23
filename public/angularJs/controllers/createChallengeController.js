angular.module("challengeMeApp").controller("createChallengeController",["$scope","$http","$state","$rootScope",function($scope,$http,$state,$rootScope){
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
	
	$scope.getAllCategories=function(){
		
		$http.get("/categories").success(function(response){
			$scope.redirectToLoginIfSessionExpires(response);
			$scope.categories=response;
			}).error(function(error){
				$scope.category.errorMessage="Some thing went wrong.";
			});
		};
		
		$scope.getAllCategories();
		
		$scope.createChallenge=function(){
			$scope.errorMessage=""
			console.log("challenge:::",$scope.challenge);
			$http.post("/challenge",$scope.challenge).success(function(response){
				$scope.redirectToLoginIfSessionExpires(response);
				if(response=="error"){
					$scope.errorMessage="Some thing went wrong.";
				}else{
					$state.go("main.myChallenges");
				};
				}).error(function(error){
					$scope.errorMessage="Some thing went wrong.";
				});
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
		
}]);
