import User from '@/models/userModel';
import nodemailer from 'nodemailer'
import bcryptjs from 'bcryptjs'


export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10)

    if (emailType === "VERIFY") {

      const updatedUser =  await User.findByIdAndUpdate(userId, 
        {
        $set: { verifyToken: hashedToken,
              verifyTokenExpiry: new Date(Date.
              now() + 3600000) // expires in one hour
        }
      })

    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        $set:
      
        { forgotPasswordToken: hashedToken,
          forgotPasswordTokenExpiry: new Date(Date.
          now() + 3600000)
        }
      })
    }

    var transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "96be6a184dc69f",  // generated ethereal user ❌❌
        pass: "10abb1a79b0308" // not good ❌
      }
    });

    const mailOptions = {
      from: 'sv1999vish@gmail.com', // sender address
      to: email, // list of receivers
      subject: emailType === 'VERIFY' ? "Verify Your email" : "reset Your email",
      html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">Here </a> to 
      ${emailType === 'VERIFY' ? "Verify Your email" : "reset Your email"}
      or copy paste the link below in your browser
      <br>${process.env.DOMAIN}verifyemail?token=${hashedToken}
      </p>`,
    }

    const mailResponse = await transport.sendMail(mailOptions)
    return mailResponse

  } catch (error: any) {
    throw new Error(error).message;
  }
}