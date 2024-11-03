import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { setMessages, setSelectedUser } from "@/redux/chatSlice";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ArrowLeft, MessageCircleCode, Send } from "lucide-react";
import Messages from "./Messages";
import axios from "@/api/axios";

const Chatpage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const { SuggestedUsers } = useSelector((store) => store.auth);
  const { selectedUser, onlineUsers, messages } = useSelector(
    (store) => store.chat
  );

  const [message, setMessage] = useState("");
  const [showUserList, setShowUserList] = useState(true);

  useEffect(() => {
    if (selectedUser && window.innerWidth < 768) {
      setShowUserList(false);
    }
  }, [selectedUser]);

  const sendMessageHandler = async (receiverId) => {
    try {
      const res = await axios.post(
        `/message/send/${receiverId}`,
        { message },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setMessages([...messages, res?.data?.newMessage]));
        setMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleBackToList = () => {
    setShowUserList(true);
    dispatch(setSelectedUser(null));
  };

  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-screen md:ml-[16%]">
      {/* Users List Section */}
      <section
        className={`${
          !showUserList ? "hidden" : "block"
        } md:block w-full md:w-1/4 border-r border-gray-300`}
      >
        <div className="p-4 border-b border-gray-300">
          <h1 className="font-bold text-xl">{user?.username}</h1>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-60px)]">
          {SuggestedUsers?.map((suggestedUser) => {
            const isOnline = onlineUsers?.includes(suggestedUser._id);
            return (
              <div
                onClick={() => {
                  dispatch(setSelectedUser(suggestedUser));
                  setShowUserList(false);
                }}
                key={suggestedUser._id}
                className="flex gap-3 items-center p-4 hover:bg-gray-50 cursor-pointer"
              >
                <Avatar className="w-12 h-12">
                  <AvatarImage
                    src={suggestedUser?.profilePicture}
                    alt="profilePicture"
                    className="object-cover rounded-full"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">{suggestedUser?.username}</span>
                  <span
                    className={`text-xs font-bold ${
                      isOnline ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isOnline ? "Online" : "Offline"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Chat Section */}
      <section
        className={`${
          showUserList ? "hidden" : "block"
        } md:block flex-1 h-full flex flex-col`}
      >
        {selectedUser ? (
          <>
            <div className="flex gap-3 items-center px-4 py-3 border-b border-gray-300 bg-white">
              <button onClick={handleBackToList} className="md:hidden">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <Avatar className="w-10 h-10">
                <AvatarImage src={selectedUser?.profilePicture} alt="Profile" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <span className="font-medium">{selectedUser?.username}</span>
            </div>

            <Messages selectedUser={selectedUser} />

            <div className="flex items-center p-4 border-t border-gray-300 bg-white md:mb-0 mb-20">
              <Input
                type="text"
                className="flex-1 mr-2 focus-visible:ring-transparent"
                placeholder="Type message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && message.trim()) {
                    sendMessageHandler(selectedUser?._id);
                  }
                }}
              />
              <Button
                onClick={() =>
                  message.trim() && sendMessageHandler(selectedUser?._id)
                }
                size="icon"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <MessageCircleCode className="w-24 h-24 md:w-32 md:h-32 my-4 text-gray-400" />
            <h1 className="font-medium text-xl mb-2">Your messages</h1>
            <span className="text-gray-500">
              Send a message to start a chat
            </span>
          </div>
        )}
      </section>
    </div>
  );
};

export default Chatpage;
