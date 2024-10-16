import React from "react";
import Post from "./Post";
import { useSelector } from "react-redux";
import store from "@/redux/store";

const Posts = () => {
  const { posts } = useSelector((store) => store.post);
  console.log(posts);

  return (
    <div className=" mx-auto w-1/2 ml-24">
      {posts && posts?.map((item, index) => <Post key={index} post={item} />)}
    </div>
  );
};

export default Posts;
