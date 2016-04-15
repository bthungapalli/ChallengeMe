angular.module("challengeMeApp").controller("createChallengeController",["$scope","$http","$state","$rootScope","challengeMeConstants","$loading",function($scope,$http,$state,$rootScope,challengeMeConstants,$loading){
	$scope.errorMessage;
	$scope.successMessage="";
	$scope.categories=[];
	$scope.challenge={
			"_id":"",
			"categories":[],
			"title":"",
			"description":"",
			"date":"",
			"prize":"",
			"status":"",
			"learning":false,
			"anonymous":false,
			"mailGroups":[],
			"tag":""
	};
	 $(":file").jfilestyle({placeholder: "",buttonText: "Browse",'inputSize': '60%'});
	 $('#uploadForm').submit(function() {
		 $scope.loadingMessage="Saving file..";
			$loading.start('createChallenge');
	        $(this).ajaxSubmit({
	            error: function(xhr) {
	        	status('Error: ' + xhr.status);
	            },
	            success: function(response) {
	            	if(response==="error"){
	            		$scope.errorMessage=challengeMeConstants.errorMessage;
	            	}else{
	            		$scope.challenge.file=response;
	            		$scope.successMessage="File uploaded";
	            		$loading.finish('createChallenge');
	            	}
	             }
	    });
	        //Very important line, it disable the page refresh.
	    return false;
	    }); 
	
	
	 var today = new Date();
	  today.setMonth(today.getMonth()+6);
	  $scope.tre = today;
	  
	  $scope.maxDate = new Date(today.getFullYear(),today.getMonth() , today.getDate());
	  $scope.today = function() {
	    $scope.dt = new Date();
	  };
	  $scope.today();

	  $scope.clear = function () {
	    $scope.dt = null;
	  };

	  // Disable weekend selection
	  $scope.disabled = function(date, mode) {
	    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
	  };
//
//	  $scope.toggleMin = function() {
//	    $scope.minDate = $scope.minDate ? null : new Date();
//	  };
//	  $scope.toggleMin();
	  $scope.minDate = new Date();

	  $scope.open = function($event) {
	    $event.preventDefault();
	    $event.stopPropagation();

	    $scope.opened = true;
	  };

	  $scope.dateOptions = {
	    formatYear: 'yy',
	    startingDay: 1
	  };

	  $scope.formats = ['MM-dd-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	  $scope.format = $scope.formats[0];

	  var tomorrow = new Date();
	  tomorrow.setDate(tomorrow.getDate() + 1);
	  var afterTomorrow = new Date();
	  afterTomorrow.setDate(tomorrow.getDate() + 2);
	  $scope.events =
	    [
	      {
	        date: tomorrow,
	        status: 'full'
	      },
	      {
	        date: afterTomorrow,
	        status: 'partially'
	      }
	    ];

	  $scope.getDayClass = function(date, mode) {
	    if (mode === 'day') {
	      var dayToCheck = new Date(date).setHours(0,0,0,0);

	      for (var i=0;i<$scope.events.length;i++){
	        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

	        if (dayToCheck === currentDay) {
	          return $scope.events[i].status;
	        }
	      }
	    }

	    return '';
	  };

	
	$scope.getAllCategories=function(){
		
		$http.get(challengeMeConstants.categoriesURL).success(function(response){
			$scope.redirectToLoginIfSessionExpires(response);
			if(response==="error")
				$scope.errorMessage=challengeMeConstants.errorMessage;
			$scope.categories=response;
			}).error(function(error){
				$scope.errorMessage=challengeMeConstants.errorMessage;
			});
		};
		
		$scope.getAllCategories();
		
		$scope.createChallenge=function(){
			$scope.loadingMessage=$scope.challenge.status==="create"?"Creating challenge":"Saving challenge";
			$loading.start('createChallenge');
			$scope.errorMessage=""
			console.log("challenge:::",$scope.challenge);
			$scope.challenge.categories= JSON.parse($scope.challenge.categories);
			$http.post(challengeMeConstants.challenge,$scope.challenge).success(function(response){
				$scope.redirectToLoginIfSessionExpires(response);
				if(response==="error"){
					$scope.errorMessage=challengeMeConstants.errorMessage;
				}else{
					$state.go("main.myChallenges");
				};
				$loading.finish('createChallenge');
				}).error(function(error){
					$scope.errorMessage=challengeMeConstants.errorMessage;
					$loading.finish('createChallenge');
				});
		};
		
		$scope.toggleSelection = function (category) {
			var idx=-1;
		    angular.forEach($scope.challenge.mailGroups,function(mailGroup,index){
				if(mailGroup._id===category._id){
					idx=index;
				}
			});

		    if (idx > -1) {
		      $scope.challenge.mailGroups.splice(idx, 1);
		    }
		    else {
		      $scope.challenge.mailGroups.push(category);
		    }
		  };
		  
		  $scope.toggleAllSelection = function() {

			  if($scope.challenge.mailGroups.length===$scope.categories.length){
				  if($scope.selectedCategory===undefined){
					  $scope.challenge.mailGroups=[];
				  }else{
					 
					  $scope.challenge.mailGroups=$scope.selectedCategory;
				  }
			  }else{
				  $scope.challenge.mailGroups=angular.copy($scope.categories);
			  }
			  
		  };
		  
		  $scope.checkCategory=function(categoryId){
			  var checked=false;
			  angular.forEach(  $scope.challenge.mailGroups,function(category,index){
					if(category._id===categoryId){
						checked=true;
					}
				});
			  return checked;
		  };
		  
		  $scope.updateMailGroups = function toggleSelection(category) {
			  $scope.previousSelectedCategory= $scope.selectedCategory
				$scope.selectedCategory=category;
			  var idx=-1;
			    angular.forEach($scope.challenge.mailGroups,function(mailGroup,index){
					if(mailGroup._id===category._id){
						idx=index;
					}
				});
			  
			  if(idx===-1)
			  $scope.toggleSelection(category);
			  $scope.toggleSelection( $scope.previousSelectedCategory);
			  };
			  
				$scope.getAttachmentPath = function(){
					$scope.attachmentPath = "challenge/attachment/emailId/"+$scope.userDetails.usernams;
				};
		
}]);
