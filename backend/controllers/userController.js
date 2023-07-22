/**
 * create user
 * login user
 * authenticate user
 * logout user
 * delete user
 */

import User from "../models/user.model.js";
import { genHash, genSalt, generateToken } from "../utils/auth.utils.js";

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

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    res.status(400).send({ success: false, message: "user already exits" });
    return;
  }

  const salt = genSalt();

  const hashedPassword = await genHash(password, salt);

  const user = await User({
    status: "ACTV",
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
    generateToken(res, user._id);
    res.status(201).send({ success: true, data: { user } });
  } else {
    res.status(400);
    throw new Error("Invalid data");
  }
};

export { authUser, login, registerUser };
