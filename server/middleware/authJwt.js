const jwt = require("jsonwebtoken");

const jwtValidationThroughCookies = async (req, res, next) => {
  try {
    const token = req?.cookies?.token;
    if (!token) return res.redirect("/admin");
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.redirect("/admin");
      req.userId = decoded.userId;
      next();
    });
  } catch (error) {
    res.status(403).json("Access not Authorized");
  }
};

module.exports = jwtValidationThroughCookies;
