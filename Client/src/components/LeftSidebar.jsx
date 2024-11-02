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
  // all the function hooks
  const navigate = useNavigate();
  const dispath = useDispatch();
  const { likeNotification } = useSelector((store) => store.notification);
  console.log(likeNotification);

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
              {item.name === "Notifications" && likeNotification.length > 0 && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      size="icon"
                      className="rounded-full h-5 w-5 bg-red-600 hover:bg-red-600 absolute bottom-6 left-6"
                    >
                      {likeNotification.length}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div>
                      {likeNotification.length === 0 ? (
                        <p>No new notification</p>
                      ) : (
                        likeNotification.map((notification) => {
                          return (
                            <div
                              key={notification.userId}
                              className="flex items-center gap-2 my-2"
                            >
                              <Avatar>
                                <AvatarImage
                                  src={notification.userDetails?.profilePicture}
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
                          );
                        })
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          ))}
        </div>
      </div>

      <CreatePost open={openCreateDialog} setOpen={setOpenCreateDialog} />
    </div>
  );
};

export default LeftSidebar;
