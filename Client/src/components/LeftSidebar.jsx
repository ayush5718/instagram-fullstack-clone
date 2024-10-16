import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";
import axios from "@/api/axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import store from "@/redux/store";
import { setAuthUser } from "@/redux/authSlice";
import CreatePost from "./CreatePost";
import { setPosts, setSelectedPost } from "@/redux/postSlice";

const LeftSidebar = () => {
  // all the function hooks
  const navigate = useNavigate();
  const dispath = useDispatch();
  const { user } = useSelector((store) => store?.auth);

  // all the state
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  console.log(user);
  const logoutHandler = async () => {
    try {
      const response = await axios.get("/user/logout");

      if (response?.data?.success) {
        dispath(setAuthUser(null));
        dispath(setPosts(null));
        dispath(setSelectedPost([]));
        navigate("/login");
        toast.success(response?.data?.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const sidebarItems = [
    {
      icon: <Home />,
      name: "Home",
    },
    {
      icon: <Search />,
      name: "Search",
    },
    {
      icon: <TrendingUp />,
      name: "Explore",
    },
    {
      icon: <MessageCircle />,
      name: "Message",
    },
    {
      icon: <Heart />,
      name: "Notifications",
    },
    {
      icon: <PlusSquare />,
      name: "Create",
    },
    {
      icon: (
        <Avatar className="w-8 h-8">
          <AvatarImage
            className="rounded-full object-cover w-full h-full bg-gray-100 dark:bg-gray-800"
            src={`${
              user
                ? user?.profilePicture
                : `${"https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"}`
            }`}
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      name: "Profile",
    },
    {
      icon: <LogOut />,
      name: "Logout",
    },
  ];

  const handleSidebarItemClick = (item) => {
    if (item.name === "Logout") {
      logoutHandler();
    }
    if (item.name === "Create") {
      setOpenCreateDialog(true);
    }
    if (item.name === "Profile") {
      navigate(`/profile/${user?._id}`);
    }
    if (item.name === "Home") {
      navigate("/");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  return (
    <div className="px-4 fixed top-0 left-0 border-r border-gray-300 w-[16%] h-screen z-10 border">
      <div className="flex flex-col">
        <h1>LOGO</h1>
        <div>
          {sidebarItems?.map((item, index) => (
            <div
              key={index}
              onClick={() => handleSidebarItemClick(item)}
              className="flex items-center gap-3 hover:bg-gray-100 p-3 my-3 rounded-lg cursor-pointer relative"
            >
              {item.icon}
              <p className=" cursor-pointer">{item.name}</p>
            </div>
          ))}
        </div>
      </div>

      <CreatePost open={openCreateDialog} setOpen={setOpenCreateDialog} />
    </div>
  );
};

export default LeftSidebar;
