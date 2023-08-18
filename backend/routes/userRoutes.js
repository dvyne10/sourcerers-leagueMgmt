import express from "express";
import multerS3 from "multer-s3";
import path from "path";
import multer from "multer";

import {
  forgotPassword,
  registerUser,
  resetPassword,
} from "../controllers/userController.js";
import { login, logout, verifyOTP } from "../controllers/authController.js";
import { s3Storage } from "../config/s3-bucket.js";

const router = express.Router();

// const photoUploadDir = path.resolve("images", "profilepictures/");

const storage = multerS3({
  s3: s3Storage,
  bucket: "playpal-images",
  // acl: "public-read",
  key: (req, file, cb) => {
    // console.log(file,s3Storage)
    const fileName = `images/profilepictures/${Date.now() + "-" + file.originalname}`;
    cb(null, fileName);
  },
});

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, photoUploadDir);
//   },
//   filename: function (req, file, cb) {
//     console.log(file,'logging files')
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

const upload = multer({ storage: storage }).single("image");

// registration and login processes
router.post("/login", login);
router.post("/register",upload, registerUser);
router.post("/verifyotp", verifyOTP);
router.post("/logout", logout);
router.post("/forgotpassword", forgotPassword);
router.post("/resetpassword", resetPassword);

export default router;
