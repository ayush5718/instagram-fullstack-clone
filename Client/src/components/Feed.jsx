import React from "react";
import Posts from "./Posts";

const Feed = () => {
  return (
    <div className="flex-1 mx-auto max-w-full md:w-2/3 lg:w-1/2 px-4">
      <Posts />
    </div>
  );
};

export default Feed;
