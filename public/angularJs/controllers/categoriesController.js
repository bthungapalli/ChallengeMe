angular.module("challengeMeApp").controller("categoriesController",["$scope","$http","challengeMeConstants","$loading",function($scope,$http,challengeMeConstants,$loading){
	
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
		$scope.loadingMessage="fetching categories..";
		$loading.start('category');
	$http.get(challengeMeConstants.categoriesURL).success(function(response){
		$scope.redirectToLoginIfSessionExpires(response);
		$scope.categories=response;
		tempCategories=angular.copy($scope.categories);
		$scope.initializeCategory();
		$loading.finish('category');
		}).error(function(error){
			$scope.category.errorMessage=challengeMeConstants.errorMessage;
			$loading.finish('category');
		});
	};
	$scope.getAllCategories();
	
	$scope.duplicateCheck=function(categoryToCheck){
		var duplicateCategory=false;
		angular.forEach(tempCategories,function(category,index){
			if(category.name.toUpperCase()===categoryToCheck.name.toUpperCase()){
				duplicateCategory=true;
				$scope.category.errorMessage="Category already exist.";
			}
		});
		return duplicateCategory;
	}
	
	$scope.addCategory=function(){
		
		var duplicateCheckFlag=$scope.duplicateCheck($scope.category);
		if(!duplicateCheckFlag){
			$scope.loadingMessage="Adding categories..";
			$loading.start('category');
		var data = {
				name : $scope.category.name,
				description :  $scope.category.description
				};
		$http.post(challengeMeConstants.categoriesURL,data).success(function(response){
			$scope.redirectToLoginIfSessionExpires(response);
			$scope.category.errorMessage="";
			$scope.category._id=response;
			$scope.categories.push($scope.category);
			$scope.initializeCategory();
			$loading.finish('category');
			}).error(function(error){
				$scope.category.errorMessage=challengeMeConstants.errorMessage;
				$loading.finish('category');
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
			$scope.loadingMessage="Updating categories..";
			$loading.start('category');
				$http.post(challengeMeConstants.categoriesURL,data).success(function(response){
					$scope.redirectToLoginIfSessionExpires(response);
				$scope.categories[index].edit=false;
				tempCategories=angular.copy($scope.categories);
				$loading.finish('category');
				}).error(function(error){
					$scope.category.errorMessage=challengeMeConstants.errorMessage;
					$loading.finish('category');
				});
			}else if(!duplicateCheckFlg){
				$scope.categories[index].edit=!$scope.categories[index].edit;
			}
		
	};
	
	$scope.deleteCategory=function(index,id){
		$scope.loadingMessage="Deleting categories..";
		$loading.start('category');
	$http.delete(challengeMeConstants.categoriesURL+"/"+id).success(function(response){
		$scope.redirectToLoginIfSessionExpires(response);
		$scope.categories.splice(index,1);
		$loading.finish('category');
		}).error(function(error){
			$scope.category.errorMessage=challengeMeConstants.errorMessage;
			$loading.finish('category');
		});
	};
	
}]);
