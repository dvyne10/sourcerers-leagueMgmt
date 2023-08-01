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

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    res.status(200).send({
      requestStatus: "RJCT",
      errMsg: "A user with this email already exits",
    });
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

  try {
    if (user) {
      // generating otp
      const otp = generateOTP();
      const otpDate = new Date();

      console.log(otp, otpDate);

      user.detailsOTP.OTP = parseInt(otp);
      user.detailsOTP.expiryTimeOTP = otpDate;
      await user.save();

      // generating email
      const html = generateOTPEmail(otp, userName, email);

      // sending the otp through the provided email for verification
      // await sendEmail({
      //   subject: "Verification OTP for PlayPal",
      //   html: html,
      //   to: email,
      //   from: process.env.EMAIL,
      // })
      //   .then(() => {
      //     console.log("email has been sent");
      //   })
      //   .catch((e) => {
      //     console.log(`email could not be sent ${e}`);
      //   });

      res.status(201).send({ requestStatus: "ACTC", user });
    } else {
      res.status(400);
      throw new Error("Invalid data");
    }
  } catch (error) {
    res.status(400).send({ success: false, error });
  }
};

export { registerUser };
