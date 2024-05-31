const multer = require("multer");
global.__basedir = __dirname + "/..";

const imageFilter = (req, file, cb) => {
  // Check if the file's MIME type is either 'image/jpeg' or 'image/png'
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb("Please upload only JPG or PNG files. Other files are not allowed.", false);
  }
};

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/resources/static/assets/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-bezkoder-${file.originalname}`);
  },
});

var uploadFile = multer({ storage: storage, fileFilter: imageFilter });

module.exports = uploadFile;
