'use strict';
angular.module("challengeMeApp").controller("dashboardController", function ($scope,$http,$state,$rootScope,challengeMeConstants) {
	$scope.errorMessage="";
	$scope.donutData=function(){
		$http.get("dashboard/byIntrest").success(
				function(response){
					if(response==="error"){
						 $scope.errorMessage=challengeMeConstants.errorMessage;
					 }
					$scope.redirectToLoginIfSessionExpires(response);
					$scope.donutLabel = response[0];
					$scope.donutData = response[1];
				     console.log($scope.labels);
				     console.log($scope.data);
						
				})
		.error(
			function(xhr, status, err){
				 $scope.errorMessage=challengeMeConstants.errorMessage;
			});
	};
	$scope.barData = {
			labels: [],
			data: [],
			series:[]
		};
		$scope.getMonthData = function(){
			$http.get("dashboard/lastsixmonths")
			.success(
				function(response){
					if(response==="error"){
						 $scope.errorMessage=challengeMeConstants.errorMessage;
					 }
					$scope.redirectToLoginIfSessionExpires(response);
					/*$scope.barData.months = response[0];
					$scope.barData.count[0] = response[1];*/
					 $scope.barData.labels = response[0];
					  $scope.barData.series = ['Learnings', 'Challenges'];
					  $scope.barData.data = [
					    response[1],response[2]
					  ];
					
				})
			.error(
				function(xhr, status, err){
					$scope.errorMessage = challengeMeConstants.errorMessage;
				});
		};

			$scope.userCount = function(){
				$http.get("dashboard/userCount")
				.success(
					function(response){
						if(response==="error"){
							 $scope.errorMessage=challengeMeConstants.errorMessage;
						 }
						$scope.redirectToLoginIfSessionExpires(response);
						$scope.userCount = response;
					})
				.error(
					function(xhr, status, err){
						 $scope.errorMessage=challengeMeConstants.errorMessage;
					});
			};
			
			$scope.getPieData=function(){
				$http.get("dashboard/stats")
				.success(
					function(response){
						if(response==="error"){
							 $scope.errorMessage=challengeMeConstants.errorMessage;
						 }
						$scope.labels = ["OPEN","CLOSED"];
						$scope.data = [response[0],response[1]];
					})
				.error(
					function(xhr, status, err){
						 $scope.errorMessage=challengeMeConstants.errorMessage;
					});
			};
			
			$scope.solutionsCount = function(){
				$http.get("dashboard/solutionCount")
				.success(
					function(response){
						if(response==="error"){
							 $scope.errorMessage=challengeMeConstants.errorMessage;
						 }
						$scope.redirectToLoginIfSessionExpires(response);
						$scope.solutionCount = response;
					})
				.error(
					function(xhr, status, err){
						 $scope.errorMessage=challengeMeConstants.errorMessage;
					});
			};
	
			$scope.getCLStats=function(){
				$http.get("dashboard/CLStats").success(
						function(response){
							if(response==="error"){
								 $scope.errorMessage=challengeMeConstants.errorMessage;
							 }
							$scope.redirectToLoginIfSessionExpires(response);
							$scope.CLLabel = ['LEARNINGS', 'CHALLENGES'];
							$scope.CLData = response[1];
						})
				.error(
					function(xhr, status, err){
						 $scope.errorMessage=challengeMeConstants.errorMessage;
					});
			};
			
			
			$scope.barBUData = {
					labels: [],
					data: [],
					series:[]
				};
		$scope.getBUData = function(){
			$http.get("dashboard/getBUData").success(
					function(response){
						if(response==="error"){
							 $scope.errorMessage=challengeMeConstants.errorMessage;
						 }
						$scope.redirectToLoginIfSessionExpires(response);
						console.log("Labels:::",response[0]);
						$scope.barBUData.labels = response[0];
						$scope.barBUData.series = ['Challenges', ' Learnings'];
						$scope.barBUData.data =[response[1],response[2]];
					})
			.error(
				function(xhr, status, err){
					 $scope.errorMessage=challengeMeConstants.errorMessage;
				});
			
		}
			
			
	$scope.donutData();
	$scope.getPieData();
	$scope.getMonthData();
	$scope.userCount();
	$scope.solutionsCount();
	$scope.getCLStats();
	$scope.getBUData();
});