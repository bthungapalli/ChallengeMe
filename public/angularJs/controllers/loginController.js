angular.module("challengeMeApp").controller("loginController",["$scope","$http","$state",function($scope,$http,$state){
	

	$scope.user={
		userName:"",
		password:"",
		errorMessage:""
	};
	
	$scope.authenticateUser=function(){
		$scope.user.errorMessage="";
		var authenticateUserUrl = "/authenticate";
		var data = {
				userName : $scope.user.userName,
				password :  $scope.user.password
			};
		$http.post(authenticateUserUrl,data).success(function(response){
			
			if(angular.isDefined(response.user)){
				$state.go("dashBoard");
			}else if(response==="Not able to access server"){
				$scope.user.errorMessage="Not able to access server";
			}
		}).error(function(error){
			$scope.user.errorMessage="Some thing went wrong.";
		});
		
	};
}]);
