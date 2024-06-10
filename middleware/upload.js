const multer = require('multer');
const path = require('path');
// global.__basedir = __dirname + "/..";

// const imageFilter = (req, file, cb) => {
//   // Check if the file's MIME type is either 'image/jpeg' or 'image/png'
//   if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
//     cb(null, true);
//   } else {
//     cb("Please upload only JPG or PNG files. Other files are not allowed.", false);
//   }
// };



// Set up multer for file storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   }
// });
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/resources/static/assets/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-bezkoder-${file.originalname}`);
  },
});

const upload = multer({ storage: storage, limits: { fileSize: 40000000 } });

// Create the uploads directory if it doesn't exist
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}






// var uploadFile = multer({ storage: storage, fileFilter: imageFilter }).array("files",10);

module.exports = upload;
