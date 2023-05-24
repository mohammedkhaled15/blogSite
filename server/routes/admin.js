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

// (async () => {
//   await Post.insertMany([
//     {
//       title: "Blog No 1",
//       body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse, nobis illo! Totam consectetur id mollitia. Exercitationem suscipit ullam quos et quis perferendis officiis eligendi illum quo enim nam, molestias at. ",
//     },
//     {
//       title: "Blog No 2",
//       body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse, nobis illo! Totam consectetur id mollitia. Exercitationem suscipit ullam quos et quis perferendis officiis eligendi illum quo enim nam, molestias at. ",
//     },
//     {
//       title: "Blog No 3",
//       body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse, nobis illo! Totam consectetur id mollitia. Exercitationem suscipit ullam quos et quis perferendis officiis eligendi illum quo enim nam, molestias at. ",
//     },
//     {
//       title: "Blog No 4",
//       body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse, nobis illo! Totam consectetur id mollitia. Exercitationem suscipit ullam quos et quis perferendis officiis eligendi illum quo enim nam, molestias at. ",
//     },
//     {
//       title: "Blog No 5",
//       body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse, nobis illo! Totam consectetur id mollitia. Exercitationem suscipit ullam quos et quis perferendis officiis eligendi illum quo enim nam, molestias at. ",
//     },
//     {
//       title: "Blog No 6",
//       body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse, nobis illo! Totam consectetur id mollitia. Exercitationem suscipit ullam quos et quis perferendis officiis eligendi illum quo enim nam, molestias at. ",
//     },
//     {
//       title: "Blog No 7",
//       body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse, nobis illo! Totam consectetur id mollitia. Exercitationem suscipit ullam quos et quis perferendis officiis eligendi illum quo enim nam, molestias at. ",
//     },
//     {
//       title: "Blog No 8",
//       body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse, nobis illo! Totam consectetur id mollitia. Exercitationem suscipit ullam quos et quis perferendis officiis eligendi illum quo enim nam, molestias at. ",
//     },
//     {
//       title: "Blog No 9",
//       body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse, nobis illo! Totam consectetur id mollitia. Exercitationem suscipit ullam quos et quis perferendis officiis eligendi illum quo enim nam, molestias at. ",
//     },
//     {
//       title: "Blog No 10",
//       body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse, nobis illo! Totam consectetur id mollitia. Exercitationem suscipit ullam quos et quis perferendis officiis eligendi illum quo enim nam, molestias at. ",
//     },
//     {
//       title: "Blog No 11",
//       body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse, nobis illo! Totam consectetur id mollitia. Exercitationem suscipit ullam quos et quis perferendis officiis eligendi illum quo enim nam, molestias at. ",
//     },
//     {
//       title: "Blog No 12",
//       body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse, nobis illo! Totam consectetur id mollitia. Exercitationem suscipit ullam quos et quis perferendis officiis eligendi illum quo enim nam, molestias at. ",
//     },
//   ]);
// })();

module.exports = router;
