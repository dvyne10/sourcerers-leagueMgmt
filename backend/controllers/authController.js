import User from "../models/user.model.js";
import { genHash, generateToken } from "../utils/auth.utils.js";

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = User.findOne({ email });
  // compare hash password to the user password in the database
  const hashedPassword = await genHash(password, user.salt);

  if (hashedPassword === user.password) {
    generateToken(res, user._id);
    res.status(200).send({
      message: "Auth user",
      user,
    });
  }
};

export const logout = async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).send({ message: "user successfully logged out" });
};

export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  const currentTime = Date.now();

  try {
    const user = await User.findOne({ email });

    if (user) {
      //check the otp
      if (otp === user.detailsOTP.OTP) {
        //check the dates
        const otpDate = new Date(user.detailsOTP.expiryTimeOTP).getDate();
        const currentTimeDate = new Date(currentTime).getDate();
        if (otpDate === currentTimeDate) {
          //check the time
          const otpTime = new Date(user.detailsOTP.expiryTimeOTP).getTime();
          const currentOtpTime = new Date(currentTime).getTime();

          const minutes = Math.floor((currentOtpTime - otpTime) / 60000);

          //   const secondsOnTime = (
          //     ((currentOtpTime - otpTime) % 60000) /
          //     1000
          //   ).toFixed(0);
          console.log(minutes);
          const secondsRemaining =
            300 - ((currentOtpTime - otpTime) / 1000).toFixed(0);

          if (minutes < 5 && secondsRemaining > 0) {
            // generate token
            generateToken(res, user._id);

            return res.status(200).send({
              success: true,
              message: "OTP verified",
              remainingTime: `${secondsRemaining}s`,
            });
          } else {
            return res
              .status(401)
              .send({ success: false, message: "OTP has expiredd" });
          }
        } else {
          return res
            .status(401)
            .send({ success: false, message: "OTP has expired" });
        }
      } else {
        return res.status(401).send({ success: false, message: "invalid OTP" });
      }
    } else {
      return res
        .status(401)
        .send({ success: false, message: "user not found" });
    }
  } catch (error) {}

  res.status(200).json({
    message: currentTime,
  });
};

const authenticateUser = () => {};
