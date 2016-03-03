var EmailTemplates = require('swig-email-templates');
var nodemailer = require('nodemailer');
var path = require('path');
var mailUtil = function() {

	return {
		// create reusable transporter object using the default SMTP transport
		sendMail : function(toEmail, fromEmail, subject, templateName,context) {
			var smtpConfig = {
				host : 'outlook.office365.com',
				port : 587,
				auth : {
					user : 'bthungapalli@osius.com',
					pass : 'Eeshu@05'
				}
			};
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