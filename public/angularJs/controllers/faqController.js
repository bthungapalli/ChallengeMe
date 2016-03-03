angular.module("challengeMeApp").controller("faqController",["$scope","$http","$state","$rootScope","challengeMeConstants",function($scope,$http,$state,$rootScope,challengeMeConstants){
	
$scope.faq=[
    {
    "question":"Question goes here",
	"answer":"answer goes here",
	"show":false
    },
    {
        "question":"Question goes here",
    	"answer":"answer goes here",
    	"show":false
    },
    {
        "question":"Question goes here",
    	"answer":"answer goes here",
    	"show":false
     }
    ];
	
	
}]);
