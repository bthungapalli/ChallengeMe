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
	var tempCategories=[];
	
	$scope.getAllCategories=function(){
		
	$http.get("/categories").success(function(response){
		$scope.redirectToLoginIfSessionExpires(response);
		$scope.categories=response;
		tempCategories=angular.copy($scope.categories);
		$scope.initializeCategory();
		}).error(function(error){
			$scope.category.errorMessage="Some thing went wrong.";
		});
	};
	$scope.getAllCategories();
	
	$scope.duplicateCheck=function(categoryToCheck){
		var duplicateCategory=false;
		angular.forEach(tempCategories,function(category,index){
			if(category.name.toUpperCase()===categoryToCheck.name.toUpperCase()){
				duplicateCategory=true;
				$scope.category.errorMessage="Category all ready exist.";
			}
		});
		return duplicateCategory;
	}
	
	$scope.addCategory=function(){
		
		var duplicateCheckFlag=$scope.duplicateCheck($scope.category);
		if(!duplicateCheckFlag){
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
		$scope.category.errorMessage="";
		var data = {
				_id:$scope.categories[index]._id,
				name : $scope.categories[index].name,
				description : $scope.categories[index].description
			};
		var duplicateCheckFlg=false
		if($scope.categories[index].edit)
		duplicateCheckFlg=$scope.duplicateCheck(data);
		
		if(!duplicateCheckFlg && $scope.categories[index].edit){
				$http.post("/categories",data).success(function(response){
					$scope.redirectToLoginIfSessionExpires(response);
				$scope.categories[index].edit=false;
				tempCategories=angular.copy($scope.categories);
				}).error(function(error){
					$scope.category.errorMessage="Some thing went wrong.";
				});
			}else if(!duplicateCheckFlg){
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
