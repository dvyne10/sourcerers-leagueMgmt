import path from "path";
import multer from "multer";

export const updateProfilePic = async (req, res, next) => {
  const photoUploadDir = path.resolve("images", "profilepictures/");
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, photoUploadDir);
    },
    filename: function (req, file, cb) {
      cb(null, `${req.user._id.toString()}.jpeg`);
    },
  });
  const upload = multer({ storage: storage }).single("image");
  next();
};

