import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import axios from "@/api/axios";
import { useDispatch, useSelector } from "react-redux";
import store from "@/redux/store";
import Comment from "./Comment";
import { toast } from "sonner";
import { setPosts } from "@/redux/postSlice";

const CommentDialog = ({ open, setOpen }) => {
  const dispatch = useDispatch();
  const { selectedPost, posts } = useSelector((store) => store.post);
  const [text, setText] = useState("");
  const [comment, setComment] = useState([]);

  const changeEventHandler = (event) => {
    const inputText = event.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const sendCommentHandler = async () => {
    try {
      const res = await axios.post(
        `/post/${selectedPost._id}/comment`,
        { text },
        { withCredentials: true }
      );
      if (res?.data?.success) {
        const updatedCommentData = [...comment, res?.data?.comment];
        setComment(updatedCommentData);
        const updatedPostData = posts.map((p) =>
          p._id === selectedPost._id
            ? { ...p, comments: updatedCommentData }
            : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res?.data?.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };
  useEffect(() => {
    if (selectedPost) {
      setComment(selectedPost?.comments);
    }
  }, [selectedPost]);

  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="max-w-5xl p-0"
      >
        <div className="flex md:flex-row flex-col">
          <div className="md:w-1/2 w-full">
            <img
              src={selectedPost?.image}
              alt="comment_image"
              className="w-full h-full object-cover rounded-l-lg"
            />
          </div>
          <div className="md:w-1/2 w-full flex flex-col justify-between">
            <div className="flex items-center justify-between  p-4">
              <div className="flex items-center gap-3">
                <Link>
                  <Avatar>
                    <AvatarImage
                      className="object-cover"
                      src={selectedPost?.author?.profilePicture}
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className="font-semibold text-xs">
                    {selectedPost?.author?.username}
                  </Link>
                  <span className="text-gray-600">
                    {/* {selectedPost?.author?.bio} */}
                  </span>
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className="cursor-pointer" />
                </DialogTrigger>
                <DialogContent className=" flex flex-col items-center justify-center text-center text-sm">
                  <div className="cursor-pointer w-full text-[#ED4956] font-bold ">
                    unfollow
                  </div>
                  <div className="cursor-pointer w-full ">
                    Add to Favourites
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <hr />
            <div className="flex-1 max-h-96 overflow-y-auto h-full p-4 border over">
              {comment?.map((comment) => (
                <Comment key={comment._id} comment={comment} />
              ))}
            </div>
            <div className="  p-4 "></div>
            <div className="p-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  onChange={changeEventHandler}
                  value={text}
                  className="w-full outline-none border border-gray-300 p-2 rounded"
                />
                <Button
                  disabled={!text.trim()}
                  onClick={sendCommentHandler}
                  variant="outline"
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
