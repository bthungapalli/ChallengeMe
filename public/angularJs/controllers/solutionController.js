angular.module("challengeMeApp").controller("solutionController",["$scope","$http","$state","$rootScope",function($scope,$http,$state,$rootScope){
	
	
	$scope.errorMessage="";
	$scope.hideEdit=false;
	$scope.solutionObj={
			"_id":"",
			"solution":"",
			"anonymous":false,
			"challengeId":$scope.challenge._id
	};
	$scope.getSolution=function(){
		console.log("inside getSolution");
		$http.get("/solution/"+$scope.challenge._id).success(function(response){
			$scope.redirectToLoginIfSessionExpires(response);
			console.log("inside response"+response);
			if(response!==undefined && response!==""){
				$scope.solutionObj=response;
			}
			
			}).error(function(error){
				$scope.errorMessage="Some thing went wrong.";
			});
	};

	$scope.getSolution();
	
	$scope.saveSolution=function(){
		$scope.errorMessage="";
		$http.post("/solution",$scope.solutionObj).success(function(response){
			$scope.redirectToLoginIfSessionExpires(response);
			if(response=="error"){
				$scope.errorMessage="Some thing went wrong.";
			};
			$scope.solutionObj._id=response._id;
			if($scope.solutionObj.status==="create"){
				$scope.hideEdit=true;
			}
			}).error(function(error){
				$scope.errorMessage="Some thing went wrong.";
			});
	};
	
}]);
