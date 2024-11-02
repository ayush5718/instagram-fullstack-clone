import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import useGetAllMessage from "@/hooks/useGetAllMessage";
import store from "@/redux/store";
import useGetRtm from "@/hooks/useGetRtm";

const Messages = ({ selectedUser }) => {
  useGetAllMessage();
  useGetRtm();

  const { messages } = useSelector((store) => store.chat);
  const { user } = useSelector((store) => store.auth);

  return (
    <div className="overflow-y-auto flex-1 p-4">
      <div className="flex justify-center">
        <div className="flex flex-col items-center justify-center">
          <Avatar className="h-20 w-20">
            <AvatarImage
              className="object-cover w-96"
              src={selectedUser?.profilePicture}
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span>{selectedUser?.username}</span>
          <Link to={`/profile/${selectedUser?._id}`}>
            <Button className="h-8 my-2" variant="secondary">
              View Profile
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {messages &&
          messages?.map((msg) => {
            return (
              <div
                key={msg._id}
                className={`flex items-start gap-2 ${
                  msg.senderId === user._id ? "justify-end" : "justify-start"
                }`}
              >
                {msg.senderId !== user._id && (
                  <Avatar className="h-8 w-8">
                    <Link to={`/profile/${selectedUser?._id}`}>
                      <AvatarImage
                        className="object-cover"
                        src={selectedUser?.profilePicture}
                      />
                    </Link>
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`p-2 rounded-xl max-w-xs break-words ${
                    msg.senderId === user._id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {msg?.message}
                </div>
                {msg.senderId === user._id && (
                  <Avatar className="h-8 w-8">
                    <Link to={`/profile/${user?._id}`}>
                      <AvatarImage
                        className="object-cover"
                        src={user?.profilePicture}
                      />
                    </Link>
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Messages;
