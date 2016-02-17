angular.module("challengeMeApp").controller("profileController",["$scope","$http",function($scope,$http){
	
	$scope.allCategories=[];
	$scope.userCategories=[];
	
	$scope.getAllCategories=function(){
		
		$http.get("/categories").success(function(response){
			
			var userCat=[{"__v": 0,
				"_id": "3",
					"created_at": "2016-02-17T11:04:29.608Z",
					"description": "ALOK",
					"name": "LOK",
					"updated_at": "2016-02-17T11:04:29.608Z"}]
			
			$scope.userCategories=userCat;
			
			angular.forEach($scope.userCategories,function(userCategory){
				angular.forEach(response,function(allCategory,index){
					if(allCategory.name===userCategory.name){
						response.splice(index,1);
					}
				});
			});
			
			$scope.allCategories=response;
			
			}).error(function(error){
				$scope.category.errorMessage="Some thing went wrong.";
			});
		};
	
	$scope.getAllCategories();
	
	$scope.handleDropInAllCategory = function(item) {
		 var itemJson=  JSON.parse(item);
		$scope.allCategories.push(itemJson);
		angular.forEach($scope.userCategories,function(userCategory,index){
			if(userCategory.name===itemJson.name){
				$scope.userCategories.splice(index,1);
			}
		});
	  };
	
	$scope.handleDropInUserCategory = function(item) {
		 var itemJson=  JSON.parse(item);
		$scope.userCategories.push(itemJson);
		angular.forEach($scope.allCategories,function(allCategory,index){
			if(allCategory.name===itemJson.name){
				$scope.allCategories.splice(index,1);
			}
		});
	  };

	
}]);
