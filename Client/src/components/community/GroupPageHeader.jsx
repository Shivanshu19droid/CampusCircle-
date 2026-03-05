import React from "react";
import { useSelector } from "react-redux";
export default function GroupPageHeader({
  group,
  isMember,
  isAdmin,
  isOnlyAdmin,
  onJoin,
  onLeave,
  onEdit,
  onDelete,
  onAdminClick,
  onNewPost,
  onReviewPost
}) {
  const groupName = group?.name;
  const groupCategory = group?.category;
  const groupDescription = group?.description;
  const groupIconUrl = group?.icon?.secure_url;
  const groupMembersCount = group?.members?.length || 0;

  const admins = useSelector(state => state?.group?.admins);
  const visibleAdmins = admins.slice(0, 3);
  const remainingAdminsCount = Math.max(0, admins.length - visibleAdmins.length);

  return (
  <div
    className="
      rounded-2xl overflow-hidden shadow-lg
      lg:sticky lg:top-24
      lg:max-w-[420px]
    "
  >

    {/* 🔷 INDIGO HEADER */}
    <div
      className="
        relative
        bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-700
        px-6 md:px-10 py-8
        lg:px-6 lg:py-6
      "
    >

      {/* Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.15),transparent_40%)]" />

      <div className="relative flex flex-col items-center lg:items-start gap-6 lg:gap-4 text-center lg:text-left">

        {/* Icon */}
        <div className="flex-shrink-0">
          <div
            className="
              w-28 h-28 rounded-full
              bg-white/10 backdrop-blur-md border border-white/20 shadow-xl
              lg:w-20 lg:h-20
            "
          >
            <img
              src={groupIconUrl || "/group-default.png"}
              alt={groupName}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 text-white">

          <h1 className="text-2xl md:text-3xl lg:text-xl font-semibold tracking-tight">
            {groupName}
          </h1>

          <p className="mt-2 lg:mt-1 text-sm text-indigo-100 leading-relaxed line-clamp-3">
            {groupDescription ||
              "No description yet — add a short intro to tell members what this group is about."}
          </p>

          {/* Meta */}
          <div className="mt-4 lg:mt-3 flex flex-wrap justify-center lg:justify-start gap-3 text-sm">

            <span className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full border border-white/20">
              {groupCategory || "General"}
            </span>

            <span className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full border border-white/20">
              {groupMembersCount} members
            </span>
          </div>

          {/* Admin Preview */}
          <div className="mt-5 lg:mt-4 flex items-center justify-center lg:justify-start gap-3">
            <div className="flex -space-x-3">
              {visibleAdmins.map((adm) => (
                <button
                  key={adm._id}
                  onClick={onAdminClick}
                  type="button"
                  title={adm.name}
                  className="w-8 h-8 rounded-full border-2 border-indigo-800 overflow-hidden hover:scale-105 transition"
                >
                  <img
                    src={adm.avatar?.secure_url || "/default-avatar.png"}
                    alt={adm.name}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {remainingAdminsCount > 0 && (
              <button
                onClick={onAdminClick}
                type="button"
                className="text-xs bg-white/10 px-2 py-1 rounded-md border border-white/20 hover:bg-white/20 transition"
              >
                +{remainingAdminsCount}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* 🔹 ACTION SECTION */}
    <div className="bg-white px-6 py-6 lg:py-5 border-t border-slate-200 space-y-3">

      {isMember && (
        <button
          type="button"
          onClick={onNewPost}
          className="w-full px-6 py-3 lg:py-2.5 rounded-lg bg-indigo-800 text-white text-sm font-medium hover:bg-indigo-900 transition duration-200"
        >
          Post to Group
        </button>
      )}

      {isAdmin && (
        <button
          type="button"
          onClick={onReviewPost}
          className="w-full px-6 py-3 lg:py-2.5 rounded-lg bg-gradient-to-b from-indigo-800 to-indigo-700 text-white text-sm font-medium hover:from-indigo-900 hover:to-indigo-800 transition duration-200"
        >
          Review Queued Posts
        </button>
      )}

      {!isMember && (
        <button
          onClick={onJoin}
          type="button"
          className="w-full px-6 py-3 lg:py-2.5 rounded-lg bg-gradient-to-r from-indigo-800 to-indigo-700 text-white text-sm font-semibold hover:from-indigo-900 hover:to-indigo-800 transition duration-200"
        >
          Join Group
        </button>
      )}

      {isMember && !isOnlyAdmin && (
        <button
          onClick={onLeave}
          type="button"
          className="w-full px-6 py-3 lg:py-2.5 rounded-lg border border-red-300 text-red-600 text-sm font-semibold hover:bg-red-50 transition duration-200"
        >
          Leave Group
        </button>
      )}

      {isAdmin && isOnlyAdmin && (
        <div className="w-full px-4 py-3 lg:py-2.5 rounded-lg border border-yellow-200 bg-yellow-50 text-slate-600 text-sm text-center">
          You are the only admin — transfer admin rights before leaving.
        </div>
      )}

      {isAdmin && (
        <div className="pt-4 lg:pt-3 border-t border-slate-200 flex gap-3">
          <button
            onClick={onEdit}
            type="button"
            className="flex-1 px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200 transition"
          >
            Edit
          </button>

          <button
            onClick={onDelete}
            type="button"
            className="flex-1 px-4 py-2 rounded-lg border border-red-300 text-red-600 text-sm font-medium hover:bg-red-50 transition"
          >
            Delete
          </button>
        </div>
      )}
    </div>

  </div>
);














}

