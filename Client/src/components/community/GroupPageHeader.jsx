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
  <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg overflow-hidden">
    <div className="px-6 md:px-8 py-6">
      <div className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row gap-6 items-start">
        {/* LEFT: Group icon + badges */}
        <div className="flex-shrink-0">
          <div className="w-28 h-28 rounded-lg overflow-hidden ring-2 ring-gray-100 shadow-inner">
            <img
              src={groupIconUrl || "/group-default.png"}
              alt={groupName}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="mt-3 flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
              {groupCategory || "General"}
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
              {groupMembersCount} members
            </span>
          </div>
        </div>

        {/* MIDDLE: Title, description, admins */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 truncate">
                {groupName}
              </h1>

              <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                {groupDescription ||
                  "No description yet — add a short intro to tell members what this group is about."}
              </p>

              {/* Admin preview */}
              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center -space-x-3">
                  {visibleAdmins.map((adm) => (
                    <button
                      key={adm._id}
                      onClick={onAdminClick}
                      className="w-10 h-10 rounded-full ring-2 ring-white overflow-hidden shadow-sm hover:scale-105 transition"
                      title={adm.name}
                      type="button"
                    >
                      <img
                        src={adm.avatar?.secure_url || "/default-avatar.png"}
                        alt={adm.name}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}

                  {remainingAdminsCount > 0 && (
                    <button
                      onClick={onAdminClick}
                      className="ml-2 text-sm px-2 py-1 rounded-md border bg-gray-100 hover:bg-gray-200"
                      type="button"
                    >
                      +{remainingAdminsCount}
                    </button>
                  )}
                </div>

                <div className="text-sm text-gray-500">
                  Admin{admins.length > 1 ? "s" : ""}
                </div>
              </div>
            </div>

            {/* Admin-only small actions */}
            {isAdmin && (
              <div className="flex gap-2">
                <button
                  onClick={onEdit}
                  className="px-3 py-2 rounded-md border bg-white text-gray-700 text-sm hover:shadow"
                  type="button"
                >
                  Edit
                </button>

                <button
                  onClick={onDelete}
                  className="px-3 py-2 rounded-md border text-red-600 text-sm hover:bg-red-50"
                  type="button"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom action bar */}
      <div className="mt-5">
        <div className="rounded-lg overflow-hidden ring-1 ring-gray-100 bg-white shadow-sm">
          <div className="p-4 md:p-5 flex flex-col md:flex-row items-center justify-between gap-4">

            {/* ✅ REPLACED TEXT WITH ACTION BUTTONS */}
            <div className="flex-1 flex flex-col md:flex-row gap-3">
              {isMember && (
                <button
                  className="px-5 py-3 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
                  type="button"
                  onClick={onNewPost}
                >
                  Post to Group
                </button>
              )}

              {isAdmin && (
                <button
                  className="px-5 py-3 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition"
                  type="button"
                  onClick={onReviewPost}
                >
                  Review Queued Posts
                </button>
              )}
            </div>

            {/* Join / Leave */}
            <div className="w-full md:w-auto">
              {!isMember && (
                <button
                  onClick={onJoin}
                  className="w-full md:w-56 px-5 py-3 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold"
                  type="button"
                >
                  Join Group
                </button>
              )}

              {isMember && !isOnlyAdmin && (
                <button
                  onClick={onLeave}
                  className="w-full md:w-56 px-5 py-3 rounded-md border border-red-300 text-red-600 text-sm font-semibold hover:bg-red-50"
                  type="button"
                >
                  Leave Group
                </button>
              )}

              {isMember && isOnlyAdmin && (
                <div className="w-full md:w-56 px-4 py-2 rounded-md border border-yellow-100 bg-yellow-50 text-gray-500 text-sm text-center">
                  You are the only admin — transfer admin rights before leaving.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);














}

