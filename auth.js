const jwt = require("jsonwebtoken");
const User = require("./model/userSchema");
const ErrorHandler = require("./error.js");
const auth = async (req, res, next) => {
  const token = req?.cookies["token"];
  console.log(token);
  try {
    if (!token) {
      return next(new ErrorHandler("Token is Invalid"));
    }
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    console.log(decode);
    const user = await User.findOne({ email: decode?.email });
    if (!user) {
      return next(new ErrorHandler("User Not Found"));
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = auth;
