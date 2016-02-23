var express = require('express');
var router = express.Router();
var mailUtil = require("../utils/MailUtil");

router.get("/",function(req,res,next){
	mailUtil.sendMail('asdfas','dfasdsafsda','dafasdsa','dasfasdfasd');
});
module.exports = router;