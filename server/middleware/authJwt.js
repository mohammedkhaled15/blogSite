const jwt = require("jsonwebtoken");
const User = require("../models/User");

const jwtValidationThroughCookies = async (req, res, next) => {
  try {
    const token = req?.cookies?.token;
    if (!token) return res.redirect("/admin");
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) return res.redirect("/admin");
      const { username } = await User.findOne({ _id: decoded.userId }).exec();
      req.userId = decoded.userId;
      req.username = username;
      next();
    });
  } catch (error) {
    res.status(403).json("Access not Authorized");
  }
};

module.exports = jwtValidationThroughCookies;
