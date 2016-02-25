angular.module("challengeMeApp").controller("loginController",["$scope","$http","$state","$rootScope",function($scope,$http,$state,$rootScope){
	
	
	$scope.user={
			userName:"",
			password:"",
			errorMessage:"",
			invalidCredentials:false
		};
	
		
		$scope.authenticateUser=function(){
			$scope.user.errorMessage="";
			$scope.user.invalidCredentials=false;
			var authenticateUserUrl = "/authenticate";
			var data = {
					userName : $scope.user.userName,
					password :  $scope.user.password
				};
			$http.post(authenticateUserUrl,data).success(function(response){
				
				if(angular.isDefined(response._id)){
					$state.go("main");
				}else if(response==="Not able to access server"){
					$scope.user.errorMessage="Not able to access server";
				}else if(response==="Invalid Credentials"){
					$scope.user.errorMessage="Invalid Credentials";
					$scope.user.invalidCredentials=true;
				}
			}).error(function(error){
				$scope.user.errorMessage="Some thing went wrong.";
			});
			
		};
		
		$scope.redirectToLoginIfSessionExpires=function(msg){
			if(msg==="sessionExpired"){
				$state.go("/");
			};
		};

	$state.go("/");
}]);
