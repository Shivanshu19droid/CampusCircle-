import Group from "../models/group.model.js";
import cloudinary from "cloudinary";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import AppError from "../utils/error.util.js";
import mongoose from "mongoose";
import QueuedPost from "../models/queuedPost.model.js";

//create a group
const createGroup = async (req, res, next) => {
  try {
    const { name, description, category } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    if (!name || !description || !category) {
      return next(new AppError("All fields are required", 400));
    }

    const existingGroup = await Group.findOne({ name: name.trim() });

    if (existingGroup) {
      return next(new AppError("Group Name already exists", 400));
    }

    if(!req.file) {
      console.log("NO FILE UPLOADED");
    }

    const groupIcon = {};
    if (req.file) {
      const uploadedImage = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "CampusCircle/groups",
        width: 250,
        gravity: "faces",
        crop: "fill",
      });

      if (uploadedImage) {
        groupIcon.public_id = uploadedImage.public_id;
        groupIcon.secure_url = uploadedImage.secure_url;
      }
    }

    const newGroup = new Group({
      name,
      description,
      category,
      icon: groupIcon,
      admins: [req.user.id],
      members: [req.user.id],
    });

    await newGroup.save();

    await User.findByIdAndUpdate(
      req.user.id,
      { $push: { groups: newGroup._id } },
      { new: true }
    );

    res.status(200).json({
      succes: true,
      message: "Group created successfully",
      newGroup,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

//join group
const joinGroup = async (req, res, next) => {
  try {
    const { groupId } = req.params;

    const userId = req.user.id;

    const group = await Group.findById(groupId);
    const user = await User.findById(userId);

    if (!group) {
      return next(new AppError("Group not found", 404));
    }

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    if (group.members.includes(userId)) {
      return next(new AppError("You are already a member of this group", 400));
    }

    group.members.push(userId);
    user.groups.push(groupId);

    await group.save();
    await user.save();

    res.status(200).json({
      success: true,
      message: `You are now a member of ${group.name} on CampusCircle`,
      group,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

//leave group
const leaveGroup = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.id;

    const group = await Group.findById(groupId);
    const user = await User.findById(userId);

    if (!group) {
      return next(new AppError("Group not found", 404));
    }

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    if (!group.members.includes(userId)) {
      return next(new AppError("You are not a member of this group", 400));
    }

    if (group.admins.some((id) => id.toString() === userId.toString()) && group.admins.length <= 1) {
      return next(new AppError("You are the only admin!, Transfer your rights before leaving", 400));
    }

    group.members = group.members.filter(
      (id) => id.toString() !== userId.toString()
    );
    user.groups = user.groups.filter(
      (id) => id.toString() !== groupId.toString()
    );
    
    if(group.admins.includes(userId)) {
      group.admins = group.admins.filter(
        (id) => id.toString() !== userId.toString()
      );
    };

    await group.save();
    await user.save();

    res.status(200).json({
      success: true,
      message: `You have left ${group.name} on CampusCircle`,
      group,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

//get all groups
const getAllGroups = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, searchQuery = "" } = req.query;

    const query = searchQuery
      ? {
          $or: [
            { name: { $regex: searchQuery, $options: "i" } },
            { category: { $regex: searchQuery, $options: "i" } },
          ],
        }
      : {};

    const skip = (page - 1) * limit;

    const groups = await Group.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalGroups = await Group.countDocuments(query);

    const hasMore = skip + limit < totalGroups;

    res.status(200).json({
      success: true,
      message: "Groups fetched successfully",
      num_of_groups: totalGroups,
      groups,
      hasMore,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

//get individual group details (including admin, members, posts)
const getGroupDetails = async (req, res, next) => {
  try {
    const { groupId } = req.params;

    const projection = {};
    projection["admins"] = {$slice: [0,1]};

    const group = await Group.findById(groupId)
      .populate("admins", "_id fullName avatar")
      

    if (!group) {
      return next(new AppError("Group not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Group details fetched successfully",
      group,
      length: group.admins.length
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

// Delete a group
const deleteGroup = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.id;

    const group = await Group.findById(groupId);
    const user = await User.findById(userId);

    if (!group) {
      return next(new AppError("Group not found", 404));
    }

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    if (group.admin.toString() !== userId.toString()) {
      return next(new AppError("You are not the admin of this group", 403));
    }

    // Group id removed from user's groups field
    await User.updateMany(
      { _id: { $in: group.members } },
      { $pull: { groups: groupId } }
    );

    // delete the posts of the group
    await Post.deleteMany({ group: groupId });

    // finally delete the group
    const deletedGroup = await Group.findByIdAndDelete(groupId);

    res.status(200).json({
      success: true,
      message: "Group deleted successfully",
      deletedGroup,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

// fetching the paginated members of the group
const fetchPaginatedGroupMembers = async(req, res, next) => {
  try {
    const {groupId} = req.params;
    const {page=1, limit=10, flag="members"} = req.query;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return next(new AppError('Invalid group id', 400));
    }

    const pageNum = Math.max(parseInt(page,10) || 1, 1);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;
    const flagItem = flag==="members"?"members":"admins";
    
    //defining the projection to fetch the members
    const projection = {}
    projection[flagItem] = {$slice: [skip, limitNum+1]}

    const group = await Group.findById(groupId, projection)
                             .populate(flagItem, "_id fullName avatar")
                             .lean();

    if(!group) {
      return next(new AppError("Group not found", 404));
    }

    const fetchedMembers = group[flagItem] || [];
    const hasMore = fetchedMembers.length > limitNum;
    const members = hasMore? fetchedMembers.slice(0, limitNum) : fetchedMembers;

    if(flagItem === "members") {
      return res.status(200).json({
        success: true,
        members: members,
        hasMoreMembers: hasMore,
        memberPage: pageNum,
        flagItem
      })
    } else if(flagItem === "admins") {
      return res.status(200).json({
        success: true,
        admins: members,
        hasMoreAdmins: hasMore,
        adminPage: pageNum,
        flagItem
      })
    }

    
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
}

const fetchPaginatedGroupPosts = async(req, res, next) => {
  try {
    const {groupId} = req.params;
    const {page = 1,limit = 10} = req.query;

    const pageNum = Math.max(parseInt(page,10) || 1,1);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum-1)*limitNum;

    const posts = await Post.find({group: groupId})
                            .populate("author", "_id fullName avatar")
                            .sort({createdAt: -1})
                            .skip(skip)
                            .limit(limitNum + 1)
                            .lean();

    if(!posts) {
      return next(new AppError("Posts not found", 404));
    }

    const hasMore = posts.length > limitNum;

    if(hasMore) {
      posts.pop();
    }

    const postsCount = await Post.countDocuments({group: groupId});

    return res.status(200).json({
      success: true,
      posts: posts,
      hasMorePosts: hasMore,
      page,
      limit,
      postsCount
    })
  } catch(error) {
    return next(new AppError(error.message, 500));
  }
}


//removing a member from the group
const removeFromGroup = async(req, res, next) => {
  try {
    const {groupId, userId} = req.params;
    
    const group = await Group.findById(groupId);

    if(!group) {
      return next(new AppError("Group not found", 404));
    }

    const member = await User.findById(userId);

    if(!member) {
      return next(new AppError('Member not found', 404));
    }

    if(!group.members.some(id => id.toString() === userId.toString() || !member.groups.some(id=>id.toString()===groupId.toString()))) {
      return next(new AppError(`${member.fullName} is not a member`));
    }

    group.members = group.members.filter((id) => id.toString() !== userId.toString());
    member.groups = member.groups.filter((id) => id.toString() !== groupId.toString());

    await member.save();

    await group.save();

    return res.status(200).json({
      success: true,
      message:`${member.fullName} has bee removed from ${group.name}`,
      group,
      member 
    });
  } catch(error) {
    return next(new AppError(error.message, 500));
  }
}

//making someone group admin
const makeAdmin = async(req, res, next) => {
  try {
    const {groupId, userId} = req.params;

    const group = await Group.findById(groupId);

    if(!group) {
       return next(new AppError("Group not found", 404));
    }

    const member = await User.findById(userId);

    if(!member) {
      return next(new AppError("Member not found", 404));
    }

    if(!group.members.some(id=>id.toString() === userId.toString()) || !member.groups.some(id=>id.toString() === groupId.toString())) {
      return next(new AppError(`${member.fullName} is not a member of ${group.name}`));
    }

    if(group.admins.some(id => id.toString() === userId.toString())) {
      return next(new AppError(`${member.fullName} is already an admin`, 400));
    }

    group.admins.push(userId);

    await group.save();

    return res.status(200).json({
      success: true,
      message: `${member.fullName} is now an admin`,
      admins: group.admins,
      member
    });


  } catch(error) {
    return next(new AppError(error.message, 500));
  }
}

// removing someone from admin
const removeFromAdmin = async(req, res, next) => {
  try {
    const {groupId, userId} = req.params;

    const group = await Group.findById(groupId);
    
    if(!group) {
      return next(new AppError("Group not found", 404));
    };

    const member = await User.findById(userId);
    if(!member) {
      return next(new AppError("Member not found", 404));
    }

    if(!group.members.some(id=>id.toString() === userId.toString()) || !member.groups.some(id=>id.toString() === groupId.toString())) {
      return next(new AppError(`${member.fullName} is not a member of ${group.name}`, 400));
    }

    if(!group.admins.some(id=>id.toString() === userId.toString())) {
      return next(new AppError(`${member.fullName} is not an admin`, 400));
    }

    if(group.admins.length <= 1) {
      return next(new AppError("cannot remove the only admin", 400));
    } 

    group.admins = group.admins.filter((id) => id.toString() !== userId.toString());
    await group.save();

    return res.status(200).json({
      success: true,
      message: `${member.fullName} is no longer an admin`,
      admins: group.admins,
      member
    })
      
  } catch(error) {
    return next(new AppError(error.message, 500));
  }
}

//fetching paginated queued posts
//we fetch limit + 1 posts, to further check if next page exists, this prevents an additional DB query for counting documents
const fetchPaginatedQueuedPosts = async(req, res, next) => {
  try {
    const {groupId} = req.params;
    const {page=1, limit=10} = req.query;

    const pageNum = Math.max(parseInt(page, 10) || 1,1);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1)*limitNum;

    const queuedPosts = await QueuedPost.find({group: groupId})
                                        .populate("author", "_id fullName avatar")
                                        .sort({createdAt: -1})
                                        .skip(skip)
                                        .limit(limitNum + 1)
                                        .lean();

    if(!queuedPosts) {
      return next(new AppError("Queued posts not found", 404));
    }

    const hasMore = queuedPosts.length > limitNum;

    if(hasMore) {
      queuedPosts.pop();
    }

    const queuedPostsCount = await QueuedPost.countDocuments({group: groupId});

    return res.status(200).json({
      success: true,
      queuedPosts: queuedPosts,
      hasMoreQueuedPosts: hasMore,
      page,
      limit,
      queuedPostsCount
    });

  } catch(error) {
    return next(new AppError(error.message, 500));
  }
}

export {
  createGroup,
  joinGroup,
  leaveGroup,
  getAllGroups,
  getGroupDetails,
  deleteGroup,
  fetchPaginatedGroupMembers,
  fetchPaginatedGroupPosts,
  removeFromGroup,
  makeAdmin,
  removeFromAdmin,
  fetchPaginatedQueuedPosts
};
