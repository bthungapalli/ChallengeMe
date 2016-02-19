angular.module("challengeMeApp").controller("mainController",["$scope","$http","$state","$rootScope",function($scope,$http,$state,$rootScope){
	

	$state.go("main.profile");
	
	if($state.current.name==="main.logout"){
		$http.get("/logout").success(function(response){
			if(response==="logout"){
				$state.go("/");
			};
			}).error(function(error){
			});
	}
}]);
