import Group from "../models/group.model.js";
import cloudinary from "cloudinary";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import AppError from "../utils/error.util.js";
import QueuedPost from "../models/queuedPost.model.js";
import fs from 'fs';

// create post
const createPost = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { groupId, content } = req.body;

    // 1️⃣ Verify user
    const user = await User.findById(userId);
    if (!user) return next(new AppError("User not found", 404));

    // 2️⃣ Check if groupId provided → validate group
    let group = null;
    if (groupId) {
      group = await Group.findById(groupId);
      if (!group) return next(new AppError("Group not found", 404));
    }

    // 3️⃣ Handle empty post (no text, no image)
    if (!content && !req.file) {
      return next(new AppError("Empty posts cannot be created", 400));
    }

    // 4️⃣ Handle image upload (if present)
    const postImage = {};

    if(!req.file){
      console.log(" no image exists");
    }
    if (req.file) {
      const uploadedImage = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "CampusCircle/posts",
        width: 250,
        gravity: "faces",
        crop: "fill",
      });

      postImage.public_id = uploadedImage.public_id;
      postImage.secure_url = uploadedImage.secure_url;

      console.log(postImage);

      // delete local file after upload
      fs.unlinkSync(req.file.path);
    }

    // 5️⃣ If no groupId → individual post
    if (!group) {
      const newPost = new Post({
        content,
        image: postImage,
        author: userId,
      });

      await newPost.save();

      return res.status(200).json({
        success: true,
        message: "Your post has been created successfully",
        newPost,
      });
    }

    // 6️⃣ If group exists → member & admin checks
    const isMember = group.members.some(
      (member) => member.toString() === userId
    );

    if (!isMember) {
      return next(new AppError("You are not a member of this group", 403));
    }

    const isAdmin = group.admin.toString() === userId;

    if (isAdmin) {
      const newPost = new Post({
        content,
        image: postImage,
        author: userId,
        group: groupId,
      });

      await newPost.save();

      return res.status(200).json({
        success: true,
        message: `You have successfully created a post in ${group.name}`,
        newPost,
      });
    } else {
      const newQueuedPost = new QueuedPost({
        content,
        image: postImage,
        author: userId,
        group: groupId,
      });

      await newQueuedPost.save();

      return res.status(200).json({
        success: true,
        message: `Your post has been queued for approval by ${group.name}'s admin`,
        newQueuedPost,
      });
    }
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

// handle like and unlike
const handleLikeUnlike = async (req, res, next) => {
  try {
    const {postId}  = req.params;
    const userId = req.user.id;

    const post = await Post.findById(postId)
                     .populate("author", "fullName avatar");

    if (!post) {
      return next(new AppError("Post not found", 404));
    }

    // check if user has already liked
    const alreadyLiked = post?.likes?.some(
      (id) => id.toString() === userId.toString()
    );

    if (alreadyLiked) {
      // unlike
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
      await post.save();

      return res.status(200).json({
        success: true,
        message: "UnLiked",
        likesCount: post.likes.length,
        post
      });
    } else {
      // like
      post.likes.push(userId);
      await post.save();

      return res.status(200).json({
        success: true,
        message: "👍Liked",
        likesCount: post.likes.length,
        post
      });
    }
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

//comment on a post
const commentOnPost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    const post = await Post.findById(postId);

    if (!post) {
      return next(new AppError("Post not found", 404));
    }

    if (!content) {
      return next(new AppError("Empty comments are not allowed", 404));
    }

    const postAuthor = await User.findById(post.author);

    const comment = {
      author: userId,
      content,
    };

    post.comments.push(comment);

    await post.save();

    return res.status(200).json({
      success: true,
      message: `You have commented on ${postAuthor.fullName}'s post`,
      comment,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

// approve post
const approvePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const queuedPost = await QueuedPost.findById(postId);
    if (!queuedPost) {
      return next(new AppError("Post not found", 404));
    }

    const group = await Group.findById(queuedPost.group);
    if (!group) {
      return next(new AppError("Group not found", 404));
    }

    // ✅ Safer comparison using .equals()
    if (!group.admin.equals(userId)) {
      return next(new AppError("Only group admins are allowed to approve posts", 403));
    }

    const approvedPost = new Post({
      content: queuedPost.content,
      image: queuedPost.image,
      author: queuedPost.author,
      group: queuedPost.group,
    });

    await approvedPost.save();

    // Remove the queued version after approval
    await QueuedPost.findByIdAndDelete(postId);

    const author = await User.findById(approvedPost.author);

    return res.status(200).json({
      success: true,
      message: `${author.fullName}'s post has been approved`,
      approvedPost,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

// reject post
const rejectPost = async(req, res, next) => {
    try{
      const {postId} = req.params;
      const userId = req.user.id;

      console.log(postId);

      const queuedPost = await QueuedPost.findById(postId);

      if(!queuedPost) {
        return next(new AppError("Post not found", 404));
      }

      const group = await Group.findById(queuedPost.group);
      
      if(!group) {
        return next(new AppError("Group not found", 404)); 
      }

      if(!group.admin.equals(userId)) {
        return next(new AppError("Only group admins are allowed to reject posts", 403));
      }

      const author = await User.findById(queuedPost.author);

      const rejectedPost = await QueuedPost.findByIdAndDelete(postId);

      return res.status(200).json ({
        success: true,
        message: `${author.fullName}'s post has been rejected`,
        rejectedPost
      });

    } catch(error) {
        return next(new AppError(error.message, 500));
    }
};

// get all posts
const getAllPosts = async(req, res, next) => {
  try {
    const userId = req.user.id;
    const {page=1, limit=10} = req.query;

    const user = await User.findById(userId);

    if(!user) {
      return next(new AppError("User not found", 404));
    }

    const skip = (page - 1) * limit;

    const followingIds = user.following;
    const joinedGroupIds = user.groups;

    const personalizedPosts = await Post.find({
      $or: [
        { author: { $in: followingIds } },
        { group: { $in: joinedGroupIds } },
      ],
    })
      .populate("author", "fullName avatar")
      .populate("group", "name icon")
      .sort({ createdAt: -1 });

    const discoveryPosts = await Post.find({
      author: { $nin: [...followingIds, userId] },
      group: { $nin: joinedGroupIds}
    })
      .populate("author", "fullName avatar")
      .populate("group", "name icon")
      .sort({ createdAt: -1 });

    const allPosts = [...personalizedPosts, ...discoveryPosts];

    const paginatedPosts = allPosts.slice(skip, skip +  parseInt(limit));

    const hasMore = skip + parseInt(limit) < allPosts.length;

    return res.status(200).json({
      success: true,
      message: "Welcome to your CampusCircle community",
      posts: paginatedPosts,
      hasMore
    });

  } catch(error) {
    return next(new AppError(error.message, 500));
  }
}

// view post along with its paginated comments
const viewPost = async(req, res, next) => {
  try {
    const {postId} = req.params;

    const post = await Post.findById(postId)
    .populate("author", "fullName avatar")
    .populate("group", "name icon admin")
    .lean();

    if(!post) {
      return next(new AppError("Post not found", 404));
    }

    const {comments, ...rest} = post;

    return res.status(200).json({
      success: true,
      message: "Post fetched successfully",
      post: rest
    });

  } catch(error) {
    return next(new AppError(error.message, 500));
  }
};

// getting the paginated comments for a post
const getPaginatedComments = async(req, res, next) => {
  try {
    const {postId} = req.params;
    const {page=1, limit=10} = req.query;

    const post = await Post.findById(postId)
    .populate("comments.author", "fullName avatar");

    if(!post) {
      return next(new AppError("Post not found", 404));
    }

    const skip = (page - 1) * limit;
    
    const comments = post.comments.slice(skip, skip + parseInt(limit));

    const sortedComments = comments.sort((a,b) => b.createdAt - a.createdAt);

    const hasMore = skip + parseInt(limit) < post.comments.length;

    return res.status(200).json({
      success: true,
      comments: sortedComments,
      hasMore
    })
  } catch(error) {
    return next(new AppError(error.message, 500));
  }
}

// delete post
const deletePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) {
      return next(new AppError("Post not found", 404));
    }

    let group = null;
    if (post.group) {
      group = await Group.findById(post.group);
    }

    // Authorization check — only post author or group admin can delete
    if (
      post.author.toString() !== userId &&
      group?.admin.toString() !== userId
    ) {
      return next(
        new AppError("You are not authorized to delete this post", 403)
      );
    }

    // Optional: remove associated image from Cloudinary
    if (post.image?.public_id) {
      await cloudinary.v2.uploader.destroy(post.image.public_id);
    }

    const deletedPost = await Post.findByIdAndDelete(postId);

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
      deletedPost
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

const deleteComment = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const {postId, commentId} = req.params;

      const post = await Post.findById(postId);

      if(!post) {
        return next(new AppError("Post not found", 404));
      }

      const comment = post.comments.find(comment => comment._id.toString() === commentId);
      
      if(!comment) {
        return next(new AppError("Comment not found", 404));
      }

      const hasPermission = comment.author.toString() === userId || post.author.toString() === userId;

      if(!hasPermission) {
        return next(new AppError("You do not have permission to delete this comment", 403));
      }

      post.comments = post.comments.filter(comment => comment._id.toString() !== commentId);
      await post.save();

      return res.status(200).json ({
        success: true,
        message: "You deleted this comment",
        deletedComment: comment
      })
    } catch(error) {
      return next(new AppError(error.message, 500));
    }
  }

export {
  createPost,
  handleLikeUnlike,
  commentOnPost,
  approvePost,
  rejectPost,
  getAllPosts,
  viewPost,
  deletePost,
  getPaginatedComments,
  deleteComment
};


