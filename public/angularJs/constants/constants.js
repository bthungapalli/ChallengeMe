angular.module('challengeMeApp').constant("challengeMeConstants", {
        "authenticateUserUrl": "/authenticate",
        "categoriesURL":"/categories",
        "myChallenges":"/challenge/mychallenges",
        "allChallenges":"/challenge/categories",
        "subcribeChallenge":"/subcribeChallenge",
        "fetchTags":"/challenge/fetchTags",
        "contactUs":"/contactUs",
        "challenge":"/challenge",
        "logout":"/logout",
        "userDetails":"/userDetails",
        "locations":"/locations",
        "profileUpdate":"/profile/update",
        "solution":"/solution",
        "challengeComment":"/comment",
        "solutionComment":"/comment",
        "updateComment":"/updateComment",
        "solutionIsCorrect":"/correctAnswer",
        "like":"/like",
        "unlike":"/unlike",
        "errorMessage":"Some thing went wrong.",
        "noChallengeMessage":"No posts are available."
    }).constant("loadingMessages", {
        "loginLoadMessage": "authenticating user..."
    })