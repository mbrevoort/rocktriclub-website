var nodemailer = require("nodemailer")
  , config = require('./config')
  , fs = require('fs')
  , hogan = require('hogan.js')
  , welcomeTxtTemplate = hogan.compile(fs.readFileSync(__dirname + '/../email_templates/welcome.txt.mustache', 'utf8'))
  ;

// fire and forget
module.exports = function (toAddress, displayName, type, amount, card) {
    if (!config.enable_email) return;

    // we're not going to send many emails, just connect every time
    var smtpTransport = nodemailer.createTransport("SMTP",{
        service: "Gmail",
        auth: {
            user: config.email_gmail_user,
            pass: config.email_gmail_password
        }
    });

    var data = { 
        displayName: displayName,
        amount: amount,
        type: type,
        card: card
    };

    var textEmail = welcomeTxtTemplate.render(data);

        // setup e-mail data with unicode symbols
    var mailOptions = {
        from: "RockTriClub <" + config.email_from_address + ">",
        replyTo: config.email_from_address,
        to: toAddress,
        bcc: config.email_from_address,
        subject: "Welcome to the Rock Tri Club!",
        text: textEmail
    };

    // send mail with defined transport object
    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log("Error sending new member email to ", toAddress, error);
        }
        else {
            console.log("New member email sent to ", toAddress, response.message);
        }
    });

    smtpTransport.close();
}

