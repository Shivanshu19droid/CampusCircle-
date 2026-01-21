import { formatDistanceToNow } from "date-fns";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";



function QueuedPostCard({queuedPost, onAccept, onReject}) {
    const authorName = queuedPost?.author?.fullName;
    const avatarUrl = queuedPost?.author?.avatar?.secure_url;
    const postImage = queuedPost?.image?.secure_url;
    const content = queuedPost?.content;

    return (
  <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5 flex flex-col gap-4">

    {/* AUTHOR HEADER */}
    <div className="flex items-center gap-3">
      <img
        src={avatarUrl || "/default-avatar.png"}
        alt={authorName}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="flex flex-col">
        <span className="font-semibold text-gray-800">
          {authorName || "Unknown User"}
        </span>
        <span className="text-xs text-gray-500">
          {formatDistanceToNow(new Date(queuedPost?.createdAt), {
            addSuffix: true,
          })}
        </span>
      </div>
    </div>

    {/* CONTENT */}
    {content && (
      <p className="text-gray-700 text-sm leading-relaxed">
        {content}
      </p>
    )}

    {/* POST IMAGE */}
    {postImage && (
      <img
        src={postImage}
        alt="Queued post"
        className="w-full max-h-96 rounded-lg object-cover border"
      />
    )}

    {/* ACTION BUTTONS */}
    <div className="flex gap-4 mt-2">
      <button
        onClick={() => onAccept(queuedPost._id)}
        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition"
      >
        <FaCheckCircle size={18} />
        Accept
      </button>

      <button
        onClick={() => onReject(queuedPost._id)}
        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition"
      >
        <FaTimesCircle size={18} />
        Reject
      </button>
    </div>

  </div>
);

}

export default QueuedPostCard;