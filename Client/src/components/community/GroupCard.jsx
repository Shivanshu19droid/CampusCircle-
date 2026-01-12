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
    className="w-full border rounded-xl p-4 cursor-pointer hover:shadow-md transition bg-white flex flex-col"
  >
    <div className="flex items-start gap-4">
      {/* Group Icon */}
      <img
        src={groupIcon}
        alt={name}
        className="w-14 h-14 rounded-lg object-cover border flex-shrink-0"
      />

      {/* Group Info */}
      <div className="flex-1 min-w-0">
        {/* Name */}
        <h2 className="font-semibold text-lg text-gray-800 truncate">{name}</h2>

        {/* Category */}
        {category && (
          <span className="text-sm text-gray-500 capitalize block mt-1">
            {category}
          </span>
        )}

        {/* Description */}
        {trimmedDescription && (
          <p className="text-sm text-gray-600 mt-2 line-clamp-3">
            {trimmedDescription}
          </p>
        )}

        {/* Members count */}
        <p className="text-xs text-gray-500 mt-2">
          {members.length} member{members.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>

    {/* JOIN / LEAVE BUTTON - aligned to bottom-right of card */}
    <div className="mt-3 flex justify-end">
      {isMember ? (
        <button
          className="px-3 py-1 rounded-lg bg-red-600 text-white text-sm shadow-sm hover:bg-red-700"
          onClick={(e) => {
            e.stopPropagation(); // prevent navigation to the group page
            onLeave(_id);
          }}
          aria-label="Leave group"
          type="button"
        >
          Leave
        </button>
      ) : (
        <button
          className="px-3 py-1 rounded-lg bg-blue-600 text-white text-sm shadow-sm hover:bg-blue-700"
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
