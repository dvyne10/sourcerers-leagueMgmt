import path from "path";
import multer from "multer";
import multerS3 from "multer-s3";
import { s3Storage } from "../config/s3-bucket.js";

const storageProfile = multerS3({
  s3: s3Storage,
  bucket: "playpal-images",
  // acl: "public-read",
  key: (req, file, cb) => {
    // console.log(file,s3Storage)
    const fileName = `images/profilepictures/${req.user._id.toString()}.jpeg`;
    cb(null, fileName);
  },
});

// const storageProfile = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.resolve("images", "profilepictures/"));
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${req.user._id.toString()}.jpeg`);
//   },
// });

const storageCreateTeamPhotos = multerS3({
  s3: s3Storage,
  bucket: "playpal-images",
  key: (req, file, cb) => {
    const fileName = `images/teamlogos/${Date.now()}-${req.user._id.toString()}${
      req.body.teamName
    }.jpeg`;
    cb(null, fileName);
  },
});

// const storageCreateTeamPhotos = multer.diskStorage({
//   destination: (req, file, cb) => {
//     if(file.fieldname === "logo") {
//       cb(null, path.resolve("images", "teamlogos/"));
//     }
//     if(file.fieldname === "banner") {
//       cb(null, path.resolve("images", "teambanners/"));
//     }
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${Date.now()}-${req.user._id.toString()}${req.body.teamName}.jpeg`);
//   },
// });

const storageUpdateTeamPhotos = multerS3({
  s3: s3Storage,
  bucket: "playpal-images",
  key: (req, file, cb) => {
    const fileName = `images/teamlogos/${req.params.teamid}.jpeg`;
    cb(null, fileName);
  },
});

// const storageUpdateTeamPhotos = multer.diskStorage({
//   destination: (req, file, cb) => {
//     if(file.fieldname === "logo") {
//       cb(null, path.resolve("images", "teamlogos/"));
//     }
//     if(file.fieldname === "banner") {
//       cb(null, path.resolve("images", "teambanners/"));
//     }
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${req.params.teamid}.jpeg`);
//   },
// });



const storageCreateLeaguePhotos = multerS3({
  s3: s3Storage,
  bucket: "playpal-images",
  key: (req, file, cb) => {
    const subFolder =
      file.fieldname === "logo" ? "leaguelogos/" : "leaguebanners/";
    const fileName = `images/${subFolder}/${Date.now()}-${req.user._id.toString()}${
      req.body.leagueName
    }.jpeg`;
    cb(null, fileName);
  },
});

// const storageCreateLeaguePhotos = multer.diskStorage({
//   destination: (req, file, cb) => {
//     if(file.fieldname === "logo") {
//       cb(null, path.resolve("images", "leaguelogos/"));
//     }
//     if(file.fieldname === "banner") {
//       cb(null, path.resolve("images", "leaguebanners/"));
//     }
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${Date.now()}-${req.user._id.toString()}${req.body.leagueName}.jpeg`);
//   },
// });

const storageUpdateLeaguePhotos = multerS3({
  s3: s3Storage,
  bucket: "playpal-images",
  key: (req, file, cb) => {
    const subFolder =
      file.fieldname === "logo" ? "leaguelogos/" : "leaguebanners/";
    const fileName = `images/${subFolder}/${Date.now()}-${req.user._id.toString()}${
      req.body.leagueName
    }.jpeg`;
    cb(null, fileName);
  },
});

// const storageUpdateLeaguePhotos = multer.diskStorage({
//   destination: (req, file, cb) => {
//     if (file.fieldname === "logo") {
//       cb(null, path.resolve("images", "leaguelogos/"));
//     }
//     if (file.fieldname === "banner") {
//       cb(null, path.resolve("images", "leaguebanners/"));
//     }
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${req.params.leagueid}.jpeg`);
//   },
// });

export const updateProfilePic = multer({ storage: storageProfile }).single(
  "image"
);
export const createTeamLogoAndBanner = multer({
  storage: storageCreateTeamPhotos,
}).fields([
  { name: "logo", maxCount: 1 },
  { name: "banner", maxCount: 1 },
]);
export const updateTeamLogoAndBanner = multer({
  storage: storageUpdateTeamPhotos,
}).fields([
  { name: "logo", maxCount: 1 },
  { name: "banner", maxCount: 1 },
]);
export const createLeagueLogoAndBanner = multer({
  storage: storageCreateLeaguePhotos,
}).fields([
  { name: "logo", maxCount: 1 },
  { name: "banner", maxCount: 1 },
]);
export const updateLeagueLogoAndBanner = multer({
  storage: storageUpdateLeaguePhotos,
}).fields([
  { name: "logo", maxCount: 1 },
  { name: "banner", maxCount: 1 },
]);
