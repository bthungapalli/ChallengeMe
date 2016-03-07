'use strict';
angular.module("challengeMeApp").controller("dashboardController", function ($scope,$http,$state,$rootScope) {
	
	$scope.getPieData=function(){
		$http.get("dashboard/byIntrest").success(
				function(response){
					$scope.redirectToLoginIfSessionExpires(response);
					$scope.labels = response[0];
					$scope.data = response[1];
				     console.log($scope.labels);
				     console.log($scope.data);
						
				})
		.error(
			function(xhr, status, err){
				$scope.errorMsg = "Something went wrong!!!";
			});
	};
	$scope.barData = {
			count: [],
			months: []
		};
		$scope.getMonthData = function(){
			$http.get("dashboard/lastsixmonths")
			.success(
				function(response){
					$scope.barData.months = response[0];
					$scope.barData.count[0] = response[1];
				})
			.error(
				function(xhr, status, err){
					$scope.errorMsg = "Something went wrong!!!";
				});
		};

			$scope.userCount = function(){
				$http.get("dashboard/userCount")
				.success(
					function(response){
						$scope.userCount = response;
					})
				.error(
					function(xhr, status, err){
						$scope.errorMsg = "Something went wrong!!!";
					});
			};
	
	$scope.getPieData();
	$scope.getMonthData();
	$scope.userCount();
});