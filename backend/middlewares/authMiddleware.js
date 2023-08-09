import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const authenticate = async (req, res, next) => {
  let token;
  token = req.header("Authorization").replace("Bearer ", "");
  try {
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
        if (err) {
          console.log(err);
          // res.status(401).send({ message: "Invalid token" });
        } else {
          return data;
        }
      });

      if (decoded) {
        const user = await User.findById(decoded.userId);
        req.user = user;
      }
      next();
    } else {
      res.status(404).send({ message: "Not authorized" });
    }
  } catch (error) {
    res.status(401).send({ message: "Invalid token!" });
  }
};

export const getTokenFromCookies = async (req, res, next) => {
  let token = req.header("Authorization").replace("Bearer ", "");
  let userId = "";
  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
      if (err) {
        req.userId = ""
      }
      return data;
    });
    userId = decoded.userId;
  }
  req.userId = userId;
  next();
};

export const adminAuthenticate = async (req, res, next) => {
  let token = req.header("Authorization").replace("Bearer ", "");
  try {
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
        if (err) {
          console.log(err);
        } else {
          return data;
        }
      });
      if (decoded) {
        const user = await User.findById(decoded.userId);
        if (user.userType !== "ADMIN") {
          res.status(404).send({ message: "Not authorized" });
          return;
        } else {
          req.user = user;
          next();
        }
      }
    } else {
      res.status(404).send({ message: "Not authorized" });
    }
  } catch (error) {
    res.status(401).send({ message: "Invalid token!" });
  }
};
