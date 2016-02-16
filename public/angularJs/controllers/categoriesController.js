angular.module("challengeMeApp").controller("categoriesController",["$scope",function($scope){
	
	$scope.initializeCategory=function(){
		$scope.category={
				"id":"1",
				"name":"",
				"description":"",
				"edit":false,
				"errorMessage":""
		};
	};
	
	$scope.initializeCategory();
	$scope.categories=[];
	
	$scope.addCategory=function(){
		var data = {
				name : $scope.category.name,
				description :  $scope.category.description
			};
	$http.post("/categories",data).success(function(response){
		$scope.category.errorMessage=""
		$scope.categories.push($scope.category);
		$scope.initializeCategory();
		}).error(function(error){
			$scope.category.errorMessage="Some thing went wrong.";
		});
		
	}
	
	$scope.updateCategory=function(index){
		var data = {
				id:$scope.categories[index].id,
				name : $scope.categories[index].name,
				description : $scope.categories[index].description
			};
		if($scope.categories[index].edit){
			$http.post("/categories",data).success(function(response){
			$scope.categories[index].edit=false;
			}).error(function(error){
				$scope.category.errorMessage="Some thing went wrong.";
			});
		}else{
			$scope.categories[index].edit=!$scope.categories[index].edit;
		}
		
	
	}
	
	$scope.deleteCategory=function(index,id){
		
	$http.delete("/categories/"+id).success(function(response){
		$scope.categories.splice(index,1);
		}).error(function(error){
			$scope.category.errorMessage="Some thing went wrong.";
		});
	}
	
}]);
