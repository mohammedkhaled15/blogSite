const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

// HOME
// Get
router.get("", async (req, res) => {
  try {
    const locals = {
      title: "NodeJs Blog",
      description: "Nodejs Blog using expressjs and ejs",
    };
    let perPage = 6;
    let page = req.query.page || 1;
    const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();
    const count = await Post.count();
    const currentPage = parseInt(page);
    const lastPage = Math.ceil(count / parseInt(perPage));
    const nextPage = currentPage === lastPage ? null : currentPage + 1;
    const prevPage = currentPage === 1 ? null : currentPage - 1;
    res.render("pages/index", {
      locals,
      data,
      currentPage,
      nextPage,
      prevPage,
      lastPage,
      currentRoute: "/",
    });
  } catch (error) {
    console.log(error);
  }
});

// post
// Post: _id
router.get("/post/:_id", async (req, res) => {
  const id = req.params._id;
  try {
    const post = await Post.findById({ _id: id });
    const locals = {
      title: post.title,
      description: "Nodejs Blog using expressjs and ejs",
    };
    res.render("pages/post", {
      locals,
      post,
      currentRoute: `pages/post/${id}`,
    });
  } catch (error) {
    console.log(error);
  }
});

// post
// Post: searchTerm
router.post("/search", async (req, res) => {
  try {
    const locals = {
      title: "Search",
      description: "Nodejs Blog using expressjs and ejs",
    };
    const searchTerm = req.body.searchTerm;
    const serchTermNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");
    const result = await Post.find({
      $or: [
        { title: { $regex: new RegExp(serchTermNoSpecialChar, "i") } },
        { body: { $regex: new RegExp(serchTermNoSpecialChar, "i") } },
      ],
    });
    res.render("pages/search", {
      locals,
      result,
      currentRoute: "pages/search",
    });
  } catch (error) {
    console.log(error);
  }
});

// About Page
// GET
router.get("/about", (req, res) => {
  const locals = {
    title: "About",
    description: "Nodejs Blog using expressjs and ejs",
  };
  res.render("pages/about", { locals, currentRoute: "/about" });
});

// contact Page
// GET
router.get("/contact", (req, res) => {
  const locals = {
    title: "contacts",
    description: "Nodejs Blog using expressjs and ejs",
  };
  res.render("pages/contact", { locals, currentRoute: "/contact" });
});

module.exports = router;
