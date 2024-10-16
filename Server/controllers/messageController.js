// for chatting or messaging controller
import { Conversation } from "../models/conversion.model.js";
import { Message } from "../models/message.model.js";
export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;

    const { message } = req.body;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    // establish the conversation if not started it
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    await Promise.all([conversation.save(), newMessage.save()]);

    // implement socket io for real time data transfer

    return res.status(201).json({
      success: true,
      newMessage,
    });
  } catch (error) {
    console.log(error);
  }
};

// get message
export const getMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;

    const conversation = await Conversation.find({
      participants: { $all: [senderId, receiverId] },
    });
    if (!conversation) {
      return res.status(200).json({
        messages: [],
        success: true,
      });
    }

    return res.status(200).json({
      success: true,
      messages: conversation?.messages,
    });
  } catch (error) {
    console.log(error);
  }
};

// delete all messages by the user
export const deleteMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const messageId = req.params.messageId;

    const conversation = await Conversation.find({
      participants: { $all: [senderId, receiverId] },
    });
    if (!conversation) {
      return res.status(200).json({
        messages: [],
        success: true,
      });
    }

    await Message.findByIdAndDelete(messageId);

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// delete single message by user
export const deleteSingleMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const messageId = req.params.messageId;

    const conversation = await Conversation.find({
      participants: { $all: [senderId, receiverId] },
    });
    if (!conversation) {
      return res.status(200).json({
        messages: [],
        success: true,
      });
    }

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(200).json({
        messages: [],
        success: true,
      });
    }

    if (message.senderId.toString() !== senderId.toString()) {
      return res.status(200).json({
        messages: [],
        success: true,
      });
    }

    await Message.findByIdAndDelete(messageId);

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
