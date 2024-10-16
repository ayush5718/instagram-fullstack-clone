import React from "react";
import { Outlet } from "react-router-dom";
import LeftSidebar from "./LeftSidebar";

const MainLayout = () => {
  return (
    <div className=" ">
      <LeftSidebar />
      <Outlet />
    </div>
  );
};

export default MainLayout;