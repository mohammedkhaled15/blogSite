const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

const adminLayout = "../views/layouts/admin.ejs";

// Login Page
// GET
router.get("/admin", async (req, res) => {
  try {
    const locals = {
      title: "Login Page",
      description: "Nodejs Blog using expressjs and ejs",
    };
    res.render("admin/login", { locals, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

// Register Page
// Get
router.get("/admin/register", async (req, res) => {
  try {
    const locals = {
      title: "Register Page",
      description: "Nodejs Blog using expressjs and ejs",
    };
    res.render("admin/register", { locals, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

// Register Success Page
// Get
router.get("/admin/register-success", async (req, res) => {
  try {
    const locals = {
      title: "Register Success",
      description: "Nodejs Blog using expressjs and ejs",
    };
    res.render("admin/successRegister", { locals, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

// Register Action
// POST username, password
router.post("/admin/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const alreadyExistUser = await User.find({ username: username });
    if (alreadyExistUser.length > 0) {
      return res.status(500).json({ msg: "Already Existed User" });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newGeneratedUser = await User.create({
        username,
        password: hashedPassword,
      });
      res.render("admin/successRegister", { layout: adminLayout });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
