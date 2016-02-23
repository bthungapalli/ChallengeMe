angular.module("challengeMeApp").controller("categoriesController",["$scope","$http",function($scope,$http){
	
	$scope.initializeCategory=function(){
		$scope.category={
				"_id":"",
				"name":"",
				"description":"",
				"edit":false,
				"errorMessage":""
		};
	};
	
	$scope.categories=[];
	$scope.itemsPerPage="5";
	
	$scope.getAllCategories=function(){
		
	$http.get("/categories").success(function(response){
		$scope.redirectToLoginIfSessionExpires(response);
		$scope.categories=response;
		$scope.initializeCategory();
		}).error(function(error){
			$scope.category.errorMessage="Some thing went wrong.";
		});
	};
	$scope.getAllCategories();
	
	$scope.addCategory=function(){
		var duplicateCategory=false;
		angular.forEach($scope.categories,function(category,index){
			if(category.name.toUpperCase()===$scope.category.name.toUpperCase()){
				duplicateCategory=true;
				$scope.category.errorMessage="Category all ready exist.";
			}
		});
		if(!duplicateCategory){
		var data = {
				name : $scope.category.name,
				description :  $scope.category.description
				};
		$http.post("/categories",data).success(function(response){
			$scope.redirectToLoginIfSessionExpires(response);
			$scope.category.errorMessage="";
			$scope.category._id=response;
			$scope.categories.push($scope.category);
			$scope.initializeCategory();
			}).error(function(error){
				$scope.category.errorMessage="Some thing went wrong.";
			});
		};
		
		
	};
	
	$scope.updateCategory=function(index){
		var data = {
				id:$scope.categories[index]._id,
				name : $scope.categories[index].name,
				description : $scope.categories[index].description
			};
		if($scope.categories[index].edit){
			$http.post("/categories",data).success(function(response){
				$scope.redirectToLoginIfSessionExpires(response);
			$scope.categories[index].edit=false;
			}).error(function(error){
				$scope.category.errorMessage="Some thing went wrong.";
			});
		}else{
			$scope.categories[index].edit=!$scope.categories[index].edit;
		}
	};
	
	$scope.deleteCategory=function(index,id){
		
	$http.delete("/categories/"+id).success(function(response){
		$scope.redirectToLoginIfSessionExpires(response);
		$scope.categories.splice(index,1);
		}).error(function(error){
			$scope.category.errorMessage="Some thing went wrong.";
		});
	};
	
}]);
