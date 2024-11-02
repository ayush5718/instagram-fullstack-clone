import React, { useEffect } from "react";
import Signup from "./components/signup";
import Login from "./components/login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./components/MainLayout";

import Profile from "./components/Profile";
import Home from "./components/Home";
import EditProfile from "./components/EditProfile";
import Chatpage from "./components/Chatpage";
import { io, Socket } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { setSocket } from "./redux/socketSlice";
import { setOnlineUsers } from "./redux/chatSlice";
import { setLikeNotification } from "./redux/notificationSlice";
const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/profile/:id",
        element: <Profile />,
      },
      {
        path: "/account/edit",
        element: <EditProfile />,
      },
      {
        path: "/chat",
        element: <Chatpage />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
]);
const App = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const { socket } = useSelector((store) => store.socketio);
  useEffect(() => {
    if (user) {
      const socketio = io(
        "https://instagram-fullstack-clone-backend.vercel.app",
        {
          query: {
            userId: user._id,
          },
          transports: ["websocket"],
        }
      );
      dispatch(setSocket(socketio));

      // listening all the socket events
      socketio.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      socketio.on("notification", (notification) => {
        dispatch(setLikeNotification(notification));
      });

      return () => {
        socketio.close();
        dispatch(setSocket(null));
      };
    } else if (socket) {
      socket.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);
  return (
    <div>
      {/* <Signup /> */}
      <RouterProvider router={browserRouter} />
    </div>
  );
};

export default App;
