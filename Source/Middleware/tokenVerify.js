const SECRET_KEY = process.env.SECRET_KEY;
const { User } = require("./../Models/Module");
const mongoose = require("mongoose");
var jwt = require("jsonwebtoken");
var excludedUrls = ["/api/register", "/api/signin"];

// GetTokenFromHeader
var getTokenFromHeader = headers => {
  if (headers && headers.authorization) {
    let authorization = headers.authorization;
    let part = authorization.split(" ");

    if (part.length === 2) {
      return part[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

/**
 *  filterUrl based on regex and exclude url
 * @param currUrl
 * @param regex
 * @returns boolean
 * */
var filterUrl = (currUrl, regex = null) => {
  let matches = currUrl.match(regex);
  if (excludedUrls.includes(currUrl)) {
    return false;
  }
  if (matches) {
    return false;
  }
  return true;
};

// Signing the token
exports.signToken = user => {
  return jwt.sign(user, SECRET_KEY, {
    expiresIn: 99999 * 999999999999999999999
  });
};

// Verifying token from the user
exports.verifyToken = (req, res, next) => {
  let currUrl = req.originalUrl;
  let regex = /uploads\/.*/g;

  if (filterUrl(currUrl, regex)) {
    // check header or url parameters or post parameters for token
    let token = getTokenFromHeader(req.headers);
    if (token) {
      jwt.verify(token, SECRET_KEY, async (err, decoded) => {
        if (err) {
          return res.status(401).json({ error: "Failed to authenticate" });
        } else {
          let userDetail = {
            id: decoded.id
          };
          let flag = await User.findOne({ _id: decoded.id });
          if (flag) {
            req.user_id = decoded.id;
            req.newToken = this.signToken(userDetail);
            next();
          } else {
            return res.status(401).json({ error: "Failed to authenticate" });
          }
        }
      });
    } else {
      // if there is no token
      // return an error
      return res.status(403).json({ error: "No token was provided." });
    }
  } else {
    next();
  }
};
