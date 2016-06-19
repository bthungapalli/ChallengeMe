var EmailTemplates = require('swig-email-templates');
var nodemailer = require('nodemailer');
var path = require('path');
var nconf = require('nconf');
var mailUtil = function() {

	return {
		// create reusable transporter object using the default SMTP transport
		sendMail : function(toEmail, fromEmail, subject, templateName,context ,callback) {
			var smtpConfig = {
				host : nconf.get("smtpConfig").host,
				port : nconf.get("smtpConfig").port,
				auth : {
					user : nconf.get("smtpConfig").authUser,
					pass : nconf.get("smtpConfig").authPassword
				}
			};
			var transporter = nodemailer.createTransport(smtpConfig);
			var templates = new EmailTemplates({
				  root: path.resolve(__dirname+'/../templates/'),
				  swig: {
					    safe: true     // Don't cache swig templates 
					  },
			});
			templates.render(templateName, context,
					function(err,html,text) {
						transporter.sendMail({
							from : fromEmail,
							to : toEmail,
							subject : subject,
							html : html,
							text : text
						},function(err,info){
							if(err){
								 console.log("Error occured in callback::",err)
								 return callback(err);
							}else{
								 console.log("Mail Sent to ",info.accepted);
								 return callback(null)
							}
						});
						
					});

		}
	}
}
module.exports=mailUtil();