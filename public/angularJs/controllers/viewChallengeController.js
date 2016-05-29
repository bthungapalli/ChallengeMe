angular.module("challengeMeApp").controller("viewChallengeController",["$scope","$http","$state","$rootScope","challengeMeConstants","$loading",function($scope,$http,$state,$rootScope,challengeMeConstants,$loading){

	
	$scope.errorMessage;
	$scope.successMessage='';
	$scope.categories=[];
	$scope.descriptionEmpty="";
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
			
			$scope.descriptionEmpty="";
			if(tinymce.get('CL'+parentChallenge.index).getContent().length>0){
				$scope.loadingMessage="saving challenge..";
				$loading.start('challenges');
				$scope.successMessage="";
				$scope.errorMessage="";
				
				if($('#file')[0].files.length>0){
					$("#uploadForm1").ajaxSubmit({
			            error: function(xhr) {
			        	status('Error: ' + xhr.status);
			            },
			            success: function(response) {
			            	if(response==="error"){
			            		$scope.errorMessage=challengeMeConstants.errorMessage;
			            	}else{
			            		$scope.challenge.file=response;
			            		$scope.saveChallengePost(parentChallenge);
			            	}
			            	$scope.$digest();
			             }
			    });
				}else{
					$scope.saveChallengePost(parentChallenge);
				}
			}else{
				$scope.descriptionEmpty="Please Enter Description";
				$scope.editChallenge=!$scope.editChallenge;
			}
			
			
		};
		
		$scope.saveChallengePost=function(parentChallenge){
			
			$scope.challenge.categories= (typeof $scope.challenge.categories === 'string') ?  JSON.parse($scope.challenge.categories) : $scope.challenge.categories;
			
			$scope.challenge.description=tinymce.get('CL'+parentChallenge.index).getContent();
			$http.post(challengeMeConstants.challenge,$scope.challenge).success(function(response){
				$scope.redirectToLoginIfSessionExpires(response);
				if(response=="error"){
					$scope.errorMessage=challengeMeConstants.errorMessage;
				}else{
					if($scope.challenge.status==="create"){
						$scope.challenge.isCreated=true;
						parentChallenge.status="create";
					}
					parentChallenge.title=$scope.challenge.title;
					parentChallenge.categories=$scope.challenge.categories
					parentChallenge.prize=$scope.challenge.prize;
					parentChallenge.date=$scope.challenge.date;
					parentChallenge.anonymous=$scope.challenge.anonymous;
					parentChallenge.description=$scope.challenge.description;
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
		}
		
		
$scope.closeChallenge=function(parentChallenge){
	$scope.loadingMessage="closing challenge..";
	$loading.start('challenges');
	$scope.challenge.date=$scope.challenge.date.replace($scope.challenge.date.substring(3,5), new Date().getDate());
	parentChallenge.date=$scope.challenge.date
			$http.post("/challenge/close",parentChallenge).success(function(response){
				$scope.redirectToLoginIfSessionExpires(response);
				if(response=="error"){
					$scope.errorMessage=challengeMeConstants.errorMessage;
				}else{
					parentChallenge.challengeStatus="Closed";
					$scope.editChallenge=!$scope.editChallenge;
				};
				$loading.finish('challenges');
				}).error(function(error){
					$scope.errorMessage=challengeMeConstants.errorMessage;
					$loading.finish('challenges');
				});
		}
		
		
		$scope.showEditFields=function(textAreaId){
			$scope.editChallenge=!$scope.editChallenge;
			
			if (tinymce.editors.length > 0) {
			    tinymce.execCommand('mceFocus', true, "CL"+textAreaId );       
			    tinymce.execCommand('mceRemoveEditor',true, "CL"+textAreaId);        
			    tinymce.execCommand('mceAddEditor',true,"CL"+textAreaId);
			}else{
				//if($("#CL"+textAreaId).is(":visible")){
					 
					tinymce.init({
					    selector: "#CL"+textAreaId,
						 plugins: [
					        "advlist autolink lists link image charmap print preview anchor ",
					        "searchreplace visualblocks code fullscreen",
					        "insertdatetime media table contextmenu paste textcolor colorpicker "
					    ],
					    toolbar: "insertfile undo redo | styleselect | bold italic | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image "
				   });	
				//}
	
			}
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
		
		
		$scope.showCommentButton=function(challenge){
			if($("#commentTextArea"+challenge.index).val().trim().length===0){
				$("#commentButton"+challenge.index).prop('disabled', true);
			}else{
				$("#commentButton"+challenge.index).prop('disabled', false);
			};
		};
		
		
		
		$scope.addChallengeComment=function(challenge){
		
			if($("#commentTextArea"+challenge.index).val().trim().length>0){
				var data={"challengeId":challenge._id,"comment":$("#commentTextArea"+challenge.index).val()}
				$http.post(challengeMeConstants.challenge+"/"+challengeMeConstants.challengeComment,data).success(function(response){
					$scope.redirectToLoginIfSessionExpires(response);
					if(response==="error"){
						$scope.errorMessage=challengeMeConstants.errorMessage;
					}else{
						
						var commentData={"comment":$("#commentTextArea"+challenge.index).val(),"userName":$scope.userDetails.name,"emailId":$scope.userDetails.emailId,"commentedDate":new Date().toISOString()}
						$scope.challenge.comments.push(commentData);
						$("#commentTextArea"+challenge.index).val("");
						$("#commentButton"+challenge.index).prop('disabled', true);
						$scope.challengeComment="";
					};
					}).error(function(error){
						$scope.errorMessage=challengeMeConstants.errorMessage;
					});
			}
			
			
		};
		
		$scope.showSolutionCommentButton=function(challenge,index){
			if($("#commentTextAreaForSolution"+challenge.index+index).val().trim().length===0){
				$("#solutionComment"+challenge.index+index).prop('disabled', true);
			}else{
				$("#solutionComment"+challenge.index+index).prop('disabled', false);
			};
		};
		
		
		$scope.addSolutionComment=function(challenge,solutionObj,index){
			$scope.errorMessage="";
			var data={"solutionId":solutionObj._id,"challengeEmailId":challenge.createdByEmailId,"title":challenge.title,"comment":$("#commentTextAreaForSolution"+challenge.index+index).val()}
			$http.post(challengeMeConstants.solution+"/"+challengeMeConstants.solutionComment,data).success(function(response){
				$scope.redirectToLoginIfSessionExpires(response);
				if(response==="error"){
					$scope.errorMessage=challengeMeConstants.errorMessage;
				}else if(response==="solution Needed"){
					$scope.errorMessage="Please add solution to  comment.";
				}else{
					var commentData={"comment":$("#commentTextAreaForSolution"+challenge.index+index).val(),"userName":$scope.userDetails.name,"emailId":$scope.userDetails.emailId,"commentedDate":new Date().toISOString()}
					if(solutionObj.comments===undefined)solutionObj.comments=[];
					solutionObj.comments.push(commentData);
					$scope.solutionComment="";
					$("#solutionComment"+challenge.index+index).prop('disabled', true);
					$("#commentTextAreaForSolution"+challenge.index+index).val("");
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
