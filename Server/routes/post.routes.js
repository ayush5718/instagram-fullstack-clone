import express from "express";
import {
  addComment,
  addNewPost,
  bookmarkPost,
  deletePost,
  dislikePost,
  getAllPost,
  getCommentsOfPost,
  getUserPost,
  likePost,
} from "../controllers/post.controller.js";
import isAuthenticated from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.js";
const router = express.Router();

// add new post
router
  .route("/addpost")
  .post(isAuthenticated, upload.single("image"), addNewPost);

// get all post
router.route("/getallpost").get(isAuthenticated, getAllPost);

// get user post
router.route("/userpost/all").get(isAuthenticated, getUserPost);

// like post
router.route("/:id/like").get(isAuthenticated, likePost);

// dislike post
router.route("/:id/dislike").get(isAuthenticated, dislikePost);

// add comment
router.route("/:id/comment").post(isAuthenticated, addComment);

// get comment for specific post
router.route("/:id/comment/all").post(isAuthenticated, getCommentsOfPost);

// delete post
router.route("/delete/:id").delete(isAuthenticated, deletePost);

// bookmark post or unbookmark
router.route("/:id/bookmark").get(isAuthenticated, bookmarkPost);

export default router;
