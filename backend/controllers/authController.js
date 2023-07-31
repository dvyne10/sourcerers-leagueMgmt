import User from "../models/user.model.js";
import { genHash, generateToken } from "../utils/auth.utils.js";

export const login = async (req, res) => {
  const { email, password } = req.body;

  let user;

  if (!email || !password) {
    res.status(401).send({ message: "Incorrect email or password" });
  }
  user = User.findOne({
    $or: [
      { userName: new RegExp(`^${email}$`, "i") },
      { email: new RegExp(`^${email}$`, "i") },
    ],
  });
  // if (email.includes("@")) {
  //   user = await User.findOne({ email });
  // } else {
  //   user = await User.findOne({ userName: email });
  // }

  // compare hash password to the user password in the database
  if (!user) {
    res.status(200).send({
      requestStatus: "RJCT",
      message: "Incorrect email or password",
    });
  }

  if (user) {
    const hashedPassword = genHash(password, user.salt);

    if (hashedPassword === user.password) {
      generateToken(res, user._id);
      res.status(200).send({
        requestStatus: "ACTC",
        user,
      });
    } else {
      res.status(200).send({
        requestStatus: "RJCT",
        message: "Incorrect email or password",
      });
    }
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

            user.status = "ACTV";
            await user.save();

            return res.status(200).send({
              requestStatus: 'ACTC',
              message: "OTP verified",
              remainingTime: `${secondsRemaining}s`,
            });
          } else {
            return res
              .status(401)
              .send({ requestStatus: "RJCT", message: "OTP has expiredd" });
          }
        } else {
          return res
            .status(401)
            .send({ requestStatus: "RJCT", message: "OTP has expired" });
        }
      } else {
        return res.status(401).send({ requestStatus: "RJCT", message: "invalid OTP" });
      }
    } else {
      return res
        .status(401)
        .send({ requestStatus: "RJCT", message: "user not found" });
    }
  } catch (error) {}

  res.status(200).json({
    message: currentTime,
  });
};

const authenticateUser = () => {};
