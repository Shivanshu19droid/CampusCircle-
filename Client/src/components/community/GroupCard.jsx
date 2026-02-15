import { useMemo } from "react";

function GroupCard({group, isMember, onJoin, onLeave, navigateToGroup}) {

    const {
        _id,
        name,
        description,
        category,
        members = [],
        icon
    } = group;

    const groupIcon = icon?.secure_url || "/images/default-group-icon.png";

    //trim desctiption to 80 characters
    const trimmedDescription = useMemo( () => {
        if(!description) return "";
        const limit = 80;
        return description.length > limit? description.slice(0, limit) + "..." : description;
    }, [description]);

    return (
  <div
    onClick={() => navigateToGroup(_id)}
    className="w-full bg-white rounded-[24px] p-4 sm:p-5 cursor-pointer shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:scale-[1.01] transition-transform duration-200 flex flex-col"
  >
    <div className="flex items-start gap-3 sm:gap-4">
      
      {/* Group Icon */}
      <img
        src={groupIcon}
        alt={name}
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover flex-shrink-0"
      />

      {/* Group Info */}
      <div className="flex-1 min-w-0">
        
        {/* Name */}
        <h2 className="font-semibold text-base sm:text-lg text-gray-800 truncate">
          {name}
        </h2>

        {/* Category */}
        {category && (
          <span className="text-xs sm:text-sm text-[#064E3B] capitalize block mt-1 font-medium">
            {category}
          </span>
        )}

        {/* Description */}
        {trimmedDescription && (
          <p className="text-sm text-gray-600 mt-2 line-clamp-3 leading-relaxed">
            {trimmedDescription}
          </p>
        )}

        {/* Members count */}
        <p className="text-xs text-gray-500 mt-3">
          {members.length} member{members.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>

    {/* JOIN / LEAVE BUTTON */}
    <div className="mt-4 flex sm:justify-end">
      {isMember ? (
        <button
          className="w-full sm:w-auto px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onLeave(_id);
          }}
          aria-label="Leave group"
          type="button"
        >
          Leave
        </button>
      ) : (
        <button
          className="w-full sm:w-auto px-4 py-2 rounded-full bg-[#FF6B35] text-white text-sm font-medium hover:opacity-90 transition-all"
          onClick={(e) => {
            e.stopPropagation();
            onJoin(_id);
          }}
          aria-label="Join group"
          type="button"
        >
          Join
        </button>
      )}
    </div>
  </div>
);





}

export default GroupCard;
