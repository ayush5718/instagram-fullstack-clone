import React, { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import axios from "@/api/axios";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { setAuthUser } from "@/redux/authSlice";

const EditProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const imageRef = useRef();
  const { user } = useSelector((store) => store.auth);
  const [input, setInput] = useState({
    profilePicture: user?.profilePicture,
    bio: user?.bio,
    gender: user?.gender,
    username: user?.username,
  });
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    if (selectedImage) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedImage);
    } else {
      setPreview(null);
    }
    setInput((prev) => ({ ...prev, profilePicture: selectedImage }));
  };

  const selectChangeHandler = (value) => {
    setInput({ ...input, gender: value });
  };

  const handleUsernameChange = (event) => {
    setInput({ ...input, username: event.target.value });
  };
  const editProfile = async () => {
    const formData = new FormData();
    if (input.profilePicture) {
      formData.append("profilePicture", input.profilePicture);
    }
    formData.append("bio", input.bio);
    formData.append("gender", input.gender);
    formData.append("username", input?.username);
    console.log(formData);

    try {
      setLoading(true);
      const res = await axios.post("/user/profile/edit", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      if (res?.data?.success) {
        const updatedUserData = {
          ...user,
          bio: res?.data?.user?.bio,
          profilePicture: res?.data?.user?.profilePicture,
          gender: res?.data?.user?.gender,
          username: res?.data?.user?.username,
        };
        dispatch(setAuthUser(updatedUserData));
        toast.success(res?.data?.message);
        navigate(`/profile/${user?._id}`);
      }
      console.log(input);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex max-w-2xl mx-auto pl-10">
      <section className="flex flex-col gap-6 w-full my-8">
        <h1 className="font-bold text-xl">Edit Profile</h1>
        <div className="flex items-center justify-between bg-gray-100 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user?.profilePicture} alt="profile_image" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-bold text-sm">{user?.username}</h1>
              <span className="text-gray-600">
                {user?.bio || "Bio here..."}
              </span>
            </div>
          </div>
          {/* choose the image for updating profile picture  */}
          <input
            ref={imageRef}
            type="file"
            className="hidden"
            onChange={handleImageChange}
          />
          <Button
            onClick={() => imageRef.current.click()}
            className="bg-[#0095F6] h-8 hover:bg-[#0273be] rounded"
          >
            Change Photo
          </Button>
        </div>

        {/*username change section */}
        <div>
          <h1 className="font-bold text-xl mb-2">Username</h1>
          <Input
            name="username"
            placeholder="Username"
            className="focus-visible:ring-transparent"
            value={input?.username}
            onChange={handleUsernameChange}
          />
        </div>
        {/* profile photo preview */}
        <div>
          <h1 className="font-bold text-xl mb-2">Profile Picture</h1>
          <div className="flex items-center justify-center">
            <img
              src={preview || user?.profilePicture}
              alt="profile_image"
              className="w-32 h-32 object-cover rounded-full"
            />
          </div>
        </div>
        <div>
          <h1 className="font-bold text-xl mb-2">Bio</h1>
          <Textarea
            name="bio"
            placeholder="Bio here..."
            className="focus-visible:ring-transparent"
            value={input.bio}
            onChange={(e) => setInput({ ...input, bio: e.target.value })}
          />
        </div>
        <div>
          <h1 className="font-bold text-xl mb-2">Gender</h1>
          <Select
            defaultValue={input.gender}
            onValueChange={selectChangeHandler}
            className="focus:visible:ring-transparent"
          >
            <SelectTrigger className="w-[180px] focus:visible:ring-transparent">
              <SelectValue placeholder="select your gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem
                  value="male"
                  className="focus:visible:ring-transparent"
                >
                  Male
                </SelectItem>
                <SelectItem
                  value="female"
                  className="focus:visible:ring-transparent"
                >
                  Female
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end">
          {loading ? (
            <Button className="w-fit bg-[#0095F6] hover:bg-[#0273be] ">
              <Loader2 className="animate-spin mr-2 h-4 w-4" /> Updating...
            </Button>
          ) : (
            <Button
              onClick={editProfile}
              className="w-fit bg-[#0095F6] hover:bg-[#0273be] rounded"
            >
              Update
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};

export default EditProfile;
