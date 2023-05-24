const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtValidationThroughCookies = require("../middleware/authJwt");

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
    const { username, password, confPassword } = req.body;
    if (password !== confPassword)
      return res.status(500).json({ msg: "Your passwords not matching" });
    const alreadyExistUser = await User.find({ username: username });
    if (alreadyExistUser.length > 0) {
      return res.status(500).json({ msg: "Already Existed User" });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newGeneratedUser = await User.create({
        username,
        password: hashedPassword,
      });
      res.status(201).render("admin/successRegister", {
        layout: adminLayout,
        user: newGeneratedUser,
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// Login Action
// POST username, password
router.post("/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const foundedUser = await User.findOne({ username: username });
    if (!foundedUser) {
      return res.status(401).json({ msg: "Invalid Credentials" });
    }
    const passwordIsValid = await bcrypt.compare(
      password,
      foundedUser.password
    );
    if (!passwordIsValid)
      return res.status(401).json({ msg: "Invalid Credentials" });
    const token = jwt.sign(
      { userId: foundedUser._id },
      process.env.JWT_SECRET,
      {}
    );
    res.cookie("token", token, { httpOnly: true }).redirect("dashboard");

    // res.render("admin/successLogin", {
    //   layout: adminLayout,
    //   user: foundedUser.username,
    // });
  } catch (error) {
    console.log(error);
  }
});

// Dashboard Page
// GET
router.get(
  "/admin/dashboard",
  jwtValidationThroughCookies,
  async (req, res) => {
    try {
      const locals = {
        title: "Dasboard | Home",
        description: "Nodejs Blog using expressjs and ejs",
      };
      const data = await Post.find();
      res.render("admin/dashboard", { locals, layout: adminLayout, data });
    } catch (error) {
      console.log(error);
    }
  }
);

// Delete Post
// Delete post._id
router.post(
  "/delete-post/:id",
  jwtValidationThroughCookies,
  async (req, res) => {
    try {
      const id = req.params.id;
      await Post.findByIdAndDelete(id);
      const data = await Post.find();
      res.render("admin/dashboard", { layout: adminLayout, data });
    } catch (error) {
      console.log(error);
    }
  }
);

// Add-new-Post Page
// Get
router.get("/admin/add-post", jwtValidationThroughCookies, async (req, res) => {
  try {
    const locals = {
      title: "Dasboard | Add new post",
      description: "Nodejs Blog using expressjs and ejs",
    };
    res.render("admin/add-post", { locals, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

// Add-new-Post Action
// POST title, body
router.post(
  "/admin/add-post",
  jwtValidationThroughCookies,
  async (req, res) => {
    try {
      const { title, body } = req.body;
      const newPost = await Post.create({ title, body });
      res.redirect("/admin/dashboard");
    } catch (error) {
      console.log(error);
    }
  }
);

// Edit-Post Page
// Get
router.get(
  "/admin/edit-post/:id",
  jwtValidationThroughCookies,
  async (req, res) => {
    try {
      const locals = {
        title: "Dasboard | Edit Post",
        description: "Nodejs Blog using expressjs and ejs",
      };
      const id = req.params.id;
      const postToEdit = await Post.findById(id);
      res.render("admin/edit-post", {
        locals,
        layout: adminLayout,
        postToEdit,
      });
    } catch (error) {
      console.log(error);
    }
  }
);

// Edit-Post Action
// POST title, body
router.post(
  "/admin/edit-post/:id",
  jwtValidationThroughCookies,
  async (req, res) => {
    try {
      const { title, body } = req.body;
      const id = req.params.id;
      const updatedPost = await Post.findByIdAndUpdate(
        id,
        { title, body },
        { returnDocument: "after" }
      );
      res.redirect("/admin/dashboard");
    } catch (error) {
      console.log(error);
    }
  }
);

module.exports = router;
