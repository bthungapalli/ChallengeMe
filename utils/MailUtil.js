var EmailTemplates = require('swig-email-templates');
var nodemailer = require('nodemailer');
var path = require('path');
var nconf = require('nconf');
var mailUtil = function() {

	return {
		// create reusable transporter object using the default SMTP transport
		sendMail : function(toEmail, fromEmail, subject, templateName,context) {
			var smtpConfig = {
				host : nconf.get("smtpConfig").host,
				port : nconf.get("smtpConfig").port,
				auth : {
					user : nconf.get("smtpConfig").authUser,
					pass : nconf.get("smtpConfig").authPassword
				}
			};
			console.log("smtpConfig:::::::::::"+smtpConfig.host);
			var transporter = nodemailer.createTransport(smtpConfig);
			var templates = new EmailTemplates({
				  root: path.resolve(__dirname+'/../templates/')
			});
			templates.render(templateName, context,
					function(err, html, text) {
						transporter.sendMail({
							from : fromEmail,
							to : toEmail,
							subject : subject,
							html : html,
							text : text
						});
						if(err){
							return console.log("Error occured::",err)
						}else{
							return console.log("Mail sent to::",toEmail);
						}
					});

		}
	}
}
module.exports=mailUtil();