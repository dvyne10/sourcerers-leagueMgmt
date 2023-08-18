import path from "path";
import multer from "multer";

const storageProfile = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve("images", "profilepictures/"));
  },
  filename: function (req, file, cb) {
    cb(null, `${req.user._id.toString()}.jpeg`);
  },
});

const storageCreateTeamPhotos = multer.diskStorage({
  destination: (req, file, cb) => {
    if(file.fieldname === "logo") {
      cb(null, path.resolve("images", "teamlogos/"));
    }
    if(file.fieldname === "banner") {
      cb(null, path.resolve("images", "teambanners/"));
    }
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${req.user._id.toString()}${req.body.teamName}.jpeg`);
  },
});

const storageUpdateTeamPhotos = multer.diskStorage({
  destination: (req, file, cb) => {
    if(file.fieldname === "logo") {
      cb(null, path.resolve("images", "teamlogos/"));
    }
    if(file.fieldname === "banner") {
      cb(null, path.resolve("images", "teambanners/"));
    }
  },
  filename: function (req, file, cb) {
    cb(null, `${req.params.teamid}.jpeg`);
  },
});

const storageCreateLeaguePhotos = multer.diskStorage({
  destination: (req, file, cb) => {
    if(file.fieldname === "logo") {
      cb(null, path.resolve("images", "leaguelogos/"));
    }
    if(file.fieldname === "banner") {
      cb(null, path.resolve("images", "leaguebanners/"));
    }
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${req.user._id.toString()}${req.body.leagueName}.jpeg`);
  },
});

const storageUpdateLeaguePhotos = multer.diskStorage({
  destination: (req, file, cb) => {
    if(file.fieldname === "logo") {
      cb(null, path.resolve("images", "leaguelogos/"));
    }
    if(file.fieldname === "banner") {
      cb(null, path.resolve("images", "leaguebanners/"));
    }
  },
  filename: function (req, file, cb) {
    cb(null, `${req.params.leagueid}.jpeg`);
  },
});

export const updateProfilePic = multer({ storage: storageProfile }).single("image");
export const createTeamLogoAndBanner = multer({ storage: storageCreateTeamPhotos }).fields([{ name: 'logo', maxCount: 1 }, { name: 'banner', maxCount: 1 }])
export const updateTeamLogoAndBanner = multer({ storage: storageUpdateTeamPhotos }).fields([{ name: 'logo', maxCount: 1 }, { name: 'banner', maxCount: 1 }])
export const createLeagueLogoAndBanner = multer({ storage: storageCreateLeaguePhotos }).fields([{ name: 'logo', maxCount: 1 }, { name: 'banner', maxCount: 1 }])
export const updateLeagueLogoAndBanner = multer({ storage: storageUpdateLeaguePhotos }).fields([{ name: 'logo', maxCount: 1 }, { name: 'banner', maxCount: 1 }])