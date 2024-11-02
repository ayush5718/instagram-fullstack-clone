import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Input } from "./ui/input";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import axios from "@/api/axios";
import { toast } from "sonner";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Badge } from "./ui/badge";

const Post = ({ post }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { posts } = useSelector((state) => state.post);
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [liked, setLiked] = useState(post?.likes?.includes(user?._id) || false);
  const [postLikeCount, setPostLikeCount] = useState(post?.likes?.length);
  const [comment, setComment] = useState(post?.comments);
  const changeEventHandler = (event) => {
    setText(event.target.value);
    const inputText = event.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(`/post/delete/${post?._id}`, {
        withCredentials: true,
      });
      if (res?.data?.success) {
        toast.success(res?.data?.message);
        dispatch(setPosts(posts.filter((p) => p._id !== post._id)));
        setOpenDeleteModal(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const likeOrDislikeHandler = async () => {
    try {
      const action = liked ? "dislike" : "like";

      const res = await axios.get(
        `/post/${post._id}/${action}`,

        {
          withCredentials: true,
        }
      );
      if (res?.data?.success) {
        const updatedLikes = liked ? postLikeCount - 1 : postLikeCount + 1;
        setPostLikeCount(updatedLikes);
        setLiked(!liked);
        const updatedPostData = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res?.data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  // bookmark handler
  const bookmarkHandler = async () => {
    try {
      const res = await axios.get(`/post/${post._id}/bookmark`, {
        withCredentials: true,
      });
      if (res?.data?.success) {
        toast.success(res?.data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `/post/${post._id}/comment`,
        { text },
        { withCredentials: true }
      );
      if (res?.data?.success) {
        const updatedCommentData = [...comment, res?.data?.comment];
        setComment(updatedCommentData);
        const updatedPostData = posts.map((p) =>
          p._id === post._id ? { ...p, comments: updatedCommentData } : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res?.data?.message);
        setText("");
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };
  return (
    <div className="my-8 w- max-w-sm mx-auto ">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage
              src={post?.author?.profilePicture}
              className="object-cover"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2">
            <h1>{post?.author?.username}</h1>
            {user?._id === post?.author?._id && (
              <Badge variant="secondary">Author</Badge>
            )}
          </div>
        </div>
        <Dialog open={openDeleteModal} onOpenChange={setOpenDeleteModal}>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent
            onInteractOutside={() => setOpenDeleteModal(false)}
            className="flex flex-col items-center text-sm text-center"
          >
            <Button
              variant="ghost"
              className="cursor-pointer w-fit text-red-600 hover:text-red-800"
            >
              Unfollow
            </Button>

            <Button
              variant="ghost"
              className="cursor-pointer w-fit "
              onClick={bookmarkHandler}
            >
              Add to favourite
            </Button>

            {user?._id === post?.author?._id && (
              <Button
                variant="ghost"
                className="cursor-pointer w-fit "
                onClick={deletePostHandler}
              >
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <img
        className="rounded-sm my-2 w-full aspect-square object-cover"
        src={post?.image}
        alt="post_img"
      />

      <div className="flex items-center justify-between my-2">
        <div className="flex items-center gap-3">
          {liked ? (
            <FaHeart
              size={"24px"}
              className="cursor-pointer hover:text-red-600 text-red-600 "
              onClick={() => likeOrDislikeHandler()}
            />
          ) : (
            <FaRegHeart
              size={"24px"}
              className="cursor-pointer hover:text-red-600"
              onClick={() => likeOrDislikeHandler()}
            />
          )}

          <MessageCircle
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true);
            }}
            className="cursor-pointer hover:text-gray-600"
          />
          <Send className="cursor-pointer hover:text-gray-600" />
        </div>
        <div>
          <Bookmark
            onClick={bookmarkHandler}
            className="cursor-pointer hover:text-gray-600"
          />
        </div>
      </div>
      <span className="font-medium block mb-2">{postLikeCount} likes</span>
      <p>
        <span className="font-medium mr-2">AayushK</span>
        {post?.caption}
      </p>

      <span
        onClick={() => {
          dispatch(setSelectedPost(post));
          setOpen(true);
        }}
        className="text-gray-500 block cursor-pointer text-sm "
      >
        {post?.comments.length == 0
          ? "No comments"
          : `View all${post?.comments.length} comments`}
      </span>
      <CommentDialog open={open} setOpen={setOpen} />
      <div className="flex items-center justify-between">
        <input
          type="text"
          className="w-full outline-none text-sm"
          placeholder="Add a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {text && (
          <span
            className="text-[#3BADF8] cursor-pointer"
            onClick={commentHandler}
          >
            Post
          </span>
        )}
      </div>
    </div>
  );
};

export default Post;
