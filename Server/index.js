import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
// for dotenv config (means we can use .env file)

// importing routes
import authRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js";
import messageRouter from "./routes/message.routes.js";
import { app, server } from "./socket/socket.js";
dotenv.config();

const PORT = process.env.PORT || 5000;

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
const corsOptions = {
  origin: ["https://instagram-fullstack-clone-alpha.vercel.app"],
  credentials: true,
  methods: ["GET", "POST", "DELETE", "PUT"],
};
app.use(cors(corsOptions));
app.get("/", (req, res) => {
  res.json("Server is up and running");
});
// routes
app.use("/api/v1/user", authRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/message", messageRouter);

server.listen(PORT, () => {
  connectDB();
  console.log(`server is running on port ${PORT}`);
});
