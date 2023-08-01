import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const authenticate = async (req, res, next) => {
  let token;
  token = req.cookies.jwt;

  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
      if (err) {
        res.status(404).send({ message: "Invalid token" });
      }

      return data;
    });

    const user = await User.findById(decoded.userId);

    req.user = user;
    next();
    try {
    } catch (error) {
      res.status(404).send({ message: "Invalid token" });
    }
  } else {
    res.status(404).send({ message: "not Authorized" });
  }
};

export const getTokenFromCookies = async (req, res, next) => {
  let token;
  let userId;
  if (req.cookies.jwt) {
    token = req.cookies.jwt;
    const decoded = jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
      if (err) {
        req.userId = null;
      }

      return data;
    });

    userId = decoded.userId;
  }

  req.userId = userId;
  next();
};
