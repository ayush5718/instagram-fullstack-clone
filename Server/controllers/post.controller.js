import sharp from "sharp";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import cloudinary from "../config/cloudinary.js";
import { getRecieverSocketId, io } from "../socket/socket.js";

export const addNewPost = async (req, res) => {
  try {
    let caption = req.body.caption;
    const image = req.file;

    if (!caption || !image) {
      return res.status(400).json({
        message: "caption and image is required",
        success: false,
      });
    }

    const authorId = req.id;
    // image upload
    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    // buffer to data uri
    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
      "base64"
    )}`;

    const cloudResponse = await cloudinary.uploader.upload(fileUri);
    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: authorId,
    });

    const user = await User.findById(authorId);
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }

    await post.populate({ path: "author", select: "-password" });

    return res.status(201).json({
      message: "New post added",
      post,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// get all post
export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username profilePicture bio" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "username profilePicture" },
      });

    posts.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB - dateA;
    });

    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// get post by user
export const getUserPost = async (req, res) => {
  try {
    const authorId = req.id;
    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "username  profilePicture  -password ",
      })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "username profilePicture bio" },
      });

    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// for like post
export const likePost = async (req, res) => {
  try {
    const likeKarneWalaKiId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);

    //check if post not found
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }

    // like logic
    await post.updateOne({ $addToSet: { likes: likeKarneWalaKiId } });

    await post.save();

    // implement socet io for real time notification
    const user = await User.findById(likeKarneWalaKiId).select(
      "username profilePicture"
    );
    const postAuthor = post.author.toString();
    if (user !== postAuthor) {
      // emit a notification event
      const notification = {
        type: "like",
        userId: likeKarneWalaKiId,
        userDetails: user,
        postId: postId,
        message: "Your post has been liked",
      };
      const postAuthorSocketId = getRecieverSocketId(postAuthor);
      io.to(postAuthorSocketId).emit("notification", notification);
    }

    return res.status(200).json({
      message: "Post liked",
      success: true,
    });
  } catch (error) {}
};

// for dislike post
export const dislikePost = async (req, res) => {
  try {
    const dislikeKarneWalaKiId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }
    await post.updateOne({ $pull: { likes: dislikeKarneWalaKiId } });
    await post.save();

    // implement socet io for real time notification
    const user = await User.findById(dislikeKarneWalaKiId).select(
      "username profilePicture"
    );
    const postAuthor = post.author.toString();
    if (user !== postAuthor) {
      // emit a notification event
      const notification = {
        type: "dislike",
        userId: dislikeKarneWalaKiId,
        userDetails: user,
        postId: postId,
        message: "Your post has been liked",
      };
      const postAuthorSocketId = getRecieverSocketId(postAuthor);
      io.to(postAuthorSocketId).emit("notification", notification);
    }

    return res.status(200).json({
      message: "Post disliked",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// adding comment
export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const commentKrneWalaUserKiId = req.id;

    const { text } = req.body;

    const post = await Post.findById(postId);
    if (!text) {
      return res.status(400).json({
        message: "text is required",
        success: false,
      });
    }

    const comment = await Comment.create({
      text,
      author: commentKrneWalaUserKiId,
      post: postId,
    });
    await comment.populate({
      path: "author",
      select: "username profilePicture",
    });

    post.comments.push(comment._id);

    await post.save();
    return res.status(201).json({
      message: "Comment added",
      comment,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// getting comment for specific post
export const getCommentsOfPost = async (req, res) => {
  try {
    const { id: postId } = req.params.id;
    const comments = await Comment.find({ post: postId }).populate(
      "author username profilePicture"
    );

    if (!comments) {
      return res.status(404).json({
        message: "Comments not found for thi post",
        success: false,
      });
    }

    res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    console.log(error);
  }
};

// delete post controller
export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }

    // chek is logged in user is the owner of the post or not
    if (post.author.toString() !== authorId) {
      return res.status(403).json({
        message: "Unauthorized",
        success: false,
      });
    }

    // delete post
    await Post.findByIdAndDelete(postId);

    // remove the post id from the user modell
    let user = await User.findById(authorId);
    user.posts = user.posts.filter((id) => id.toString() !== postId);
    await user.save();

    // associated comments
    await Comment.deleteMany({ post: postId });

    return res.status(200).json({
      message: "Post deleted",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// bookmark post
export const bookmarkPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }

    const user = await User.findById(authorId);
    // check if user already bookmarked the post (agar wo ek bar bookmark kr diya hai toh dubara unbookmark karega na laude)
    if (user.bookmarks.includes(post._id)) {
      // already bookmarked-> unbookmark(remove from the bookmark)
      await user.updateOne({ $pull: { bookmarks: post._id } });
      await user.save();
      return res.status(200).json({
        type: "unsaved",
        message: "Post unbookmarked",
        success: true,
      });
    } else {
      // not bookmarked-> bookmark (add to the bookmark)
      await user.updateOne({ $addToSet: { bookmarks: post._id } });
      await user.save();
      return res.status(200).json({
        type: "saved",
        message: "Post bookmarked",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
