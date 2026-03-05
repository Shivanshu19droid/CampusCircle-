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
    className="w-full flex items-center justify-between px-6 py-4 
               bg-white border-b border-slate-200 
               hover:bg-indigo-50/40 transition-all duration-200 cursor-pointer"
    onClick={() => onProfileClick(memberId)}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onProfileClick(memberId); }}
  >
    {/* LEFT: Avatar + Name + Admin Badge */}
    <div className="flex items-center gap-4 min-w-0">
      <img
        src={memberAvatar || "/images/avatar-placeholder.png"}
        alt={memberName || "Member avatar"}
        className="w-12 h-12 rounded-full object-cover flex-shrink-0 ring-2 ring-slate-100"
        onError={(e) => { e.currentTarget.src = "/images/avatar-placeholder.png"; }}
      />

      <div className="flex items-center gap-3 min-w-0">
        <span className="text-base font-medium text-slate-900 truncate max-w-xs sm:max-w-sm md:max-w-md">
          {memberName || "Unknown Member"}
        </span>

        {/* ✅ Green Admin Badge */}
        {isMemberAdmin && (
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full 
                           bg-emerald-100 text-emerald-700 border border-emerald-200">
            ADMIN
          </span>
        )}
      </div>
    </div>

    {/* RIGHT: Action Buttons */}
    <div className="flex items-center gap-3 flex-shrink-0">
      {isUserAdmin ? (
        isMemberAdmin ? (
          <button
            type="button"
            className="text-sm px-4 py-2 rounded-lg 
                       border border-red-200 text-red-600 
                       hover:bg-red-50 transition duration-200 font-medium"
            onClick={(e) => { e.stopPropagation(); onRemoveFromAdmin({memberId}); }}
            aria-label={`Remove ${memberName} from admin`}
          >
            {user?._id === memberId ? `Opt out from admin` : `Remove from admin`}
          </button>
        ) : (
          <>
            <button
              type="button"
              className="text-sm px-4 py-2 rounded-lg 
                         bg-gradient-to-b from-indigo-800 to-indigo-700 
                         text-white font-medium 
                         hover:from-indigo-900 hover:to-indigo-800 
                         transition duration-200 shadow-sm"
              onClick={(e) => { e.stopPropagation(); onMakeAdmin({memberId}); }}
              aria-label={`Make ${memberName} admin`}
            >
              Make Admin
            </button>

            <button
              type="button"
              className="text-sm px-4 py-2 rounded-lg 
                         border border-slate-300 text-slate-600 
                         hover:bg-slate-100 transition duration-200 font-medium"
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