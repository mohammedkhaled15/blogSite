const express = require("express");
const router = express.Router();

// HOME
router.get("", (req, res) => {
  const locals = {
    title: "NodeJs Blog",
    description: "Nodejs Blog using expressjs and ejs",
  };

  res.render("pages/index", { locals });
});
router.get("/about", (req, res) => {
  res.render("pages/about");
});

module.exports = router;
