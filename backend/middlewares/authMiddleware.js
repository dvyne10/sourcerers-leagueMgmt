import jwt, { decode } from "jsonwebtoken";
import User from "../models/user.model.js";

export const authenticate = async (req, res, next) => {
  let token;
  token = req.cookies.jwt;

  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
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
