const nodemailer = require("nodemailer");
const {validate} = require("deep-email-validator");

class MailSender {


  //  Validate Email...
  async validateEmailAddress(receiverMail)  // Todo: Activate validate method...
  {
    let {valid} =  await validate(String(receiverMail).trim());
    return valid;
    // return true;
  }


  //  Create transporter...
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    // logger: true,
    priority: "high",
    auth: {
      user: process.env.SMTP_SENDER_ID,
      pass: process.env.SMTP_SENDER_PWD,
    },
  });

  //  Send OTP Mail...
  sendOtp = async function ({ ...data }) {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_SENDER_ID,
        to: data.to,
        subject: "Verify Your Email Address for GapSap: Your One-Time Password (OTP) Inside",
        html: `<div>
                  <p>You have requested to verify your email address for GapSap.</p>
                  <p>Please use the following One-Time Password (OTP) to verify your email:</p>
                  <p><strong>${data.otp}</strong></p>
                  <p><strong>Note:</strong> This OTP is valid for 15 minutes.</p>
                  <p>If you did not request this verification, please ignore this email.</p>
                  <p>Sincerely,<br>Team GapSap</p>
              </div>`,
      });
      return {success:true,message:"Mail sended"}
    } catch (err) {
      console.log(err.message);
      return {success:false,message:err.message}
    }
  };

  sendForgotPasswordMail = async ({...data}) => {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_SENDER_ID,
        to: data.email,
        subject: "GapSap reset password request.",
        html: `<div>
                  <p>You have requested to reset your password for GapSap.</p>
                  <p>Please click the following <a href="${data.forgotUrl}">Link</a> to reset your password:</p>
                  <p><strong>Note:</strong> This link is valid for 30 minutes.</p>
                  <p>If you did not request this reset, please ignore this email.</p>
                  <p>Sincerely,<br>Team GapSap</p>
              </div>`,
      });
    } catch (err) {
      console.log(err.message);
    }
  };
}

module.exports = MailSender;


