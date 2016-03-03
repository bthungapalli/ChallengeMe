angular.module('challengeMeApp').constant("challengeMeConstants", {
        "authenticateUserUrl": "/authenticate",
        "categoriesURL":"/categories",
        "myChallenges":"/challenge/mychallenges",
        "allChallenges":"/challenge/categories",
        "subcribeChallenge":"/subcribeChallenge",
        "contactUs":"/contactUs",
        "challenge":"/challenge",
        "logout":"/logout",
        "userDetails":"/userDetails",
        "locations":"/locations",
        "profileUpdate":"/profile/update",
        "solution":"/solution",
        "challengeComment":"/comment",
        "solutionComment":"/comment",
        "errorMessage":"Some thing went wrong.",
        "noChallengeMessage":"No challenges are available."
    }).constant("loadingMessages", {
        "loginLoadMessage": "authenticating users..."
    })