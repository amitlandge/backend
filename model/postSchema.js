// models/Post.js
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  description: { type: String },
  mediaUrl: { type: String, required: true },
  mediaType: { type: String, enum: ["image", "video"], required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
      comment: {
        type: "String",
      },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Post", postSchema);
