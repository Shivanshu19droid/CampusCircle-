import GroupCard from "./GroupCard";
import { useMemo } from "react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function GroupContainer({
  user,
  groups,
  onJoin,
  onLeave,
  onLoadMore,
  hasMore,
  loadingMore,
}) {
  const navigate = useNavigate();
  const bottomRef = useRef(null);

  const navigateToGroup = (groupId) => {
    navigate(`/community/groups/${groupId}`);
  };

  //separating joined groups and non-joined groups
  const {joinedGroups, otherGroups} = useMemo(() => {
    const joined = groups.filter((g) => g.members.includes(user._id));
    const others = groups.filter((g) => !g.members.includes(user._id));

    return {joinedGroups: joined, otherGroups: others}
  });

  // infinite scroll detector
  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      { threshold: 1 }
    );

    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore]);

  return (
  <div className="space-y-10 w-full">

    {/* Joined Groups */}
    {joinedGroups.length > 0 && (
      <section>
        <h2 className="text-lg font-semibold mb-4 text-slate-900">
          Your Groups
        </h2>

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-6
          "
        >
          {joinedGroups.map((group) => (
            <GroupCard
              key={group._id}
              group={group}
              isMember={true}
              onJoin={onJoin}
              onLeave={onLeave}
              navigateToGroup={navigateToGroup}
            />
          ))}
        </div>
      </section>
    )}

    {/* Explore Groups */}
    <section>
      <h2 className="text-lg font-semibold mb-4 text-slate-900">
        Explore Groups
      </h2>

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-6
        "
      >
        {otherGroups.map((group) => (
          <GroupCard
            key={group._id}
            group={group}
            isMember={false}
            onJoin={onJoin}
            onLeave={onLeave}
            navigateToGroup={navigateToGroup}
          />
        ))}
      </div>
    </section>

    {/* Infinite scroll sentinel */}
    <div ref={bottomRef} className="h-10"></div>

    {/* Loading indicator */}
    {loadingMore && (
      <p className="text-center text-slate-500 py-4">
        Loading more groups...
      </p>
    )}

  </div>
);


}

export default GroupContainer;
