var nodemailer = require("nodemailer"),
    config = require('./config');

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

    var text = "Hi " + displayName + ',\n\n' 
                + 'Welcome to the club! \n\n'
                + 'Your payment was successful. \n'
                + '$' + amount + ' - ' + type + ' - ' + card + '\n\n'
                + 'We look forward to seeing you at an upcoming workout!\n\n';

        // setup e-mail data with unicode symbols
    var mailOptions = {
        from: "RockTriClub <" + config.email_from_address + ">",
        replyTo: config.email_from_address,
        to: toAddress,
        bcc: config.email_from_address,
        subject: "Welcome to the Rock Tri Club!",
        text: text
        //html: "<b>Hello world ✔</b>" // html body
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

