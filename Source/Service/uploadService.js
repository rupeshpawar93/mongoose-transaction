const POST_MAX_SIZE = 30 * 1024 * 1024; //MB
const UPLOAD_MAX_FILE_SIZE = 2;
var multer = require("multer");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    if (
      !file.mimetype.includes("jpeg") &&
      !file.mimetype.includes("jpg") &&
      !file.mimetype.includes("png") &&
      !file.mimetype.includes("gif") &&
      !file.mimetype.includes("pdf")
    ) {
      return cb(new Error("Only images and pdf are allowed"));
    }
    cb(null, "uploads/");
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + file.originalname);
  }
});

/**
 * function singleFIle
 *
 * */
exports.sinlgeFile = (req, res, next) => {
  multer({
    storage,
    limits: { fileSize: POST_MAX_SIZE }
  }).single("uploader")(req, res, function(err) {
    //Catching and handling errors of multer
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ error: err.message });
    } else if (err) {
      return res.status(500).json({ error: err.message });
    }
    next();
  });
};
