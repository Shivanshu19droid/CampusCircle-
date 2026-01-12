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
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
      {/* Avatar */}
      <img
        src={avatarUrl}
        alt="avatar"
        className="w-10 h-10 rounded-full object-cover"
      />

      {/* Comment Content */}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-sm text-gray-900">{authorName}</p>
          <span className="text-xs text-gray-500">{timeAgo}</span>
        </div>

        <p className="text-gray-700 text-sm mt-1 whitespace-pre-line">
          {content}
        </p>
      </div>

      {/* Delete Button */}
      {allowedToDelete && (
        <button
          onClick={() => {
            onDelete(post?._id, comment?._id)
          }
        }
          className="text-red-500 text-xs font-medium hover:underline"
        >
          Delete
        </button>
      )}
    </div>
  );
}

export default CommentCard;
