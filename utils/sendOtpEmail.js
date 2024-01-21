const nodemailer = require("nodemailer");
const User = require("../models/usres");
exports.sendOtp =
  async (email, otp, name, userId) => {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp",
      secure: true,
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD,
      },
    });

    let info = await transporter.sendMail({
      from: '"books Care" <process.env.FROM>', // sender address
      to: `${name} <${email}>`, // list of receivers /name /email
      subject: "verification mail ", // Subject line
      text: "verification mail", // plain text body
      html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                <div style="margin:50px auto;width:70%;padding:20px 0">
                  <div style="border-bottom:1px solid #eee">
                    <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Books Care</a>
                  </div>
                  <p style="font-size:1.1em">Hi,</p>
                  <p>Thank you for choosing Books Care. Use the following OTP to complete your Reset password </p>
                  <h2 style="background: #4044ee;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">
                     ${otp}
                      
                      </h2>
                  <p style="font-size:0.9em;">Regards,<br />Books Care</p>
                  <hr style="border:none;border-top:1px solid #eee" />
                  <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                    
                    <p>	www.books.care </p><p>	5th Floor, 5A103 , Two Horizon Center, </p><p> Golf Course Road, DLF Phase-5, Sector- 43</p>Gurugram, Haryana-122002<p>
                        
                    </p>
                  </div>
                </div>
              </div>`, // html body   
    });
    let resetToken = otp.toString();
    const data = await User.findByIdAndUpdate(userId, {
      resetToken: resetToken,
    });
  }