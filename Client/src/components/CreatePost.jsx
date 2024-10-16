import React, { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import axios from "@/api/axios";
import { useDispatch, useSelector } from "react-redux";
import store from "@/redux/store";
import { setPosts } from "@/redux/postSlice";

const CreatePost = ({ open, setOpen }) => {
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const imageRef = useRef();

  const createPostHandler = async (event) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("caption", content);
    if (preview) {
      formData.append("image", image);
    }
    if (!content) {
      toast.error("Please provide a caption");
      return;
    }
    try {
      const response = await axios.post("/post/addpost", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (response?.data?.success) {
        toast.success(response?.data?.message);
        dispatch(setPosts([response?.data?.post, ...posts]));
        setOpen(false);
        setContent("");
        setPreview("");
        setImage("");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (event) => {
    const selectedImage = event?.target?.files[0];
    setImage(selectedImage);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };

    reader.readAsDataURL(selectedImage);
  };
  const handleRemoveImage = () => {
    setImage("");
    setPreview("");
  };

  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="w-full border-none shadow-lg outline-none overflow-y-auto"
      >
        <DialogHeader className="text-center font-bold">
          Create New Post
        </DialogHeader>
        <div className="flex gap-3 items-center">
          <Avatar>
            <AvatarImage src={user?.profilePicture} className="object-cover" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-xs">{user?.username}</h1>
            <span className="text-xs text-gray-500">{user?.bio}...</span>
          </div>
        </div>
        <Textarea
          className="focus-visible:ring-transparent border-none"
          placeholder="Write a caption"
          required
          value={content}
          onChange={(event) => setContent(event.target.value)}
        />

        <div className="flex justify-center relative">
          {preview && (
            <>
              <img
                src={preview}
                alt="preview"
                className="w-[50%] object-cover h-full rounded-md"
              />
              <Button
                onClick={handleRemoveImage}
                className="absolute top-0 right-12 w-8 h-8 p-1 bg-red-500 rounded-full"
              >
                <X className="" />
              </Button>
            </>
          )}
        </div>
        <Input
          ref={imageRef}
          type="file"
          placeholder="Upload image"
          className="hidden"
          id="image"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
        />

        <Button
          onClick={() => imageRef.current.click()}
          className="w-fit mx-auto bg-[#0095F6] hover:bg-[#057dce]"
        >
          Select from local device
        </Button>

        {preview &&
          (loading ? (
            <Button className="" disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Posting..
            </Button>
          ) : (
            <Button type="submit" onClick={createPostHandler} className="">
              Post
            </Button>
          ))}
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
