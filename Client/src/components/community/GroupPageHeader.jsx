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
                      className="w-10 h-10 rounded-full ring-2 ring-white overflow-hidden shadow-sm transform hover:scale-105 transition"
                      title={adm.name}
                      aria-label={`Admin ${adm.name}`}
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
                      aria-label={`Show ${remainingAdminsCount} more admins`}
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
            <div className="flex-shrink-0 flex items-center gap-2">
              {isAdmin && (
                <>
                  <button
                    onClick={onEdit}
                    className="px-3 py-2 rounded-md border bg-white text-gray-700 text-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-300"
                    aria-label="Edit group"
                    type="button"
                  >
                    Edit
                  </button>

                  <button
                    onClick={onDelete}
                    className="px-3 py-2 rounded-md border text-red-600 text-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200"
                    aria-label="Delete group"
                    type="button"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Prominent bottom action bar */}
      <div className="mt-5">
        <div className="rounded-lg overflow-hidden ring-1 ring-gray-100 bg-white shadow-sm">
          <div className="p-4 md:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="text-sm text-gray-600">
                {isMember ? (
                  <span className="font-medium">You're a member</span>
                ) : (
                  <span className="font-medium">Not a member yet</span>
                )}{" "}
                <span className="hidden md:inline">— join the conversation to access posts, resources, and events.</span>
              </div>
            </div>

            <div className="w-full md:w-auto">
              {!isMember && (
                <button
                  onClick={onJoin}
                  className="w-full md:w-56 flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:scale-[1.01] transform transition"
                  aria-pressed="false"
                  aria-label="Join group"
                  type="button"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Join Group
                </button>
              )}

              {isMember && !isOnlyAdmin && (
                <button
                  onClick={onLeave}
                  className="w-full md:w-56 flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold rounded-md bg-white border border-red-300 text-red-600 hover:bg-red-50 shadow-sm transition"
                  aria-pressed="false"
                  aria-label="Leave group"
                  type="button"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                    <path fillRule="evenodd" d="M6.707 4.293a1 1 0 00-1.414 1.414L8.586 9H3a1 1 0 100 2h5.586l-3.293 3.293a1 1 0 101.414 1.414L12.414 12l-5.707-7.707z" clipRule="evenodd" />
                  </svg>
                  Leave Group
                </button>
              )}

              {isMember && isOnlyAdmin && (
                <div className="w-full md:w-56 text-center text-sm text-gray-500 px-4 py-2 rounded-md border border-yellow-100 bg-yellow-50">
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

