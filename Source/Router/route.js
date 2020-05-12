const express = require("express");
const router = new express.Router();
var UserController = require("./../Controller/UserController");
var FileController = require("./../Controller/FileController");
var fileUpload = require("./../Service/uploadService").sinlgeFile;

/**router are defined here **/
router.post("/register", UserController.register);

router.post("/signin", UserController.signin);

router.post("/upload-file", fileUpload, FileController.store);

router.post("/remove-file", FileController.remove);

router.get("/show-file", FileController.show);

module.exports = router;
