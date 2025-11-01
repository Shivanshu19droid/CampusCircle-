import Group from "../models/group.model.js";
import cloudinary from "cloudinary";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import AppError from "../utils/error.util.js";

//create a group
const createGroup = async (req, res, next) => {
  try {
    const { name, description, category } = req.body;

    if (!name || !description || !category) {
      return next(new AppError("All fields are required", 400));
    }

    const existingGroup = await Group.findOne({ name: name.trim() });

    if (existingGroup) {
      return next(new AppError("Group Name already exists", 400));
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
      admin: req.user.id,
      members: [req.user.id],
    });

    await newGroup.save();

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
      message: `You are now a member of ${(group.name)} on CampusCircle`,
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

    group.members = group.members.filter(
      (id) => id.toString() !== userId.toString()
    );
    user.groups = user.groups.filter(
      (id) => id.toString() !== groupId.toString()
    );

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
const getAllGroups = async(req, res, next) => {
    try{
      const {page=1, limit=10, searchQuery=""} = req.query;

      const query = searchQuery? {
        $or: [
          {name: {$regex: searchQuery, $options: "i"}},
          {category: {$regex: searchQuery, $options: "i"}}
        ]
      } : {};
      
      const skip = (page - 1) * limit;

      const groups = await Group.find(query)
      .skip(skip)
      .limit(limit)
      .sort({createdAt: -1})

      const totalGroups = await Group.countDocuments(query);

      const hasMore = skip + limit < totalGroups;

      res.status(200).json({
        success: true,
        message: "Groups fetched successfully",
        num_of_groups: totalGroups,
        groups,
        hasMore
      });

    } catch(error) {
        return next(new AppError(error.message, 500));
    }
};

//get individual group details (including admin, members, posts)
const getGroupDetails = async(req, res, next) => {
  try {
    const {groupId} = req.params;

    const group = await Group.findById(groupId)
    .populate("admin", "_id fullName avatar")
    .populate("members", "_id fullName avatar")

    if(!group) {
      return next(new AppError("Group not found", 404))
    }

    const posts = await Post.find({group: groupId})
    .populate("author", "_id fullName avatar")
    .sort({createdAt: -1})

    res.status(200).json({
      success: true,
      message: "Group details fetched successfully",
      group,
      posts
    });

  } catch(error) {
    return next(new AppError(error.message, 500))
  }
}

// Delete a group
const deleteGroup = async(req, res, next) => {
  try {
    const {groupId} = req.params;
    const userId = req.user.id;

    const group = await Group.findById(groupId);
    const user = await User.findById(userId);

    if(!group) {
      return next(new AppError("Group not found", 404));
    }

    if(!user) {
      return next(new AppError("User not found", 404));
    }

    if(group.admin.toString() !== userId.toString()){
      return next(new AppError("You are not the admin of this group", 403));
    }

    // Group id removed from user's groups field
    await User.updateMany(
      {_id: {$in: group.members}},
      {$pull: {groups: groupId}}
    );

    // delete the posts of the group
    await Post.deleteMany({group: groupId});

    // finally delete the group
    const deletedGroup = await Group.findByIdAndDelete(groupId);

    res.status(200).json({
      success: true,
      message: "Group deleted successfully",
      deletedGroup
    });

  } catch(error) {
    return next(new AppError(error.message, 500))
  }
}

export{
  createGroup,
  joinGroup,
  leaveGroup,
  getAllGroups,
  getGroupDetails,
  deleteGroup
}
