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
    className="
      w-full
      bg-white
      rounded-2xl
      border border-slate-200
      shadow-sm
      hover:shadow-md
      transition-all duration-200
      cursor-pointer
      overflow-hidden
      flex flex-col
    "
  >
    {/* ===== IMAGE SECTION ===== */}
    <div className="w-full h-40 sm:h-44 md:h-48 overflow-hidden">
      <img
        src={groupIcon}
        alt={name}
        className="
          w-full h-full
          object-cover
          transition-transform duration-300
          hover:scale-105
        "
      />
    </div>

    {/* ===== CONTENT SECTION ===== */}
    <div className="p-4 sm:p-5 flex flex-col flex-1">

      {/* Name */}
      <h2 className="font-semibold text-base sm:text-lg text-slate-900 truncate">
        {name}
      </h2>

      {/* Category */}
      {category && (
        <span className="text-xs sm:text-sm text-indigo-700 capitalize mt-1 font-medium">
          {category}
        </span>
      )}

      {/* Description */}
      {trimmedDescription && (
        <p className="text-sm text-slate-600 mt-3 line-clamp-3 leading-relaxed flex-1">
          {trimmedDescription}
        </p>
      )}

      {/* Members + Button Row */}
      <div className="mt-5 flex items-center justify-between">

        <p className="text-xs text-slate-500">
          {members.length} member{members.length !== 1 ? "s" : ""}
        </p>

        {isMember ? (
          <button
            className="
              px-5 py-2.5
              rounded-lg
              bg-rose-600
              text-white
              text-sm font-semibold
              shadow-sm
              hover:bg-rose-700
              hover:shadow-md
              active:scale-95
              transition-all duration-200
            "
            onClick={(e) => {
              e.stopPropagation();
              onLeave(_id);
            }}
            type="button"
          >
            Leave
          </button>
        ) : (
          <button
            className="
              px-5 py-2.5
              rounded-lg
              bg-indigo-900
              text-white
              text-sm font-semibold
              shadow-sm
              hover:bg-indigo-800
              hover:shadow-md
              active:scale-95
              transition-all duration-200
            "
            onClick={(e) => {
              e.stopPropagation();
              onJoin(_id);
            }}
            type="button"
          >
            Join
          </button>
        )}

      </div>
    </div>
  </div>
);





}

export default GroupCard;
