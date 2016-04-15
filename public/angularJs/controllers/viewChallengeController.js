angular.module("challengeMeApp").controller("viewChallengeController",["$scope","$http","$state","$rootScope","challengeMeConstants","$loading",function($scope,$http,$state,$rootScope,challengeMeConstants,$loading){

	
	$scope.errorMessage;
	$scope.successMessage='';
	$scope.categories=[];
    $scope.challenge={
			"_id":"",
			"categories":[],
			"title":"",
			"description":"",
			"date":"",
			"prize":"",
			"status":"",
			"tag":""
	};
	$scope.editChallenge=false;
	$scope.challengeTemplate;
	$scope.solutionTemplate;
	$scope.solutionTemplateForView;
	$scope.challengeCommentsTemplate;
	$scope.solutionCommentTemplate="angularJs/partials/solutionComments.html";
	$scope.view=$state.current.name;
	$scope.viewComments=false;
	$scope.challengeComment="";
	
	
	 $(":file").jfilestyle({placeholder: "",buttonText: "Browse",'inputSize': '60%'});
	 $('#uploadForm1').submit(function() {
		 $scope.loadingMessage="saving file..";
			$loading.start('challenges');
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
	            		$loading.finish('challenges');
	            	}
	            	$scope.$digest();
	             }
	    });
	        //Very important line, it disable the page refresh.
	    return false;
	    }); 
	
	$scope.getAllCategories=function(){
		
		$http.get(challengeMeConstants.categoriesURL).success(function(response){
			$scope.redirectToLoginIfSessionExpires(response);
			$scope.categories=response;
			}).error(function(error){
				$scope.category.errorMessage=challengeMeConstants.errorMessage;
			});
		};
		
		$scope.getAllCategories();
		
		$scope.saveChallenge=function(parentChallenge){
			$scope.loadingMessage="saving challenge..";
			$loading.start('challenges');
			$scope.successMessage="";
			$scope.errorMessage="";
			$scope.challenge.categories= (typeof $scope.challenge.categories === 'string') ?  JSON.parse($scope.challenge.categories) : $scope.challenge.categories;
			$http.post(challengeMeConstants.challenge,$scope.challenge).success(function(response){
				$scope.redirectToLoginIfSessionExpires(response);
				if(response=="error"){
					$scope.errorMessage=challengeMeConstants.errorMessage;
				}else{
					if($scope.challenge.status==="create"){
						$scope.challenge.isCreated=true;
						parentChallenge.status="create";
					}
					parentChallenge.date=$scope.challenge.date;
					parentChallenge.anonymous=$scope.challenge.anonymous;
					if($scope.challenge.learning){
						parentChallenge.challengeLearningStatus="Learning";
					}else{
						parentChallenge.challengeLearningStatus="";
					}
					parentChallenge.learning=$scope.challenge.learning;
					$scope.editChallenge=!$scope.editChallenge;
					
				};
				//$scope.successMessage="saved";
				$loading.finish('challenges');
				}).error(function(error){
					$scope.errorMessage=challengeMeConstants.errorMessage;
					$loading.finish('challenges');
				});
		};
		
		$scope.showEditFields=function(){
			$scope.editChallenge=!$scope.editChallenge;
		};
		
		
		$scope.toggleSelection = function toggleSelection(category) {
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
			  
	  $scope.checkCategory=function(category){
				  var checked=false;
						if($scope.challenge.categories._id===category._id){
							$scope.selectedCategory=category;
							checked=true;
						}
				  return checked;
		};
		
		$scope.checkCategoryForMailGroup=function(category){
			  var checked=false;
				    angular.forEach($scope.challenge.mailGroups,function(mailGroup,index){
						if(mailGroup._id===category._id){
							checked=true;
						}
					});
			  return checked;
	};
	
	$scope.selectAllCategories = function() {
		  if($scope.challenge.mailGroups.length===$scope.categories.length){
			 return true;
		  }else{
			  return false;
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
	$scope.addAttributesToSolution=function(challenge){
		angular.forEach(challenge.solutions,function(solution,index){
			solution.collapse=false;
			solution.index=index;
			if(solution.anonymous){
				solution.solutionUserImagePath="profile/imagePath/emailId/anonymous/number/123" ;
			}else{
				solution.solutionUserImagePath="profile/imagePath/emailId/"+solution.solutionByEmailId+"/number/"+Math.random() ;
			}
			
		});
		
	};
		  
		$scope.getChallenge=function(challenge){
			
			if($rootScope.previousOpenedChallengeIndex===-1){
				$scope.challenges[challenge.index].collapse=!$scope.challenges[challenge.index].collapse;
				$rootScope.previousOpenedChallengeIndex=challenge.index;
				//$scope.openCloseSideMenu(true,$scope.challenges[challenge.index].collapse);
			}else if($rootScope.previousOpenedChallengeIndex===challenge.index){
				$scope.challenges[$rootScope.previousOpenedChallengeIndex].collapse=!$scope.challenges[$rootScope.previousOpenedChallengeIndex].collapse;
				//$scope.openCloseSideMenu($scope.challenges[$rootScope.previousOpenedChallengeIndex].collapse,$scope.challenges[$rootScope.previousOpenedChallengeIndex].collapse);
			}else{
				$scope.challenges[$rootScope.previousOpenedChallengeIndex].collapse=false;
				$rootScope.previousOpenedChallengeIndex=challenge.index;
				$scope.challenges[challenge.index].collapse=true;
				//$scope.openCloseSideMenu(true,$scope.challenges[challenge.index].collapse);
			}
			
			if($scope.challenges[challenge.index].collapse){
				$scope.solutionTemplate="";
				$scope.solutionTemplateForView="";
				$scope.loadingMessage="fetching challenge..";
				$loading.start('challenges');
				$http.get(challengeMeConstants.challenge+"/"+challenge._id).success(function(response){
					$scope.redirectToLoginIfSessionExpires(response);
					$scope.challenge=response;
					$scope.addAttributesToSolution($scope.challenge);
					$scope.challengeIdForFileUpload=$scope.challenge._id;
					if($scope.view==="main.myChallenges"){
						$scope.challengeTemplate="angularJs/partials/viewMyChallenge.html";
					}else{
						$scope.challengeTemplate="angularJs/partials/challenge.html";
					}
					
					if($scope.view!=="main.subcribedChallenges"){
						$scope.challengeCommentsTemplate="angularJs/partials/challengeComments.html";
					}
					
					if($scope.view==="main.subcribedChallenges"){
						$scope.solutionTemplate="angularJs/partials/solution.html";
					}else{
						$scope.solutionTemplateForView="angularJs/partials/viewSolutions.html";
					};
					$loading.finish('challenges');
				}).error(function(error){
						$scope.errorMessage=challengeMeConstants.errorMessage;
						$loading.finish('challenges');
				});
			}
			
				
		};
		
		
		
		$scope.showComments=function(){
			$scope.viewComments=!$scope.viewComments;
		};
		
		$scope.addChallengeComment=function(challenge){
			var data={"challengeId":challenge._id,"comment":$("#commentTextArea").val()}
			$http.post(challengeMeConstants.challenge+"/"+challengeMeConstants.challengeComment,data).success(function(response){
				$scope.redirectToLoginIfSessionExpires(response);
				if(response==="error"){
					$scope.errorMessage=challengeMeConstants.errorMessage;
				}else{
					
					var commentData={"comment":$("#commentTextArea").val(),"userName":$scope.userDetails.name,"emailId":$scope.userDetails.emailId,"commentedDate":new Date().toISOString()}
					$scope.challenge.comments.push(commentData);
					$scope.challengeComment="";
					$("#commentTextArea").val("")
				};
				}).error(function(error){
					$scope.errorMessage=challengeMeConstants.errorMessage;
				});
		};
		
		$scope.addSolutionComment=function(challenge,solutionObj){
			$scope.errorMessage="";
			var data={"solutionId":solutionObj._id,"challengeEmailId":challenge.createdByEmailId,"title":challenge.title,"comment":$("#commentTextAreaForSolution").val()}
			$http.post(challengeMeConstants.solution+"/"+challengeMeConstants.solutionComment,data).success(function(response){
				$scope.redirectToLoginIfSessionExpires(response);
				if(response==="error"){
					$scope.errorMessage=challengeMeConstants.errorMessage;
				}else if(response==="solution Needed"){
					$scope.errorMessage="Please add solution to  comment.";
				}else{
					var commentData={"comment":$("#commentTextAreaForSolution").val(),"userName":$scope.userDetails.name,"emailId":$scope.userDetails.emailId,"commentedDate":new Date().toISOString()}
					if(solutionObj.comments===undefined)solutionObj.comments=[];
					solutionObj.comments.push(commentData);
					$scope.solutionComment="";
					$("#commentTextAreaForSolution").val("")
				};
				}).error(function(error){
					$scope.errorMessage=challengeMeConstants.errorMessage;
				});
		};
		
		$scope.updateCorrectAnswerOrNot=function(solutionObj){
			$http.put(challengeMeConstants.solution+challengeMeConstants.solutionIsCorrect,solutionObj).success(function(response){
				$scope.redirectToLoginIfSessionExpires(response);
				if(response==="error"){
					$scope.errorMessage=challengeMeConstants.errorMessage;
				}
				}).error(function(error){
					$scope.errorMessage=challengeMeConstants.errorMessage;
				});
		}
		
	
		$scope.like=function(solutionObj){
			var data={"solutionId":solutionObj._id};
			$http.post(challengeMeConstants.solution+challengeMeConstants.like,data).success(function(response){
				$scope.redirectToLoginIfSessionExpires(response);
				if(response==="error"){
					$scope.errorMessage=challengeMeConstants.errorMessage;
				}else{
					solutionObj.userLiked=true;
					solutionObj.likes.push(response);
					$scope.showLikesCount(solutionObj);
				};
				}).error(function(error){
					$scope.errorMessage=challengeMeConstants.errorMessage;
				});
		};
		
		$scope.showLikesCount=function(solutionObj){
			solutionObj.userLiked=false;
			for(var i=0;i<solutionObj.likes.length;i++){
				if(solutionObj.likes[i].emailId==$scope.userDetails.emailId){
					solutionObj.userLiked=true;
					break;
				}
			}
		};
		
		
		$scope.showLikesCountForChallenge=function(likes){
			$scope.userLikedChallenge=false;
			for(var i=0;i<likes.length;i++){
				if(likes[i].emailId==$scope.userDetails.emailId){
					$scope.userLikedChallenge=true;
					break;
				}
			}
		};
		
		$scope.unLike=function(challenge,solutionObj){
			var data={"solutionId":solutionObj._id};
			$http.post(challengeMeConstants.solution+challengeMeConstants.unlike,data).success(function(response){
				$scope.redirectToLoginIfSessionExpires(response);
				if(response==="error"){
					$scope.errorMessage=challengeMeConstants.errorMessage;
				}else{
					solutionObj.userLiked=false;
					for(var i=0;i<solutionObj.likes.length;i++){
						if(solutionObj.likes[i].emailId===$scope.userDetails.emailId){
							solutionObj.likes.splice(i,1);
						}
					}
					$scope.showLikesCount(solutionObj);
				};
				}).error(function(error){
					$scope.errorMessage=challengeMeConstants.errorMessage;
				});
		};
		
		$scope.likeChallenge=function(challenge){
			var data={"challengeId":challenge._id};
			$http.post(challengeMeConstants.challenge+challengeMeConstants.like,data).success(function(response){
				$scope.redirectToLoginIfSessionExpires(response);
				if(response==="error"){
					$scope.errorMessage=challengeMeConstants.errorMessage;
				}else{
					$scope.userLikedChallenge=true;
					challenge.likes.push(response);
					$scope.showLikesCountForChallenge(challenge.likes);
				};
				}).error(function(error){
					$scope.errorMessage=challengeMeConstants.errorMessage;
				});
		}
		
        $scope.unLikeChallenge=function(challenge){
        	var data={"challengeId":challenge._id};
			$http.post(challengeMeConstants.challenge+challengeMeConstants.unlike,data).success(function(response){
				$scope.redirectToLoginIfSessionExpires(response);
				if(response==="error"){
					$scope.errorMessage=challengeMeConstants.errorMessage;
				}else{
					$scope.userLiked=false;
					for(var i=0;i<challenge.likes.length;i++){
						if(challenge.likes[i].emailId===$scope.userDetails.emailId){
							challenge.likes.splice(i,1);
						}
					}
					$scope.showLikesCountForChallenge(challenge.likes);
				};
				}).error(function(error){
					$scope.errorMessage=challengeMeConstants.errorMessage;
				});
		}
}]);
