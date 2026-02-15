import Chat from "../../models/Chat-Module/chat.model.js";
import User from "../../models/user.model.js";
import mongoose from "mongoose";
import MessageRequest from "../../models/Chat-Module/messageRequest.model.js";
import AppError from "../../utils/error.util.js";
import fs from "fs";
import Message from "../../models/Chat-Module/message.model.js";
import cloudinary from "cloudinary";

// to search the users to start a new chat
const searchQueriedUsers = async (req, res, next) => {
  try {
    const { query, page = 1, limit = 10 } = req.query;
    const userId = req.user.id;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return next(new AppError("Invalid user Id"), 400);
    }

    if (!query || !query.trim()) {
      return res.status(200).json({
        success: true,
        message: "searcehd users fetched",
        users: [],
        page,
        hasMore: false,
      });
    }
    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(parseInt(limit, 10) || 10, 10);
    const skip = (pageNum - 1) * limitNum;

    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: new mongoose.Types.ObjectId(userId) },
          fullName: { $regex: query, $options: "i" },
        },
      },
      {
        $project: {
          fullName: 1,
          avatar: 1,
          currentProfession: 1,
          currentCompany: 1,
          role: 1,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limitNum,
      },
    ]);

    const hasMore = users.length === limit;

    return res.status(200).json({
      success: true,
      message: "searched users fetched",
      users,
      page,
      limit,
      hasMore: hasMore,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

//to get all chats
const getAllChats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return next(new AppError("Invalid user Id"), 400);
    }

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(parseInt(limit, 10) || 10, 10);
    const skip = (pageNum - 1) * limitNum;

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const chats = await Chat.aggregate([
      {
        $match: {
          participants: userObjectId,
          $or: [
            { [`deletedFor.${userId}`]: { $exists: false } },
            { [`deletedFor.${userId}`]: false },
          ],
        },
      },
      {
        $addFields: {
          otherParticipant: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$participants",
                  as: "participant",
                  cond: { $ne: ["$$participant", userObjectId] },
                },
              },
              0,
            ],
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "otherParticipant",
          foreignField: "_id",
          as: "otherParticipant",
        },
      },
      { $unwind: "$otherParticipant" },
      {
        $lookup: {
          from: "messages",
          localField: "lastMessage",
          foreignField: "_id",
          as: "lastMessage",
        },
      },
      {
        $unwind: {
          path: "$lastMessage",
          preserveNullAndEmptyArrays: true,
        },
      },
      //finally shaping the final structure of chats
      {
        $project: {
          _id: 1,
          createdAt: 1,
          updatedAt: 1,
          "otherParticipant._id": 1,
          "otherParticipant.fullName": 1,
          "otherParticipant.avatar": 1,
          lastMessage: {
            _id: "$lastMessage._id",
            sender: "$lastMessage.sender",
            content: "$lastMessage.content",
            createdAt: "$lastMessage.createdAt",
            hasAttachments: {
              $cond: {
                if: {
                  $gt: [
                    { $size: { $ifNull: ["$lastMessage.attachments", []] } },
                    0,
                  ],
                },
                then: true,
                else: false,
              },
            },
          },
          unreadCount: 1,
        },
      },
      {
        $sort: { updatedAt: -1 },
      },
      { $skip: skip },
      { $limit: limitNum },
    ]);

    if (!chats) {
      return next(new AppError("No Chats Found"));
    }

    const hasMore = chats.length === limit;

    return res.status(200).json({
      success: true,
      message: "chats fetched successfully",
      chats,
      page,
      limit,
      hasMore,
    });
  } catch (error) {
    return next(new AppError(error.message), 500);
  }
};

// resolve conversation state -- returns boolean values based on if the chat exists or message request exists
const resolveConversationState = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { clickedUserId } = req.params;

    //basic validation

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return next(new AppError("Invalid user Id"), 400);
    }

    if (!clickedUserId || !mongoose.Types.ObjectId.isValid(clickedUserId)) {
      return next(new AppError("Invalid user Id"), 400);
    }

    //cannot start a conversation with yourself
    if (clickedUserId.toString() === userId) {
      return next(new AppError("Cannot start a conversation with yourself"));
    }

    const existingChat = await Chat.findOne({
      participants: {
        $all: [userId, clickedUserId],
      },
    }).select("_id");

    if (existingChat) {
      return res.status(200).json({
        success: true,
        state: "CHAT_EXISTS",
        chatId: existingChat._id,
        canSendMessage: true,
        canSendRequest: false,
      });
    }

    const user = await User.findById(userId);

    const doesFollow = user.following.some(
      (id) => id.toString() === clickedUserId,
    );
    const followBack = user.followers.some(
      (id) => id.toString() === clickedUserId,
    );

    if (doesFollow && followBack) {
      return res.status(200).json({
        success: true,
        state: "NONE",
        canSendMessage: true,
        canSendRequest: false,
      });
    }

    const existingRequest = await MessageRequest.findOne({
      status: "pending",
      $or: [
        { sender: userId, receiver: clickedUserId },
        { sender: clickedUserId, receiver: userId },
      ],
    }).select("_id sender receiver status");

    if (existingRequest) {
      const direction =
        existingRequest.sender?.toString() === userId ? "sent" : "received";

      return res.status(200).json({
        success: true,
        state: "REQUEST_EXISTS",
        requestId: existingRequest._id,
        requestDirection: direction,
        canSendMessage: false,
        canSendRequest: false,
      });
    }

    //last case is no chat, no request, no mutual follow
    return res.status(200).json({
      success: true,
      state: "NONE",
      canSendMessage: false,
      canSendRequest: true,
    });
  } catch (error) {
    return next(new AppError(error.message), 500);
  }
};

//creating a new chat if there is mutual follow and the chat does not exist
const createNewChat = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { clickedUserId } = req.params;
    const { content } = req.body;

    //basic validation
    if (!clickedUserId || !mongoose.Types.ObjectId.isValid(clickedUserId)) {
      return next(new AppError("Invalid user Id", 400));
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const clickedUserObjectId = new mongoose.Types.ObjectId(clickedUserId);

    if (!content || !content.trim() || !req.file) {
      return next(new AppError("Empty message cannot be sent", 400));
    }

    const existingChat = await Chat.findOne({
      participants: {
        $all: [userObjectId, clickedUserObjectId],
      },
    });

    if (existingChat) {
      return next(new AppError("Chat already exists"));
    }

    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError("User not found", 400));
    }

    const isFollowing = user.following?.some(
      (id) => id.toString() === clickedUserId,
    );
    const isFollowedBack = user.followers?.some(
      (id) => id.toString() === clickedUserId,
    );

    if (!isFollowing || !isFollowedBack) {
      return next(
        new AppError("You must follow each-other to create a new chat", 400),
      );
    }

    // if chat already exists, we will revive chat, otherwise create a new chat
    let chat = await Chat.findOne({
      participants: {
        $all: [userObjectId, clickedUserObjectId],
      },
    });

    if (!chat) {
      chat = await Chat.create({
        participants: [userObjectId, clickedUserObjectId],
      });
    }

    const newMessage = await Message.create({
      sender: userObjectId,
      receiver: clickedUserObjectId,
      content: content?.trim() || "",
      chat: chat._id,
    });

    if (req.file) {
      const attachment = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "CampusCircle/message-attachments",
        width: 250,
        gravity: "faces",
        crop: "fill",
      });

      newMessage.attachments({
        url: attachment.secure_url,
        localpath: req.file.path,
      });

      await newMessage.save();

      fs.unlinkSync(req.file.path);
    }

    chat.lastMessage = newMessage._id;
    chat.unreadCount.set(clickedUserId, 1);
    chat.unreadCount.set(userId, 0);
    chat.deletedFor.set(clickedUserId, false);
    chat.deletedFor.set(userId, false);

    await chat.save();

    return res.status(200).json({
      success: true,
      chat,
      newMessage,
    });
  } catch (error) {
    return next(new AppError(error.message || "Something went wrong", 500));
  }
};

// marking the chat as read
const markChatAsRead = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    //basic validation
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return next(new AppError("Invalid User Id"), 400);
    }

    if (!chatId || !mongoose.Types.ObjectId.isValid(chatId)) {
      return next(new AppError("Invalid Chat Id"), 400);
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return next(new AppError("Chat not found"), 404);
    }

    const isParticipant = chat.participants.some(
      (id) => id.toString() === userId,
    );

    if (!isParticipant) {
      return next(new AppError("You are not a participant of this chat"), 400);
    }

    const isDeletedForUser = chat?.deletedFor?.get(userId) === true;

    if (isDeletedForUser) {
      return next(new AppError("Request failed"));
    }

    let currUnreadCount = chat.unreadCount?.get(userId) || 0;

    if (currUnreadCount > 0) {
      chat.unreadCount.set(userId, 0);
      currUnreadCount = 0;
      await chat.save();

      // 🔥 SOCKET EMIT HERE
      const io = req.app.get("io");

      io.to(chatId).emit("MESSAGES_READ", {
        chatId,
        readBy: userId,
      });
    }

    //socket io response to the other participant with the "CHAT_OPENED" event

    return res.status(200).json({
      success: true,
      chatId,
      unreadCount: chat.unreadCount.get(userId),
    });
  } catch (error) {
    return next(new AppError(error.message), 500);
  }
};

//delete a chat
const deleteChat = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    //basic validation
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return next(new AppError("Invalid user Id"), 400);
    }

    if (!chatId || !mongoose.Types.ObjectId.isValid(chatId)) {
      return next(new AppError("Invalid chat Id"), 400);
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return next(new AppError("Chat not found"), 404);
    }

    const isParticipant = chat?.participants?.some(
      (id) => id.toString() === userId,
    );

    if (!isParticipant) {
      return next(new AppError("You are not a participant of this chat"), 400);
    }

    //soft delete for the current user
    chat.deletedFor.set(userId, true);
    chat.clearedAt.set(userId, new Date());
    chat.unreadCount.set(userId, 0);

    //check if all participants (sender and receiver) have deleted the chat
    const allDeleted = chat?.participants?.every(
      (id) => chat?.deletedFor?.get(id.toString()) === true,
    );

    if (allDeleted) {
      //hard deletion
      await Message.deleteMany({ chat: chatId });
      await chat.deleteOne(chatId);

      return res.status(200).json({
        success: true,
        message: "Chat deleted successully",
        chatId,
      });
    }

    //soft deletion
    await chat.save();

    return res.status(200).json({
      success: true,
      message: "Chat deleted for current user",
      chatId,
    });
  } catch (error) {
    return next(new AppError(error.message), 500);
  }
};

export {
  searchQueriedUsers,
  getAllChats,
  resolveConversationState,
  createNewChat,
  markChatAsRead,
  deleteChat,
};
