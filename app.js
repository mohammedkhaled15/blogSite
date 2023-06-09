require("dotenv").config();
const express = require("express");
const expressLayout = require("express-ejs-layouts");
const connectDB = require("./server/config/dbConnect");
const cookeParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
const session = require("express-session");
const methodOvverride = require("method-override");
const { isActiveRoute } = require("./server/helpers/activeRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Connect DB
connectDB();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookeParser());
app.use(methodOvverride("_method"));
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      autoRemove: true,
    }),
  })
);
app.locals.isActiveRoute = isActiveRoute;
app.use(express.static("public"));

// Templating Engine
app.use(expressLayout);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

app.use("/", require("./server/routes/main"));
app.use("/", require("./server/routes/admin"));

app.listen(PORT, () => {
  console.log(`Listening to port no ${PORT}`);
});
