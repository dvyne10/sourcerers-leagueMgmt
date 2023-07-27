/**
 * create user
 * login user
 * authenticate user
 * logout user
 * delete user
 */

import User from "../models/user.model.js";
import { generateOTPEmail } from "../templates/otpEmail.js";
import {
  genHash,
  genSalt,
  generateOTP,
  generateToken,
  sendEmail,
} from "../utils/auth.utils.js";
import handlebars from "handlebars";

const authUser = (req, res) => {
  res.status(200).json({
    message: "Auth user",
  });
};

const login = (req, res) => {
  res.status(200).json({
    message: "login user",
  });
};

const registerUser = async (req, res) => {
  const {
    firstName,
    lastName,
    country,
    province,
    city,
    sportsOfInterest,
    userName,
    email,
    password,
  } = req.body;

  console.log(req.socket.remoteAddress, "not trusted ip");
  console.log(req.ip, "trusted ip");

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    res.status(400).send({ success: false, message: "user already exits" });
    return;
  }

  const salt = genSalt();

  const hashedPassword = await genHash(password, salt);

  const user = await User({
    status: "PEND",
    userName,
    email,
    password: hashedPassword,
    userType: "USER",
    firstName,
    lastName,
    country,
    province,
    city,
    sportsOfInterest,
    salt,
  }).save();

  if (user) {
    // generating otp
    const otp = generateOTP();

    // generating email
    const html = generateOTPEmail(otp, userName, email);
    const htmlTemplate = handlebars.compile(html);

    // sending the otp through the provided email for verification
    sendEmail({
      subject: "Verification OTP for PlayPal",
      html:html,
      to: email,
      from: process.env.EMAIL,
    });
    res.status(201).send({ success: true, data: { user } });
  } else {
    res.status(400);
    throw new Error("Invalid data");
  }
};

export { authUser, login, registerUser };
