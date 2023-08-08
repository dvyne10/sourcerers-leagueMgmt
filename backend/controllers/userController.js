/**
 * create user
 * login user
 * authenticate user
 * logout user
 * delete user
 */

import User from "../models/user.model.js";
import SysParmModel from "../models/systemParameter.model.js";
import { getSysParmByParmId } from "../utils/sysParmModule.js";
import { generateOTPEmail } from "../templates/otpEmail.js";
import {
  genHash,
  genSalt,
  generateOTP,
  sendEmail,
} from "../utils/auth.utils.js";
import handlebars from "handlebars";

const registerUser = async (req, res) => {
  // console.log(req,'this is the request')
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
    phoneNumber,
  } = req.body;

  const existingUsername = await User.findOne({
    userName: new RegExp(`^${userName}$`, "i"),
  });

  if (existingUsername) {
    res.status(200).send({
      requestStatus: "RJCT",
      errMsg: "The username is not available.",
    });
    return;
  }

  const existingUser = await User.findOne({
    email: new RegExp(`^${email}$`, "i"),
  });

  if (existingUser) {
    res.status(200).send({
      requestStatus: "RJCT",
      errMsg: "The email is not available.",
    });
    return;
  }

  let passwordCheck = await isValidPassword(password);
  if (!passwordCheck.valid) {
    res.status(200).send({
      requestStatus: "RJCT",
      errMsg: passwordCheck.errMsg,
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
    phoneNumber,
  }).save();

  try {
    if (user) {
      // generating otp
      const otp = generateOTP();
      const otpDate = new Date();

      user.detailsOTP.OTP = parseInt(otp);
      user.detailsOTP.expiryTimeOTP = otpDate.setMinutes(
        otpDate.getMinutes() + 5
      );
      await user.save();

      // generating email
      const html = generateOTPEmail(otp, userName, email);

      // sending the otp through the provided email for verification
      await sendEmail({
        subject: "Verification OTP for PlayPal",
        html: html,
        to: email,
        from: process.env.EMAIL,
      })
        .then(() => {
          console.log("email has been sent");
        })
        .catch((e) => {
          console.log(`email could not be sent ${e}`);
        });

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

export const isValidPassword = async (password) => {
  let loginParm = await getSysParmByParmId("login");
  loginParm = loginParm.data.login;
  if (password.length < loginParm.minPasswordLength) {
    return {
      valid: false,
      errMsg: `Password must be at least ${loginParm.minPasswordLength} characters.`,
    };
  }
  if (
    loginParm.passwordCriteria.capitalLetterIsRequired &&
    !checkPasswordChar(password, loginParm.passwordCriteria.capitalLettersList)
  ) {
    return { valid: false, errMsg: `Password requires a capital letter.` };
  }
  if (
    loginParm.passwordCriteria.specialCharacterIsRequired &&
    !checkPasswordChar(password, loginParm.passwordCriteria.specialCharsList)
  ) {
    return { valid: false, errMsg: `Password requires a special character.` };
  }
  if (
    loginParm.passwordCriteria.numberIsRequired &&
    !checkPasswordChar(password, loginParm.passwordCriteria.numbersList)
  ) {
    return { valid: false, errMsg: `Password requires a numeric character.` };
  }
  return { valid: true };
};

const checkPasswordChar = (password, charsToCheck) => {
  if (password === "" || charsToCheck === "") {
    return false;
  }
  for (let i = 0; i < password.length; i++) {
    if (charsToCheck.indexOf(password.charAt(i)) != -1) {
      return true;
    }
  }
  return false;
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();
  const otpDate = new Date();
  const user = await User.findOne({
    $or: [
      { userName: new RegExp(`^${email}$`, "i") },
      { email: new RegExp(`^${email}$`, "i") },
    ],
  });

  // check if the provided email or userName exists before saving otp to the user object
  console.log(user);
  if (!user) {
    res.send({
      requestStatus: "RJCT",
      errMsg: "The username or email does not exist ",
    });
  } else {
    // if the user exists generate otp and save
    user.detailsOTP.OTP = parseInt(otp);
    user.detailsOTP.expiryTimeOTP = otpDate.setMinutes(
      otpDate.getMinutes() + 5
    );

    await user.save();

    // generating email
    const html = generateOTPEmail(otp, user.userName, email);

    await sendEmail({
      subject: "OTP for password change",
      html: html,
      to: email,
      from: process.env.EMAIL,
    })
      .then(() => {
        console.log("email has been sent");
      })
      .catch((e) => {
        console.log(`email could not be sent ${e}`);
      });

    res.send({ requestStatus: "ACTC" });
  }
};

export const changePassword = async (req, res) => {};
