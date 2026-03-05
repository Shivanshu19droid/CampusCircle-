import { formatDistanceToNow } from "date-fns";
import { useSelector } from "react-redux";
import { Heart, MessageCircle } from "lucide-react";
import { useEffect } from "react";
function PostCardFull({post, onLike, onDelete, isLiked, onCommentsClick}) {

    const authorName = post?.author?.fullName;
    const avatarUrl = post?.author?.avatar?.secure_url;
    const groupName = post?.group?.name;
    const postImage = post?.image?.secure_url;
    const content = post?.content;
    const groupIcon = post?.group?.icon?.secure_url;

    const timeAgo = post?.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) : "";

    const user_id = useSelector((state) => state?.auth?.data?._id);

    const allowedToDelete = user_id === post?.author?._id || post?.group?.admins?.some((admin) => admin === user_id);

    useEffect(() => {
      console.log(post);
      console.log(allowedToDelete);
    })

    

return (
  <div
    className="
      bg-white
      rounded-2xl
      overflow-hidden
      border border-slate-200
      shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)]
    "
  >

    {/* ===== HEADER ===== */}
    <div className="px-6 py-4 flex items-center justify-between">

      <div className="flex items-center gap-3">

        <img
          src={avatarUrl}
          alt="avatar"
          className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-100"
        />

        <div className="leading-tight">
          <p className="font-semibold text-slate-900 text-sm">
            {authorName}
          </p>

          <p className="text-xs text-slate-500">
            {timeAgo}
          </p>

          {groupName && (
            <div className="flex items-center gap-2 mt-1">
              <img
                src={groupIcon}
                alt="group"
                className="w-4 h-4 rounded-full"
              />
              <p className="text-xs text-slate-600">
                {groupName}
              </p>
            </div>
          )}
        </div>
      </div>

    </div>

    {/* ===== MEDIA ===== */}
    {postImage && (
      <div className="w-full bg-black">
        <img
          src={postImage}
          alt="post"
          className="w-full max-h-[600px] object-cover"
        />
      </div>
    )}

    {/* ===== CONTENT ===== */}
    {content && (
      <div className="px-6 py-4">
        <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-line">
          {content}
        </p>
      </div>
    )}

    {/* ===== DIVIDER ===== */}
    <div className="border-t border-slate-200" />

    {/* ===== ACTION BAR ===== */}
    <div className="px-6 py-4 flex items-center justify-between">

      <div className="flex items-center gap-6">

        {/* LIKE BUTTON */}
        <button
          onClick={() => onLike(post?._id)}
          className="
            flex items-center gap-2
            text-slate-700
            hover:text-indigo-700
            transition duration-200
          "
        >
          <Heart
            size={20}
            fill={isLiked ? "#4338CA" : "none"}
            stroke={isLiked ? "#4338CA" : "currentColor"}
          />
          <span className="text-sm font-medium">
            {post.likes?.length || 0}
          </span>
        </button>

        {/* COMMENT BUTTON */}
        <button
          onClick={onCommentsClick}
          className="
            flex items-center gap-2
            text-slate-700
            hover:text-indigo-700
            transition duration-200
          "
        >
          <MessageCircle size={20} />
          <span className="text-sm font-medium">
            {post.comments?.length || 0}
          </span>
        </button>

      </div>

      {/* DELETE BUTTON */}
      {allowedToDelete && (
        <button
          onClick={() => onDelete(post?._id)}
          className="
            inline-flex items-center gap-2
            px-3 py-1.5
            rounded-lg
            border border-red-200
            bg-red-50
            text-red-600
            text-xs font-medium
            hover:bg-red-100
            hover:border-red-300
            transition duration-200
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-4 h-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />
          </svg>
          Delete
        </button>
      )}

    </div>

  </div>
);


    
}

export default PostCardFull;