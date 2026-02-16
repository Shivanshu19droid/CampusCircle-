import MessageRequest from "../../models/Chat-Module/messageRequest.model.js";
import User from "../../models/user.model.js";
import mongoose from "mongoose";
import Message from "../../models/Chat-Module/message.model.js";
import Chat from "../../models/Chat-Module/chat.model.js";
import cloudinary from "cloudinary";
import AppError from "../../utils/error.util.js";
import fs from "fs";
import { io } from "../../server.js";

const sendMessage = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { chatId } = req.params;
    const { content } = req.body;

    //basic validation
    if (!chatId || !mongoose.Types.ObjectId.isValid(chatId)) {
      return next(new AppError("Invalid chat Id", 400));
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const chatObjectId = new mongoose.Types.ObjectId(chatId);

    if (!content && !req.file) {
      return next(new AppError("Empty message cannot be sent", 400));
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return next(new AppError("Chat not found", 404));
    }

    const receiverId = chat.participants.find((id) => id.toString() !== userId);

    if (!receiverId) {
      return next(new AppError("Chat not found", 404));
    }

    const receiverObjectId = new mongoose.Types.ObjectId(receiverId);

    const newMessage = await Message.create({
      sender: userObjectId,
      receiver: receiverObjectId,
      content: content?.trim() || "",
      chat: chatObjectId,
    });

    if (req.file) {
      const attachment = await cloudinary.v2.uploader.upload(req.file.path);

      newMessage.attachments = {
        url: attachment.secure_url,
        localpath: req.file.path,
      };

      await newMessage.save();

      fs.unlinkSync(req.file.path);
    }

    //now we need to increment the unreadcount for the receiver in the chat
    const initialCnt = chat.unreadCount?.get(receiverId) || 0;
    chat.unreadCount.set(receiverId, initialCnt + 1);
    chat.updatedAt = Date.now();
    chat.lastMessage = newMessage._id;
    chat.deletedFor.set(receiverId, false);
    chat.deletedFor.set(userId, false);


    await chat.save();

    // 🔥 SOCKET EMIT HERE
    const io = req.app.get("io");

    io.to(chatId).emit("NEW_MESSAGE", {
      chatId,
      message: newMessage,
    });

    return res.status(200).json({
      success: true,
      newMessage,
      chatId,
    });
  } catch (error) {
    return next(new AppError(error.message || "Something went wrong", 500));
  }
};

const getAllMessagesFromChat = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;

    const limitNum = Math.min(parseInt(limit, 10) || 20, 50);
    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const skip = (pageNum - 1) * limitNum;

    // ✅ Basic validation
    if (!chatId || !mongoose.Types.ObjectId.isValid(chatId)) {
      return next(new AppError("Invalid chat Id", 400));
    }

    const chatObjectId = new mongoose.Types.ObjectId(chatId);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // ✅ Fetch chat & validate participant
    const chat = await Chat.findOne({
      _id: chatObjectId,
      participants: userObjectId,
    }).select("participants");

    if (!chat) {
      return next(new AppError("You are not authorized to access this chat", 403));
    }

    // ✅ Extract receiverId (other participant)
    const receiverId = chat.participants.find(
      (participant) => participant.toString() !== userId
    );

    const receiverObjectId = new mongoose.Types.ObjectId(receiverId);

    // ✅ Aggregation
    const result = await Message.aggregate([
      {
        $match: {
          chat: chatObjectId,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $facet: {
          messages: [
            { $skip: skip },
            { $limit: limitNum },
            {
              $addFields: {
                direction: {
                  $cond: [
                    { $eq: ["$sender", userObjectId] },
                    "sent",
                    "received",
                  ],
                },
              },
            },
            {
              $project: {
                sender: 1,
                receiver: 1,
                content: 1,
                attachments: 1,
                createdAt: 1,
                direction: 1,
              },
            },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);

    const messages = result[0]?.messages || [];
    const totalMessages = result[0]?.totalCount[0]?.count || 0;

    res.status(200).json({
      status: "success",
      currentPage: pageNum,
      totalPages: Math.ceil(totalMessages / limitNum),
      totalMessages,
      results: messages.length,
      data: messages,
    });

  } catch (error) {
    return next(new AppError(error.message || "Something went wrong", 500));
  }
};



export {
  sendMessage,
  getAllMessagesFromChat,
};
