import { formatDistanceToNow } from "date-fns";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";



function QueuedPostCard({queuedPost, onAccept, onReject}) {
    const authorName = queuedPost?.author?.fullName;
    const avatarUrl = queuedPost?.author?.avatar?.secure_url;
    const postImage = queuedPost?.image?.secure_url;
    const content = queuedPost?.content;

    return (
  <div
    className="
      bg-white
      rounded-xl
      border border-slate-200
      shadow-sm
      overflow-hidden
      transition duration-200
      hover:shadow-md
    "
  >

    {/* ===== POST HEADER ===== */}
    <div className="px-5 py-4 flex items-start justify-between">

      <div className="flex items-center gap-3">
        <img
          src={avatarUrl || "/default-avatar.png"}
          alt={authorName}
          className="w-10 h-10 rounded-full object-cover"
        />

        <div>
          <p className="font-semibold text-slate-900 text-sm">
            {authorName || "Unknown User"}
          </p>

          <p className="text-xs text-slate-500">
            {formatDistanceToNow(new Date(queuedPost?.createdAt), {
              addSuffix: true,
            })}
          </p>
        </div>
      </div>

      <span
        className="
          text-[11px] font-semibold
          px-2.5 py-1
          rounded-full
          bg-amber-100
          text-amber-700
          uppercase tracking-wide
        "
      >
        Pending
      </span>

    </div>

    {/* ===== POST CONTENT ===== */}
    {content && (
      <div className="px-5 pb-3">
        <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line">
          {content}
        </p>
      </div>
    )}

    {/* ===== POST IMAGE ===== */}
    {postImage && (
      <div className="w-full bg-black">
        <img
          src={postImage}
          alt="Queued post"
          className="w-full max-h-[420px] object-cover"
        />
      </div>
    )}

    {/* ===== ADMIN ACTION BAR ===== */}
    <div className="border-t border-slate-200 bg-slate-50 px-5 py-4 flex gap-3">

      {/* APPROVE */}
      <button
        onClick={() => onAccept(queuedPost._id)}
        className="
          flex-1
          py-3
          rounded-lg
          bg-gradient-to-b from-indigo-800 to-indigo-700
          hover:from-indigo-900 hover:to-indigo-800
          text-white
          text-base
          font-semibold
          shadow-md
          transition duration-200
        "
      >
        Approve
      </button>

      {/* REJECT */}
      <button
        onClick={() => onReject(queuedPost._id)}
        className="
          flex-1
          py-3
          rounded-lg
          bg-gradient-to-b from-red-600 to-red-500
          hover:from-red-700 hover:to-red-600
          text-white
          text-base
          font-semibold
          shadow-md
          transition duration-200
        "
      >
        Reject
      </button>

    </div>

  </div>
);

}

export default QueuedPostCard;