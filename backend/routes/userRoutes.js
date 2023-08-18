import express from "express";

import path from "path";
import multer from "multer";

import {
  forgotPassword,
  registerUser,
  resetPassword,
} from "../controllers/userController.js";
import { login, logout, verifyOTP } from "../controllers/authController.js";

const router = express.Router();

const photoUploadDir = path.resolve("images", "profilepictures/");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, photoUploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage }).single("image");

// registration and login processes
router.post("/login", login);
router.post("/register",upload, registerUser);
router.post("/verifyotp", verifyOTP);
router.post("/logout", logout);
router.post("/forgotpassword", forgotPassword);
router.post("/resetpassword", resetPassword);

export default router;
