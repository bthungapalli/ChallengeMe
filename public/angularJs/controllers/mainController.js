angular.module("challengeMeApp").controller("mainController",["$scope","$http","$state",function($scope,$http,$state){
	
	
	$scope.user={
			userName:"apatha@osius.com",
			password:"Cricket@100",
			errorMessage:""
		};
	$scope.userDetiails;
		
		$scope.authenticateUser=function(){
			$scope.user.errorMessage="";
			var authenticateUserUrl = "/authenticate";
			var data = {
					userName : $scope.user.userName,
					password :  $scope.user.password
				};
			$http.post(authenticateUserUrl,data).success(function(response){
				
				if(angular.isDefined(response.user)){
					$scope.userDetiails=response.user;
					$state.go("profile");
				}else if(response==="Not able to access server"){
					$scope.user.errorMessage="Not able to access server";
				}
			}).error(function(error){
				$scope.user.errorMessage="Some thing went wrong.";
			});
			
		};

	$state.go("/");
}]);
