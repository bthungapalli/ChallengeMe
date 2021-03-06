angular.module("challengeMeApp").controller("faqController",["$scope","$http","$state","$rootScope","challengeMeConstants",function($scope,$http,$state,$rootScope,challengeMeConstants){
	$scope.faqTemplate="angularJs/partials/faq.html";
	$scope.faqOpen=1;
	
	$scope.showHideFAQ=function(index){
		$scope.faqOpen=index+1;
	}
	
$scope.faq=[
    {
	    "question":"What is OSIWizz?",
		"answer":"OSIWizz is our own platform to share knowledge. We go by the motto of \"Sharing is learning\". We as engineers seek google\'s help for most of our challenges and some of us are even active in online forums. This platform allows us to seek answers for our challenges from our own elite peer group and also share our incredible learnings."
    },
    {
        "question":"Do I need to register to OSIWizz?",
    	"answer":"No, you don\'t. You just need to login to OSIWizz using your OSI credentials. You need to update your profile post login to be in touch with latest updates on OSIWizz.",
    	
    },
    {
        "question":"What notifications will I receive from OSIWizz?",
    	"answer":"Click on the Edit Profile link on the left hand NAV after login and choose the categories from the Subscribe To section. All members subscribed to a particular group will be notified when a challenge or Learning is shared with that particular group."

     },
     {
         "question":"Do I need to register to OSIWizz?",
     	"answer":"No, you don't. You just need to login to OSIWizz using your OSI credentials. You need to update your profile post login to be in touch with latest updates on OSIWizz."

     },
     {
         "question":"What is considered as a challenge?",
     	"answer":"Any technical or conceptual issue where in you are looking for a solution, qualifies for a challenge."

     },
     {
         "question":"What is considered as a Learning?",
     	"answer":"Any technical or conceptual information which you think can benefit your peers qualifies for a learning and is worth sharing."
     },
     {
         "question":"Who are all going to receive my challenge?",
     	"answer":"While posting a challenge the owner needs to select groups to which he wants to share his learning or challenge with (Mail Group:), all users who have subscribed to that specific category will receive that notification."
     
     },
     {
         "question":"How do I see the solutions posted in response to my challenge?",
     	"answer":"You can see the posted solutions in My Challenges section before the cutoff date for that challenge. Post which you can see them even in All Challenges section."
     },
     {
         "question":"Why am I not able to see my solution in All Challenges?",
     	"answer":"You will be able to see your solution in All Challenges only after the challenge is closed (Reached cut-off date)."
     },
     {
         "question":" How do I respond to a challenge?",
     	"answer":"You need to first Accept a challenge in All Challenges section. Accepted Challenge would then show up in the Subscribed Challenges section, from where you can respond to the challenge."
     	
     },
     {
         "question":"Can I delete my solution after posting it?",
     	"answer":"No, but you can modify that until the cut-off date."
     	
     },
     {
         "question":"Can I see the solutions posted by others?",
     	"answer":"You can see them in the All Challenges section only after the cutoff date."
     	
     },
     {
         "question":"How can I share my learning?",
     	"answer":"By choosing the option of Learning in the Create Challenge section. "
     	
     },
     {
         "question":"Who all are going to be notified of the learning posted by me?",
     	"answer":"All the members who have subscribed to the category, to which you have chosen to mail to."
     	
     },
     {
         "question":"Can I delete my learning or challenge after posting it?",
     	"answer":"No, you cannot delete them, but you are free to modify them."
     	
     },
     {
         "question":"How to subscribe/unsubscribe to emails from OSIWizz?",
     	"answer":"You can edit your profile and subscribe to a new category or unsubscribe to an existing category to start or stop receiving notifications from OSIWizz."
     	
     },
     {
         "question":"Whom do I contact if I need a help in operating the site?",
     	"answer":"you can post a query to <a href='#'>OSIWizz-support@osius.com</a>"
     	
     }
    ];
	
	
}]);
