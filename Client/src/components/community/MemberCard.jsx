import { useSelector } from "react-redux";
import { useEffect } from "react"; 

function MemberCard({
  member,
  isUserAdmin,
  onRemove,
  onMakeAdmin,
  onRemoveFromAdmin,
  onProfileClick,
}) {
  const memberName = member?.fullName;
  const memberAvatar = member?.avatar?.secure_url;
  const memberId = member?._id;
  const user = useSelector((state) => state?.auth?.data);

  const currentGroup = useSelector(state => state?.group?.singleGroup);

  //const isMemberAdmin = currentGroup?.admins?.some((admin) => admin?._id === memberId);
  const groupAdmins = useSelector(state => state?.group?.admins);
  const isMemberAdmin = groupAdmins?.some((admin) => admin?._id === memberId);

  useEffect(() => {
    console.log(isUserAdmin);
    console.log(isMemberAdmin);
    console.log(currentGroup);
    console.log(currentGroup?.admins?.length);
  },[isUserAdmin, isMemberAdmin, currentGroup])

 return (
  <div
    className="w-full flex items-center justify-between px-4 py-3 rounded-md cursor-pointer hover:bg-gray-200 transition-colors"
    onClick={() => onProfileClick(memberId)}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onProfileClick(memberId); }}
  >
    {/* Left: avatar + name + admin badge */}
    <div className="flex items-center gap-4 min-w-0">
      <img
        src={memberAvatar || "/images/avatar-placeholder.png"}
        alt={memberName || "Member avatar"}
        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
        onError={(e) => { e.currentTarget.src = "/images/avatar-placeholder.png"; }}
      />

      <div className="flex items-center gap-2 min-w-0">
        <span className="text-sm md:text-base font-medium truncate max-w-xs sm:max-w-sm md:max-w-md">
          {memberName || "Unknown Member"}
        </span>

        {/* Admin badge */}
        {isMemberAdmin && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-800">
            Admin
          </span>
        )}
      </div>
    </div>

    {/* Right: action buttons (only visible when logged-in user is an admin) */}
    <div className="flex items-center gap-2 flex-shrink-0">
      {isUserAdmin ? (
        isMemberAdmin ? (
          <button
            type="button"
            className="text-sm px-2 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white font-medium"
            onClick={(e) => { e.stopPropagation(); onRemoveFromAdmin({memberId}); }}
            aria-label={`Remove ${memberName} from admin`}
          >
            {user?._id === memberId ? `Opt out from admin` : `Remove from admin`}
          </button>
        ) : (
          <>
            <button
              type="button"
              className="text-sm px-2 py-1 rounded-md bg-green-600 hover:bg-green-700 text-white font-medium"
              onClick={(e) => { e.stopPropagation(); onMakeAdmin({memberId}); }}
              aria-label={`Make ${memberName} admin`}
            >
              Make admin
            </button>

            <button
              type="button"
              className="text-sm px-2 py-1 rounded-md bg-gray-700 hover:bg-gray-600 text-white font-medium"
              onClick={(e) => { e.stopPropagation(); onRemove({memberId}); }}
              aria-label={`Remove ${memberName} from group`}
            >
              Remove
            </button>
          </>
        )
      ) : (
        <div className="w-0" />
      )}
    </div>
  </div>
);

}

export default MemberCard;