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
import {
  setAuthUser,
  setSuggestedUsers,
  setUserProfile,
} from "@/redux/authSlice";
import CreatePost from "./CreatePost";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const dispath = useDispatch();
  const { likeNotification } = useSelector((store) => store.notification);
  const { user } = useSelector((store) => store?.auth);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

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
      icon: <Home className="w-6 h-6" />,
      name: "Home",
    },
    {
      icon: <Search className="w-6 h-6" />,
      name: "Search",
    },
    {
      icon: <TrendingUp className="w-6 h-6 md:block hidden" />,
      name: "Explore",
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      name: "Message",
    },
    {
      icon: <Heart className="w-6 h-6 md:block hidden" />,
      name: "Notifications",
    },
    {
      icon: <PlusSquare className="w-6 h-6" />,
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
      icon: <LogOut className="w-6 h-6" />,
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
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    if (item.name === "Home") {
      navigate("/");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    if (item.name === "Message") {
      navigate("/chat");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div
      className="fixed z-10 border-r border-gray-300 
                    md:w-[16%] md:h-screen md:top-0 md:left-0 md:px-4
                    w-full h-16 bottom-0 left-0 px-2 bg-white
                    flex md:block"
    >
      <div className="flex flex-col w-full">
        {/* Logo - Hidden on mobile */}
        <h1 className="hidden md:block">LOGO</h1>

        {/* Navigation Items */}
        <div className="flex md:flex-col justify-around md:justify-start w-full">
          {sidebarItems?.map((item, index) => (
            <div
              key={index}
              onClick={() => handleSidebarItemClick(item)}
              className="flex items-center gap-3 hover:bg-gray-100 
                         md:p-3 md:my-3 rounded-lg cursor-pointer relative
                         p-2 my-0"
            >
              {/* Icon */}
              <div className="relative">
                {item.icon}
                {/* Notification Badge */}
                {item.name === "Notifications" &&
                  likeNotification.length > 0 && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          size="icon"
                          className="rounded-full h-5 w-5 bg-red-600 hover:bg-red-600 
                                 absolute -top-2 -right-2 md:bottom-6 md:left-6"
                        >
                          {likeNotification.length}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <div>
                          {likeNotification.length === 0 ? (
                            <p>No new notification</p>
                          ) : (
                            likeNotification.map((notification) => (
                              <div
                                key={notification.userId}
                                className="flex items-center gap-2 my-2"
                              >
                                <Avatar>
                                  <AvatarImage
                                    src={
                                      notification.userDetails?.profilePicture
                                    }
                                  />
                                  <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <p className="text-sm">
                                  <span className="font-bold">
                                    {notification.userDetails?.username}
                                  </span>{" "}
                                  liked your post
                                </p>
                              </div>
                            ))
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
              </div>
              {/* Text - Hidden on mobile */}
              <p className="hidden md:block cursor-pointer">{item.name}</p>
            </div>
          ))}
        </div>
      </div>

      <CreatePost open={openCreateDialog} setOpen={setOpenCreateDialog} />
    </div>
  );
};

export default LeftSidebar;
