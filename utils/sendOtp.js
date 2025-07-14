import nodemailer from "nodemailer";

const sendOtp = async ({ name, email, phone, otp, otpExpires }) => {
  console.log("📤 sendOtp() called with:", { email, phone, otp });

  if (email) {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `hi ${name},Your OTP is ${otp}. It will expire in 5 mintues`,
    });
  } else if (phone) {
    console.log(`Mock SMS to ${phone}: Your OTP is ${otp}`);
  }
};

export default sendOtp;
