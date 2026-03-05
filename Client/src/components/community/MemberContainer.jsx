import MemberCard from "./MemberCard";
import { useRef } from "react";
import { useEffect } from "react";

function MemberContainer({
  members,
  isAdmin,
  onRemove,
  onMakeAdmin,
  onRemoveFromAdmin,
  onProfileClick,
  onLoadMore,
  hasMore,
  loadingMore,
}) {
  const bottomRef = useRef(null);

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
  }, [hasMore, onLoadMore]);

  return (
  <div className="w-full flex flex-col gap-6">

    {/* MEMBERS CARD CONTAINER */}
    <div className="w-full bg-white rounded-2xl 
                    border border-slate-200 
                    shadow-[0_1px_3px_0_rgb(0_0_0_/0.08)] 
                    overflow-hidden">

      {/* MEMBERS LIST - stacked cleanly */}
      <div className="w-full flex flex-col">

        {members?.map((member, index) => (
          <MemberCard
            key={member?._id}
            member={member}
            isUserAdmin={isAdmin}
            onRemove={onRemove}
            onMakeAdmin={onMakeAdmin}
            onRemoveFromAdmin={onRemoveFromAdmin}
            onProfileClick={() => onProfileClick(member?._id)}
          />
        ))}

      </div>
    </div>

    {/* LOADING INDICATOR */}
    {loadingMore && (
      <div className="py-4 text-center text-sm text-slate-500">
        Loading more members...
      </div>
    )}

    {/* INFINITE SCROLL TRIGGER */}
    {hasMore && <div ref={bottomRef} className="w-full h-6" />}

    {/* NO MORE DATA */}
    {!hasMore && members?.length > 0 && (
      <p className="text-center text-sm text-slate-400 py-4">
        No more members to load.
      </p>
    )}

    {/* EMPTY STATE */}
    {members?.length === 0 && !loadingMore && (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
        <p className="text-base font-medium text-slate-700 mb-1">
          No members found
        </p>
        <p className="text-sm text-slate-500">
          Members will appear here once they join the group.
        </p>
      </div>
    )}

  </div>
);

}

export default MemberContainer;
