import express from "express";
import isAuthenticated from "../middlewares/auth.middleware.js";
import { getMessage, sendMessage } from "../controllers/messageController.js";

const router = express.Router();

router.route("/send/:id").post(isAuthenticated, sendMessage);
router.route("/allmessage/:id").get(isAuthenticated, getMessage);

export default router;
