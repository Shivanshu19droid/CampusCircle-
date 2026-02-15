import MessageRequest from "../../models/Chat-Module/messageRequest.model.js";
import User from "../../models/user.model.js";
import mongoose from "mongoose";
import Message from "../../models/Chat-Module/message.model.js";
import Chat from "../../models/Chat-Module/chat.model.js";
import AppError from "../../utils/error.util.js";

//creating a new messsage request
const createNewMessageRequest = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { clickedUserId } = req.params;
    const { content } = req.body;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return next(new AppError("Invalid User Id", 400));
    }

    if (!clickedUserId || !mongoose.Types.ObjectId.isValid(clickedUserId)) {
      return next(new AppError("Invalid Chat Id", 400));
    }

    if (!content) {
      return next(new AppError("Message cannot be empty", 400));
    }

    const existingChat = await Chat.findOne({
      participants: { $all: [userId, clickedUserId] },
    }).select("_id");

    if (existingChat) {
      return next(
        new AppError("Chat already exists! cannot create a new request"),
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    const followedByUser = user.following?.some(
      (id) => id.toString() === clickedUserId,
    );

    const followsBackUser = user.followers?.some(
      (id) => id.toString() === clickedUserId,
    );

    if (followedByUser && followsBackUser) {
      return next(
        new AppError("You guys follow each other! Start a new chat instead"),
      );
    }

    const existingRequest = await MessageRequest.findOne({
      $or: [
        { sender: userId, receiver: clickedUserId },
        { sender: clickedUserId, receiver: userId },
      ],
    });

    const io = req.app.get("io");
    const onlineUsers = getOnlineUsers();
    const receiverSocketId = onlineUsers.get(clickedUserId);

    // 🔥 CASE 1: Re-sending rejected request
    if (existingRequest) {
      if (existingRequest.status === "rejected") {
        existingRequest.status = "pending";
        existingRequest.content = content;
        existingRequest.sender = new mongoose.Types.ObjectId(userId);
        existingRequest.receiver = new mongoose.Types.ObjectId(clickedUserId);

        await existingRequest.save();

        // 🔥 SOCKET EMIT
        if (receiverSocketId) {
          io.to(receiverSocketId).emit(
            "MESSAGE_REQUEST_RECEIVED",
            existingRequest,
          );
        }

        return res.status(200).json({
          success: true,
          message: "Message request sent successfully",
          existingRequest,
        });
      }

      return next(new AppError("Message request already exists", 400));
    }

    // 🔥 CASE 2: New request
    const newMessageRequest = await MessageRequest.create({
      sender: userId,
      receiver: clickedUserId,
      content,
      status: "pending",
    });

    if (receiverSocketId) {
      io.to(receiverSocketId).emit(
        "MESSAGE_REQUEST_RECEIVED",
        newMessageRequest,
      );
    }

    return res.status(200).json({
      success: true,
      message: "Message request sent successfully",
      newMessageRequest,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

// getting all the sent requests
const getAllSentRequests = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    //basic validation
    if (!userId || !mongoose.Types.ObjectId.isValid) {
      return next(new AppError("Invalid user Id", 400));
    }

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(parseInt(limit, 10) || 10, 10);
    const skip = (pageNum - 1) * limitNum;

    const sentRequests = await MessageRequest.aggregate([
      {
        $match: {
          sender: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $skip: skip,
      },
      {
        $limit: limitNum + 1,
      },
      {
        $lookup: {
          from: "users",
          localField: "receiver",
          foreignField: "_id",
          as: "receiver",
        },
      },
      {
        $unwind: {
          path: "$receiver",
        },
      },
      {
        $project: {
          _id: 1,
          content: 1,
          status: 1,
          createdAt: 1,
          receiver: {
            _id: "$receiver._id",
            fullName: "$receiver.fullName",
            avatar: "$receiver.avatar",
          },
        },
      },
    ]);

    const hasMore = sentRequests.lenght > limit;
    if (hasMore) sentRequests.pop();

    return res.status(200).json({
      success: true,
      message: "Sent requests fetched successfully",
      sentRequests,
      page,
      hasMore,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

//getting all the received requests
const getAllReceivedRequests = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    //basic validation
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return next(new AppError("Invalid user Id", 400));
    }

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(parseInt(limit, 10) || 10, 10);
    const skip = (pageNum - 1) * limitNum;

    const receivedRequests = await MessageRequest.aggregate([
      {
        $match: {
          receiver: new mongoose.Types.ObjectId(userId),
          status: "pending",
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $skip: skip,
      },
      {
        $limit: limitNum + 1,
      },
      {
        $lookup: {
          from: "users",
          localField: "sender",
          foreignField: "_id",
          as: "sender",
        },
      },
      {
        $unwind: {
          path: "$sender",
        },
      },
      {
        $project: {
          _id: 1,
          content: 1,
          status: 1,
          createdAt: 1,
          sender: {
            _id: "$sender._id",
            fullName: "$sender.fullName",
            avatar: "$sender.avatar",
          },
        },
      },
    ]);

    const hasMore = receivedRequests.length > limit;
    if (hasMore) receivedRequests.pop();

    return res.status(200).json({
      success: true,
      message: "Received requests fetched successfully",
      receivedRequests,
      page,
      hasMore,
    });
  } catch (error) {
    return next(new AppError(error.message || "Something went wrong", 500));
  }
};

// to cancel a sent request
const cancelSentRequest = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { requestId } = req.params;

    //basic validation
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return next(new AppError("Invalid user Id", 400));
    }

    if (!requestId || !mongoose.Types.ObjectId.isValid(requestId)) {
      return next(new AppError("Invalid request id", 400));
    }

    const request = await MessageRequest.findOne({
      _id: requestId,
      sender: userId,
      status: "pending",
    });

    if (!request) {
      return next(new AppError("Request not found", 404));
    }

    await MessageRequest.deleteOne({
      _id: new mongoose.Types.ObjectId(requestId),
    });

    //return event to the front end using socket.io

    return res.status(200).json({
      success: true,
      message: "Request has been cancelled",
      request,
    });
  } catch (error) {
    return next(new AppError(error.message || "Something went wrong", 500));
  }
};

//accept message request
const acceptMessageRequest = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { requestId } = req.params;

    if (!requestId || !mongoose.Types.ObjectId.isValid(requestId)) {
      return next(new AppError("Invalid request id", 400));
    }

    const request = await MessageRequest.findOne({
      _id: new mongoose.Types.ObjectId(requestId),
      receiver: new mongoose.Types.ObjectId(userId),
      status: "pending",
    });

    if (!request) {
      return next(new AppError("Request not found", 404));
    }

    let chat = await Chat.findOne({
      participants: { $all: [request.sender, userId] },
    });

    if (!chat) {
      chat = await Chat.create({
        participants: [
          request.sender,
          new mongoose.Types.ObjectId(userId),
        ],
      });
    }

    const newMessage = await Message.create({
      sender: request.sender,
      receiver: userId,
      content: request.content,
      chat: chat._id,
    });

    chat.lastMessage = newMessage._id;
    chat.unreadCount.set(request.sender.toString(), 1);
    chat.unreadCount.set(userId.toString(), 0);

    await chat.save();

    await MessageRequest.deleteOne({
      _id: new mongoose.Types.ObjectId(requestId),
    });

    // 🔥 SOCKET EMIT HERE
    const io = req.app.get("io");
    const onlineUsers = getOnlineUsers();

    const senderSocketId = onlineUsers.get(
      request.sender.toString()
    );

    if (senderSocketId) {
      io.to(senderSocketId).emit("MESSAGE_REQUEST_ACCEPTED", {
        chat,
        message: newMessage,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Request has been accepted successfully",
      chat,
      newMessage,
    });

  } catch (error) {
    return next(new AppError(error.message || "Something went wrong", 500));
  }
};


//reject message request
const rejectMessageRequest = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { requestId } = req.params;

    //basic validation
    if (!requestId || !mongoose.Types.ObjectId.isValid(requestId)) {
      return next(new AppError("Invalid request Id", 404));
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const requestObjectId = new mongoose.Types.ObjectId(requestId);

    const request = await MessageRequest.findOne({
      _id: requestObjectId,
      receiver: userObjectId,
      status: "pending",
    });

    if (!request) {
      return next(new AppError("Request not found", 404));
    }

    request.status = "rejected";
    await request.save();

    //notify the sender via socket.io

    return res.status(200).json({
      success: true,
      message: "Request has been rejected successfully",
      request,
    });
  } catch (error) {
    return next(new AppError(error.message || "Something went wrong", 500));
  }
};

export {
  createNewMessageRequest,
  getAllSentRequests,
  getAllReceivedRequests,
  cancelSentRequest,
  acceptMessageRequest,
  rejectMessageRequest,
};
