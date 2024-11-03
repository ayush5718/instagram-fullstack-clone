import React, { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import useGetAllMessage from "@/hooks/useGetAllMessage";
import useGetRtm from "@/hooks/useGetRtm";

const Messages = ({ selectedUser }) => {
  useGetAllMessage();
  useGetRtm();

  const { messages } = useSelector((store) => store.chat);
  const { user } = useSelector((store) => store.auth);

  const messagesEndRef = React.useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
      <div className="flex justify-center p-4 border-b border-gray-200">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-16 w-16 md:h-20 md:w-20 mb-2">
            <AvatarImage
              className="object-cover"
              src={selectedUser?.profilePicture}
              alt="profilePicture"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span className="font-medium">{selectedUser?.username}</span>
          <Link to={`/profile/${selectedUser?._id}`}>
            <Button className="mt-2 text-sm" variant="secondary">
              View Profile
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages?.map((msg) => (
          <div
            key={msg._id}
            className={`flex items-start gap-2 ${
              msg.senderId === user._id ? "justify-end" : "justify-start"
            }`}
          >
            {msg.senderId !== user._id && (
              <Avatar className="w-8 h-8 hidden md:block">
                <Link to={`/profile/${selectedUser?._id}`}>
                  <AvatarImage
                    src={selectedUser?.profilePicture}
                    alt="senderProfile"
                  />
                </Link>
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            )}

            <div
              className={`p-2 rounded-lg max-w-[75%] md:max-w-xs break-words ${
                msg.senderId === user._id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {msg.message}
            </div>

            {msg.senderId === user._id && (
              <Avatar className="w-8 h-8 hidden md:block">
                <Link to={`/profile/${user?._id}`}>
                  <AvatarImage src={user?.profilePicture} alt="userProfile" />
                </Link>
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default Messages;
