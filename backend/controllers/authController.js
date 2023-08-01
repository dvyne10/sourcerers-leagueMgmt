import UserModel from "../models/user.model.js";
import SysParmModel from "../models/systemParameter.model.js";
import { genHash, generateToken } from "../utils/auth.utils.js";
import { getSysParmByParmId } from "../utils/sysParmModule.js";

export const login = async (req, res) => {
  const { email, password } = req.body;

  let user;

  if (!email || !password) {
    res.status(401).send({ message: "Incorrect email/username or password." });
  }
  user = await UserModel.findOne({
    $or: [
      { userName: new RegExp(`^${email}$`, "i") },
      { email: new RegExp(`^${email}$`, "i") },
    ],
  });
  if (!user) {
    res.status(200).send({
      requestStatus: "RJCT",
      message: "Incorrect email/username or password.",
    });
  }
  let loginParm = await getSysParmByParmId("login")
  loginParm = loginParm.data.login
  if (user) {
      const hashedPassword = genHash(password, user.salt);
      if (hashedPassword === user.password) {
        if (user.status !== 'ACTV') {
          res.status(200).send({
            requestStatus: "RJCT",
            message: "User is not allowed to login.",
          });
        } else {
          generateToken(res, user._id);
          let succLogin
          if (user.successfulLoginDetails) {
            if (user.successfulLoginDetails.length >= loginParm.numberOfLoginDtlsToKeep) {
              user.successfulLoginDetails.slice(0, user.successfulLoginDetails.length - loginParm.numberOfLoginDtlsToKeep + 1)
            }
            user.successfulLoginDetails.push({sourceIPAddress: "IPtemp", timestamp: new Date()})
            succLogin = user.successfulLoginDetails
          } else {
            succLogin = [{sourceIPAddress: "IPtemp", timestamp: new Date()}]
          }
            await UserModel.updateOne({ _id: user._id}, {    
              $set: { 
                successfulLoginDetails : succLogin,
                failedLoginDetails : null
              } 
            })
            res.status(200).send({
              requestStatus: "ACTC",
              user: {userType: user.userType, userId: user._id},
            });
        }
      } else {
        if (user.status !== 'ACTV') {
          res.status(200).send({
            requestStatus: "RJCT",
            message: "Incorrect email/username or password",
          });
        } else {
          let maxLogins = 0
          if (!user.failedLoginDetails.numberOfLoginTries || user.failedLoginDetails.numberOfLoginTries === 0) {
            maxLogins = loginParm.defaultLoginTries + Math.floor(Math.random() * loginParm.maxAdditionalLoginTries)
          } else {
            maxLogins = user.failedLoginDetails.numberOfLoginTries
          }
          let failedLogins
          let maxFailedReached = false
          let lockExp
          if (user.failedLoginDetails.failedLogins) {
            if (user.failedLoginDetails.numberOfFailedLogins + 1 >= maxLogins) {
              maxFailedReached = true
              let d1 = new Date()
              let currLockCount = user.failedLoginDetails.consecutiveLockedOuts ? user.failedLoginDetails.consecutiveLockedOuts : 0
              let minsLock = (currLockCount + 1 ) * loginParm.lockedAccountTiming
              lockExp = d1.setMinutes(d1.getMinutes() + minsLock)
            } else {
              user.failedLoginDetails.failedLogins.push({sourceIPAddress: "IPtemp", timestamp: new Date()})
              failedLogins = user.failedLoginDetails.failedLogins
            }
          } else {
            failedLogins = [{sourceIPAddress: "IPtemp", timestamp: new Date()}]
          }
          if (maxFailedReached === false) {
            await UserModel.updateOne({ _id: user._id}, {    
              $set: { failedLoginDetails : {
                numberOfLoginTries: maxLogins,
                numberOfFailedLogins: ( user.failedLoginDetails.numberOfFailedLogins ? user.failedLoginDetails.numberOfFailedLogins + 1 : 1 ),
                failedLogins:  failedLogins
              } },
            })
            res.status(200).send({
              requestStatus: "RJCT",
              message: "Incorrect email/username or password",
            });
          } else {
            await UserModel.updateOne({ _id: user._id}, {
              $set: { 
                status : "LOCK",
                "failedLoginDetails.consecutiveLockedOuts" : ( user.failedLoginDetails.consecutiveLockedOuts ? user.failedLoginDetails.consecutiveLockedOuts + 1 : 1 ),
                "failedLoginDetails.lockedTimestamp" : lockExp,
                "failedLoginDetails.numberOfFailedLogins": ( user.failedLoginDetails.numberOfFailedLogins ? user.failedLoginDetails.numberOfFailedLogins + 1 : 1 ),
              },
            })
            res.status(200).send({
              requestStatus: "RJCT",
              message: "Your account has been locked.",
            });
          }
        }
      }
    }
};

export const logout = async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).send({ message: "User successfully logged out" });
};

export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  const currentTime = Date.now();

  try {
    const user = await UserModel.findOne({ email });

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
              .send({ requestStatus: "RJCT", message: "OTP has expired" });
          }
        } else {
          return res
            .status(401)
            .send({ requestStatus: "RJCT", message: "OTP has expired" });
        }
      } else {
        return res.status(401).send({ requestStatus: "RJCT", message: "Invalid OTP" });
      }
    } else {
      return res
        .status(401)
        .send({ requestStatus: "RJCT", message: "User not found" });
    }
  } catch (error) {}

  res.status(200).json({
    message: currentTime,
  });
};

const authenticateUser = () => {};
