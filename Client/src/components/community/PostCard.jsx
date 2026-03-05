import { Heart, MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useSelector } from "react-redux";
import { memo } from "react";

function PostCard({
  post,
  onLike,
  navigateToPost,
  navigateToComments,
  user_id,
}) {
  //these functions are passed as props and will be defined inside the parent component

  const authorName = post?.author?.fullName;
  const avatarUrl = post?.author?.avatar?.secure_url;
  const groupName = post?.group?.name;
  const imageUrl = post?.image?.secure_url;
  const content = post?.content;

  //const user_id = useSelector((state) => state?.auth?.data?._id);

  const timeAgo = post?.createdAt
    ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
    : "";

  const isLiked = post.likes?.includes(user_id);

  return (
  <div
    className="
      bg-white
      rounded-2xl
      p-5 sm:p-6
      border border-slate-200/70
      shadow-[0_4px_20px_rgba(15,23,42,0.05)]
      cursor-pointer
      transition-all duration-200
      hover:shadow-[0_8px_28px_rgba(15,23,42,0.08)]
    "
    onClick={() => navigateToPost(post._id)}
  >
    {/* ================= HEADER ================= */}
    <div className="flex items-start gap-4">
      <img
        src={avatarUrl}
        alt={authorName}
        className="w-11 h-11 rounded-full object-cover flex-shrink-0"
        loading="lazy"
      />

      <div className="min-w-0">
        {/* Name */}
        <span className="font-semibold text-[15px] text-blue-600 hover:underline truncate block">
          {authorName}
        </span>

        {/* Meta */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
          {groupName && (
            <>
              <span className="text-slate-600 font-medium truncate">
                {groupName}
              </span>
              <span className="text-slate-300">•</span>
            </>
          )}
          <span className="text-slate-400">{timeAgo}</span>
        </div>
      </div>
    </div>

    {/* ================= CONTENT ================= */}
    {content && (
      <p className="mt-4 text-[15px] text-slate-800 leading-relaxed whitespace-pre-line">
        {content}
      </p>
    )}

    {/* ================= IMAGE ================= */}
    {imageUrl && (
      <div className="mt-4 overflow-hidden rounded-xl">
        <img
          src={imageUrl}
          alt="Post"
          className="w-full object-cover max-h-[420px]"
          loading="lazy"
        />
      </div>
    )}

    {/* ================= FOOTER ================= */}
    <div className="flex items-center gap-6 mt-5 text-sm text-slate-600">
      {/* Like */}
      <div
        className="flex items-center gap-2 cursor-pointer hover:text-indigo-700 transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          onLike(post._id);
        }}
      >
        {isLiked ? (
          <Heart
            size={18}
            className="text-indigo-900 fill-current"
          />
        ) : (
          <Heart
            size={18}
            className="text-slate-500"
          />
        )}
        <span className="font-medium">
          {post.likes?.length || 0} Likes
        </span>
      </div>

      {/* Comments */}
      <div
        className="flex items-center gap-2 cursor-pointer hover:text-indigo-700 transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          navigateToComments(post._id);
        }}
      >
        <MessageCircle size={18} />
        <span className="font-medium">
          {post.comments?.length || 0} Comments
        </span>
      </div>
    </div>
  </div>
);
}

export default memo(PostCard);
