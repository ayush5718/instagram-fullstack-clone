import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link, useParams } from "react-router-dom";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AtSign, Heart, MessageCircle } from "lucide-react";
import axios from "@/api/axios";
import { toast } from "sonner";

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  const [activeTab, setActiveTab] = useState("posts");
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useGetUserProfile(userId);
  const { userProfile, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user && userProfile) {
      setIsFollowing(userProfile.followers.includes(user._id));
    }
  }, [user, userProfile]);

  const isLoggedInUserProfile = user?._id === userProfile?._id;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleFollowToggle = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `/user/followOrUnfollow/${userId}`,
        {},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setIsFollowing(!isFollowing);
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const FollowButton = () => {
    if (isLoggedInUserProfile) {
      return (
        <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
          <Link to="/account/edit">
            <Button
              variant="secondary"
              className="hover:bg-gray-200 h-8 text-sm"
            >
              Edit profile
            </Button>
          </Link>
          <Button variant="secondary" className="hover:bg-gray-200 h-8 text-sm">
            View archive
          </Button>
          <Button variant="secondary" className="hover:bg-gray-200 h-8 text-sm">
            Ad tools
          </Button>
        </div>
      );
    } else {
      return (
        <div className="flex gap-2 mt-2 md:mt-0">
          <Button
            onClick={handleFollowToggle}
            disabled={isLoading}
            variant={isFollowing ? "secondary" : "default"}
            className={`h-8 text-sm ${
              isFollowing ? "" : "bg-[#0095F6] hover:bg-[#3192d2]"
            }`}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </Button>
          {isFollowing && (
            <Button variant="secondary" className="h-8 text-sm">
              <Link to={"/chat"}>Message</Link>
            </Button>
          )}
        </div>
      );
    }
  };

  const displayedPost =
    activeTab === "posts" ? userProfile?.posts : userProfile?.bookmarks;

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 mt-6 md:mt-10">
      <div className="flex flex-col gap-8 md:gap-20">
        {/* Profile Header Section */}
        <div className="flex flex-col md:grid md:grid-cols-2 gap-6 md:gap-8">
          {/* Avatar Section */}
          <section className="flex items-center justify-center md:justify-center">
            <Avatar className="h-20 w-20 md:h-32 md:w-32">
              <AvatarImage
                src={userProfile?.profilePicture}
                alt="profilephoto"
                className="object-cover"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>

          {/* Profile Info Section */}
          <section className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <span className="text-xl font-medium">
                  {userProfile?.username}
                </span>
                <FollowButton />
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm md:text-base">
                <p>
                  <span className="font-semibold">
                    {userProfile?.posts.length}{" "}
                  </span>
                  posts
                </p>
                <p>
                  <span className="font-semibold">
                    {userProfile?.followers.length}{" "}
                  </span>
                  followers
                </p>
                <p>
                  <span className="font-semibold">
                    {userProfile?.following.length}{" "}
                  </span>
                  following
                </p>
              </div>
            </div>

            {/* Bio Section */}
            <div className="flex flex-col gap-1 text-sm md:text-base">
              <span className="font-semibold">
                {userProfile?.bio || "bio here..."}
              </span>
              <Badge className="w-fit" variant="secondary">
                <AtSign />
                <span className="pl-1">{userProfile?.username}</span>
              </Badge>
              <span>💻Turning idea's into 0's and 1's</span>
              <span>🤯Turing code into fun</span>
              <span>🤯DM for collaboration</span>
            </div>
          </section>
        </div>

        {/* Tabs and Posts Section */}
        <div className="border-t border-t-gray-200">
          {/* Tabs */}
          <div className="flex items-center justify-around md:justify-center md:gap-10 text-xs md:text-sm">
            {["posts", "saved", "reels", "tags"].map((tab) => (
              <span
                key={tab}
                className={`py-3 cursor-pointer uppercase ${
                  activeTab === tab ? "font-bold" : ""
                }`}
                onClick={() => handleTabChange(tab)}
              >
                {tab}
              </span>
            ))}
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-2 mt-4">
            {displayedPost?.map((post) => (
              <div key={post._id} className="relative group cursor-pointer">
                <img
                  src={post?.image}
                  alt="post_image"
                  className="rounded-sm w-full aspect-square object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center text-white space-x-4">
                    <button className="flex items-center gap-1 md:gap-2 hover:text-gray-300">
                      <Heart className="w-4 h-4 md:w-5 md:h-5" />
                      <span className="text-sm">{post?.likes.length}</span>
                    </button>
                    <button className="flex items-center gap-1 md:gap-2 hover:text-gray-300">
                      <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
                      <span className="text-sm">{post?.comments.length}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
