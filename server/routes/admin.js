const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

const adminLayout = "../views/layouts/admin.ejs";

// HOME
// Get
router.get("/admin", async (req, res) => {
  try {
    const locals = {
      title: "Admin Page",
      description: "Nodejs Blog using expressjs and ejs",
    };
    res.render("admin/login", { locals, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
