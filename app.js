require("dotenv").config();
const express = require("express");
const expressLayout = require("express-ejs-layouts");
const connectDB = require("./server/config/dbConnect");

const app = express();
const PORT = process.env.PORT || 3000;

// Connect DB
connectDB();

app.use(express.static("public"));

// Templating Engine
app.use(expressLayout);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

app.use("/", require("./server/routes/main"));

app.listen(PORT, () => {
  console.log(`Listening to port no ${PORT}`);
});
