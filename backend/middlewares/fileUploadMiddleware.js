import path from "path";
import multer from "multer";

const photoUploadDir = path.resolve("images", "profilepictures/");

const storageProfile = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve("images", "profilepictures/"));
  },
  filename: function (req, file, cb) {
    console.log("23 " + req.user._id.toString());
    cb(null, `${req.user._id.toString()}.jpeg`);
  },
});

export const updateProfilePic = multer({ storage: storageProfile }).single(
  "image"
);
