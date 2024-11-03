import React from "react";
import Feed from "./Feed";
import { Outlet } from "react-router-dom";
import RightSidebar from "./RightSidebar";
import useGetAllPost from "@/hooks/useGetAllPost";
import useGetSuggestedUsers from "@/hooks/useGetSuggestedUsers";

const Home = () => {
  useGetAllPost();
  useGetSuggestedUsers();

  return (
    <div className="container mx-auto flex flex-col md:flex-row px-4">
      <Feed />
      <Outlet />
      <div className="hidden md:block">
        <RightSidebar />
      </div>
    </div>
  );
};

export default Home;
