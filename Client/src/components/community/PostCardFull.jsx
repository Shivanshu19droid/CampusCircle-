import { formatDistanceToNow } from "date-fns";
import { useSelector } from "react-redux";
import { Heart, MessageCircle } from "lucide-react";
function PostCardFull({post, onLike, onDelete, isLiked, onCommentsClick}) {

    const authorName = post?.author?.fullName;
    const avatarUrl = post?.author?.avatar?.secure_url;
    const groupName = post?.group?.name;
    const postImage = post?.image?.secure_url;
    const content = post?.content;
    const groupIcon = post?.group?.icon?.secure_url;

    const timeAgo = post?.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) : "";

    const user_id = useSelector((state) => state?.auth?.data?._id);

    const allowedToDelete = user_id === post?.author?._id || user_id === post?.group?.admin;

    

return (
  <div className="bg-white rounded-xl shadow-md p-4 mb-6">

    {/* AUTHOR */}
    <div className="flex items-center gap-3 mb-4">
      <img 
        src={avatarUrl}
        alt="avatar"
        className="w-12 h-12 rounded-full object-cover"
      />
      <div>
        <p className="font-semibold text-gray-900">{authorName}</p>
        <p className="text-xs text-gray-500">{timeAgo}</p>

        {/* Group */}
        {groupName && (
          <div className="flex items-center gap-2 mt-1">
            <img 
              src={groupIcon}
              alt="group"
              className="w-5 h-5 rounded-full"
            />
            <p className="text-xs text-gray-600">{groupName}</p>
          </div>
        )}
      </div>
    </div>

    {/* CONTENT */}
    <p className="text-gray-800 text-sm mb-4 whitespace-pre-line">
      {content}
    </p>

    {/* IMAGE */}
    {postImage && (
      <img 
        src={postImage}
        alt="post"
        className="w-full rounded-lg max-h-[550px] object-cover mb-4"
      />
    )}

    {/* ACTIONS */}
    <div className="flex items-center justify-between mt-4">

      {/* LIKE BUTTON & COUNT */}
      <button 
        onClick={() => onLike(post?._id)}
        className="flex items-center gap-2 text-gray-700 hover:text-red-500 transition"
      >
        <Heart 
          size={20} 
          fill={isLiked ? "red" : "none"} 
          stroke={isLiked ? "red" : "currentColor"}
        />
        <span className="font-medium">
          {post.likes?.length || 0}
        </span>
      </button>

      {/* COMMENT BUTTON & COUNT */}
      <button 
        onClick={onCommentsClick}
        className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition"
      >
        <MessageCircle size={20} />
        <span className="font-medium">
          {post.comments?.length|| 0}
        </span>
      </button>

      {/* DELETE BUTTON */}
      {allowedToDelete && (
        <button
          onClick={() => onDelete(post?._id)}
          className="text-red-500 font-medium hover:underline"
        >
          Delete
        </button>
      )}

    </div>

  </div>
);


    
}

export default PostCardFull;