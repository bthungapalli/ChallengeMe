angular.module("challengeMeApp").controller("createChallengeController",["$scope","$http","$state","$rootScope","challengeMeConstants","$loading",function($scope,$http,$state,$rootScope,challengeMeConstants,$loading){
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
		
		$http.get(challengeMeConstants.categoriesURL).success(function(response){
			$scope.redirectToLoginIfSessionExpires(response);
			$scope.categories=response;
			}).error(function(error){
				$scope.category.errorMessage=challengeMeConstants.errorMessage;
			});
		};
		
		$scope.getAllCategories();
		
		$scope.createChallenge=function(){
			$scope.loadingMessage=$scope.challenge.status==="create"?"Creating challenge":"Saving challenge";
			$loading.start('createChallenge');
			$scope.errorMessage=""
			console.log("challenge:::",$scope.challenge);
			$scope.challenge.categories= JSON.parse($scope.challenge.categories);
			$http.post(challengeMeConstants.challenge,$scope.challenge).success(function(response){
				$scope.redirectToLoginIfSessionExpires(response);
				if(response=="error"){
					$scope.errorMessage=challengeMeConstants.errorMessage;
				}else{
					$state.go("main.myChallenges");
				};
				$loading.finish('createChallenge');
				}).error(function(error){
					$scope.errorMessage=challengeMeConstants.errorMessage;
					$loading.finish('createChallenge');
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
