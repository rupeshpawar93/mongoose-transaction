const { check, validationResult } = require("express-validator");
const { User, File } = require("./../Models/Module");
const fs = require("fs");
const mongoose = require('mongoose');

/**
 * @api {post} /api/app/upload-file upload file
 * @apiName store
 * @apiParam uploader
 * @returns File
 * */
exports.store = async (req, res) => {
  if (!req.file) {
    return res.status(404).json({ error: "No file Found" });
  }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    let file = {
      file_name: req.file.filename,
      file_path: req.file.path,
      user_id: req.user_id,
      mime_type: req.file.mimetype
    };
    let newFile = new File(file);
    //   save file
    let fileData = await newFile.save({session});
    //   add reference of file in user
    await User.findOneAndUpdate(
      { _id: req.user_id },
      { $push: { file_id: fileData._id } },
      {
        session,
        new: true
      }
    );
    await session.commitTransaction();
    session.endSession();
    res.status(200).json({ data: fileData, message: "Success" });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({ error: err.message, message: "Failed" });
  }
};

/**
 * @api {post} /api/app/remove-file remove file
 * @apiName remove
 * @apiParam file_id
 * @returns user data with file
 * */
exports.remove = [
  check("file_id"),
  async (req, res) => {
    try {
      let fileData = await File.findOne({ _id: req.body.file_id });
      if (!fileData) {
        return res.status(404).json({ error: "File not found" });
      }
      //remove file from path sync way
      fs.unlinkSync(fileData.file_path);

      await File.deleteOne({ _id: req.body.file_id });

      let userData = await User.findOneAndUpdate(
        { _id: req.user_id },
        { $pull: { file_id: req.body.file_id } },
        { new: true }
      );
      res.status(200).json({ data: userData, message: "Deleted file" });
    } catch (err) {
      res.status(500).json({ err: err.message, message: "failed" });
    }
  }
];

/**
 * @api {get} /api/app/show-file show file list
 * @apiName show
 * @returns file data with user name
 * */
exports.show = async (req, res) => {
  try {
    let fileData = await File.find({ user_id: req.user_id }).populate(
      "user_id",
      "name"
    );
    if (!fileData) {
      return res
        .status(200)
        .json({ data: fileData, message: "No Files Found" });
    }
    res.status(200).json({ data: fileData, message: "file list" });
  } catch (err) {
    res
      .status(500)
      .json({ error: err.message, message: "Something went wrong" });
  }
};
