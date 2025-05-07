const ErrorHandler = require("../error");

const Post = require("../model/postSchema");
const createPost = async (req, res, next) => {
  try {
    const file = req.file;
    const description = req.body.description;
    const userId = req.body.userId;

    if (!file) {
      return next(new ErrorHandler("No file uploaded"));
    }

    const mediaType = file.mimetype.startsWith("image") ? "image" : "video";
    const newPost = Post.create({
      description,
      mediaUrl: `/uploads/${file.filename}`,
      mediaType,
      userId,
    });

    res.status(200).json(newPost);
  } catch (err) {
    next(err);
  }
};
const allPosts = async (req, res, next) => {
  const posts = await Post.find().populate("userId", "name");
  if (posts) {
    res.status(200).json({
      posts: posts,
    });
  }
};
const likePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { pid } = req.params;

    const post = await Post.findById(pid);
    if (!post) {
      return next(new ErrorHandler("Post not found", 404));
    }

    const isLiked = post.likes.includes(userId.toString());

    if (isLiked) {
      // Unlike
      post.likes = post.likes.filter(
        (uid) => uid.toString() !== userId.toString()
      );
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.status(200).json({
      success: true,
      message: isLiked ? "Post unliked" : "Post liked",
      likes: post.likes.length,
      post,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = { createPost, allPosts, likePost };
