angular.module("challengeMeApp").controller("solutionController",["$scope","$http","$state","$rootScope","challengeMeConstants","$loading",function($scope,$http,$state,$rootScope,challengeMeConstants,$loading){
	
	
	$scope.errorMessage="";
	$scope.successMessageForSolution="";
	$scope.hideEdit=false;
	$scope.solutionObj={
			"_id":"",
			"solution":"",
			"anonymous":false,
			"challengeId":$scope.challenge._id
	};
	$scope.getSolution=function(){
		$scope.loadingMessage="fetching solution..";
		$loading.start('solution');
		console.log("inside getSolution");
		$http.get(challengeMeConstants.solution+"/"+$scope.challenge._id).success(function(response){
			$scope.redirectToLoginIfSessionExpires(response);
			console.log("inside response"+response);
			if(response!==undefined && response!==""){
				$scope.solutionObj=response;
			}
			$loading.finish('solution');
			}).error(function(error){
				$scope.errorMessage=challengeMeConstants.errorMessage;
				$loading.finish('solution');
			});
	};

	$scope.getSolution();
	
	$scope.saveSolution=function(challenge){
		$scope.successMessageForSolution="";
		$scope.loadingMessage="saving solution..";
		$loading.start('solution');
		$scope.errorMessage="";
		$http.post(challengeMeConstants.solution,$scope.solutionObj).success(function(response){
			$scope.redirectToLoginIfSessionExpires(response);
			if(response=="error"){
				$scope.errorMessage=challengeMeConstants.errorMessage;
			};
			$scope.solutionObj._id=response._id;
			if($scope.solutionObj.status==="create"){
				$scope.hideEdit=true;
				challenge.solutionStatus="create";
			}
			challenge.collapse=false;
			$scope.successMessageForSolution="solution updated."
			$loading.finish('solution');
			}).error(function(error){
				$scope.successMessageForSolution="";
				$scope.errorMessage=challengeMeConstants.errorMessage;
				$loading.finish('solution');
			});
	};
	
	
}]);
