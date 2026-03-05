import { useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";
function CommentCard({ comment, onDelete }) {
  const user_id = useSelector((state) => state?.auth?.data?._id);
  const post = useSelector((state) => state?.post?.singlePost);

  const authorName = comment?.author?.fullName;
  const avatarUrl = comment?.author?.avatar?.secure_url;
  const content = comment?.content;
  const timeAgo = comment?.createdAt
    ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })
    : "";

  const allowedToDelete =
    comment?.author?._id === user_id || post?.group?.admin === user_id || post?.author?._id === user_id;

  return (
  <div
    className="
      group
      flex items-start gap-3
      p-4
      bg-white
      rounded-xl
      border border-slate-200
      shadow-sm
      hover:shadow-md
      transition-all duration-200
    "
  >
    {/* Avatar */}
    <img
      src={avatarUrl}
      alt="avatar"
      className="
        w-9 h-9
        rounded-full
        object-cover
        ring-2 ring-slate-100
        flex-shrink-0
      "
    />

    {/* Comment Content */}
    <div className="flex-1 min-w-0">

      <div className="flex items-center gap-2 flex-wrap">
        <p className="font-semibold text-sm text-slate-900">
          {authorName}
        </p>

        <span className="text-xs text-slate-500">
          {timeAgo}
        </span>
      </div>

      <p className="
          text-slate-700
          text-sm
          mt-1.5
          leading-relaxed
          whitespace-pre-line
        "
      >
        {content}
      </p>
    </div>

    {/* Delete Button */}
    {allowedToDelete && (
      <button
        onClick={() => {
          onDelete(post?._id, comment?._id)
        }}
        className="
          opacity-0 group-hover:opacity-100
          text-xs font-medium
          text-red-600
          hover:text-red-700
          transition duration-200
        "
      >
        Delete
      </button>
    )}
  </div>
);
}

export default CommentCard;
