const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

// HOME
router.get("", async (req, res) => {
  try {
    const locals = {
      title: "NodeJs Blog",
      description: "Nodejs Blog using expressjs and ejs",
    };
    let perPage = 4;
    let page = req.query.page || 1;
    const data = await Post.aggregate([{ $sort: { createdAt: 1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    const count = await Post.count();
    const nextPage = parseInt(page + 1);
    const hasNextPage = nextPage < Math.ceil(count / parseInt(page));

    res.render("pages/index", {
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
    });
  } catch (error) {
    console.log(error);
  }
});

// router.get("/post/:_id", async (req, res) => {
//   const id = req.params._id;
//   try {
//     if (id) {
//       const post = await Post.findById(id);
//     }
//     // res.render()
//   } catch (error) {
//     console.log(error);
//   }
// });

router.get("/about", (req, res) => {
  res.render("pages/about");
});

module.exports = router;
