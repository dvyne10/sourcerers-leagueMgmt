import multer from "multer";
import multerS3 from "multer-s3";
import { s3Storage } from "../config/s3-bucket.js";

const storageProfile = multerS3({
  s3: s3Storage,
  bucket: "playpal-images",
  key: (req, file, cb) => {
    const fileName = `images/profilepictures/${req.user._id.toString()}.jpeg`;
    cb(null, fileName);
  },
});

const storageCreateTeamPhotos = multerS3({
  s3: s3Storage,
  bucket: "playpal-images",
  key: (req, file, cb) => {
    const subFolder =
      file.fieldname === "logo" ? "teamlogos" : "teambanners";
    const fileName = `images/${subFolder}/${Date.now()}-${req.user._id.toString()}${
      req.body.teamName
    }.jpeg`;
    cb(null, fileName);
  },
});

const storageUpdateTeamPhotos = multerS3({
  s3: s3Storage,
  bucket: "playpal-images",
  key: (req, file, cb) => {
    const subFolder =
      file.fieldname === "logo" ? "teamlogos" : "teambanners";
    const fileName = `images/${subFolder}/${req.params.teamid}.jpeg`;
    cb(null, fileName);
  },
});

const storageCreateLeaguePhotos = multerS3({
  s3: s3Storage,
  bucket: "playpal-images",
  key: (req, file, cb) => {
    const subFolder =
      file.fieldname === "logo" ? "leaguelogos" : "leaguebanners";
    const fileName = `images/${subFolder}/${Date.now()}-${req.user._id.toString()}${
      req.body.leagueName
    }.jpeg`;
    cb(null, fileName);
  },
});

const storageUpdateLeaguePhotos = multerS3({
  s3: s3Storage,
  bucket: "playpal-images",
  key: (req, file, cb) => {
    const subFolder =
      file.fieldname === "logo" ? "leaguelogos" : "leaguebanners";
    const fileName = `images/${subFolder}/${req.params.leagueid}.jpeg`;
    cb(null, fileName);
  },
});

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
