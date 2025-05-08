console.log("Hello Backend");
const mongoose = require("mongoose");

const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const express = require("express");
const path = require("path");
const auth = require("./auth");

const errorHandler = require("./errorHandler.js");
const {
  register,
  login,
  myProfile,
  logout,
} = require("./controllers/userControllers.js");
const {
  createPost,
  allPosts,
  likePost,
  commentOnPost,
  getSinglePost,
} = require("./controllers/postControllers.js");
const app = express();
app.use(express.json());
dotenv.config();
mongoose
  .connect("mongodb://localhost:27017/practice")
  .then(() => {
    console.log("Database Connected Successfully");
  })
  .catch(() => {
    console.log("Database Failed ");
  });

app.use(cookieParser());

let corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  optionsSuccessStatus: 200,
  // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
const upload = require("./storage.js");
app.post("/register", register);
app.post("/login", login);
app.get("/profile", auth, myProfile);
app.get("/logout", auth, logout);
app.post("/create-post", upload.single("file"), auth, createPost);
app.get("/posts", auth, allPosts);
app.get("/post/:pid", auth, getSinglePost);
app.put("/post-like/:pid", auth, likePost);
app.post("/post-comment/:pid", auth, commentOnPost);
app.use(errorHandler);
app.listen(3000, () => {
  console.log("Server is running");
});
