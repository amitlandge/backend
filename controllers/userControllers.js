const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/userSchema");
const ErrorHandler = require("../error.js");
const register = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    if (!name && !email && !password) {
      return next(new ErrorHandler("Please fill all the information"));
    }
    let user = await User.findOne({ email: email });
    if (user) {
      return next(new ErrorHandler("User is already registered"));
    }
    const bcrypt = await bcryptjs.hash(password, 10);
    if (!bcrypt) {
      return next(new ErrorHandler("Something went wrong"));
    }
    let createUser = await User.create({
      name,
      email,
      password: bcrypt,
    });

    const jwtToken = jwt.sign(
      { email: createUser.email },
      process.env.SECRET_KEY
    );

    res
      .status(200)
      .cookie("token", jwtToken, {
        httpOnly: true,
        secure: false, // true in production (HTTPS)
        sameSite: "Lax", // or "None" if frontend/backend on different domains
      })
      .json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
      });
  } catch (error) {
    next(error);
  }
};
const login = async (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);
  try {
    if (!email && !password) {
      return next(new ErrorHandler("Please fill all information"));
    }
    let user = await User.findOne({ email: email });
    if (!user) {
      return next(new ErrorHandler("User Not Found"));
    }
    const comparePass = await bcryptjs.compare(password, user.password);
    console.log(comparePass);
    if (!comparePass) {
      return next(new ErrorHandler("Password dose not match"));
    }

    const jwtToken = jwt.sign({ email: user.email }, process.env.SECRET_KEY);
    console.log(jwtToken);
    res
      .status(200)
      .cookie("token", jwtToken, {
        httpOnly: true,
        secure: false, // true in production (HTTPS)
        sameSite: "Lax", // or "None" if frontend/backend on different domains
      })
      .json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
      });
  } catch (error) {
    next(error);
  }
};

const myProfile = async (req, res, next) => {
  const user = req.user;
  if (!user) {
    return next(new ErrorHandler("User is invalid"));
  }
  res.status(200).json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
  });
};
const logout = async (req, res, next) => {
  res.cookie("token", "");
  res.status(200).json({
    message: "Logout Successfully",
  });
};
module.exports = { register, login, myProfile, logout };
