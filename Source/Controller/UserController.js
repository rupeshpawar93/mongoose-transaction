const { check, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const { User } = require("./../Models/Module");
var signToken = require("./../Middleware/tokenVerify").signToken;

/**
 * @api {post} /api/app/register Register User information
 * @apiName register
 * @apiParam name
 * @apiParam username
 * @apiParam password
 * @returns User Info
 * */
exports.register = [
  check("name")
    .isLength({ min: 3 })
    .withMessage("length must be or greater then 3"),
  check("username")
    .isLength({ min: 3 })
    .withMessage("length must be or greater then 3")
    .isEmail()
    .withMessage("Must be valid Email"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("length must be or greater then 6")
    .isAlphanumeric()
    .withMessage("Must be only alphanumeric"),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
  
    try {
      let userDetail = {
        name: req.body.name,
        username: req.body.username,
        password: req.body.password
      };

      let newUser = new User(userDetail);
     
      newUser.save(async (err, result) => {
        if (err) {
          res.status(500).json({ error: err.message, message: "failed" });
        } else {
          result = result.toObject();
          delete result.password;       
          res
            .status(200)
            .json({ data: result, message: "Successfully created" });
        }
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
];

/**
 * @api {post} /api/app/signin Sigin User
 * @apiName signin
 * @apiParam username
 * @apiParam password
 * @returns User Info
 * */
exports.signin = [
  check("username")
    .isLength({ min: 3 })
    .withMessage("length must be or greater then 3")
    .isEmail()
    .withMessage("Must be valid Email"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("length must be or greater then 6")
    .isAlphanumeric()
    .withMessage("Must be only alphanumeric"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      let user = mongoose.model("users");
      user.findOne({ username: req.body.username }, (err1, result) => {
        if (result) {
          result.comparePassword(req.body.password, (err, isMatch) => {
            if (err) {
              res.status(500).send({ error: err.message });
            } else {
              let data = {};
              data.isMatch = isMatch;
              data.token = data.isMatch ? signToken({ id: result._id }) : "";
              data._id = result._id;
              data.isMatch
                ? res
                    .status(200)
                    .json({ data: data, message: "Sucessfully signed in" })
                : res.status(401).json({ errror: "Wrong password" });
            }
          });
        } else {
          res.status(404).json({ error: "No User found of this email" });
        }
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
];
