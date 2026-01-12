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
  <div className="w-full flex flex-col gap-4">
    {/* MEMBERS LIST - stacked vertically */}
    <div className="w-full flex flex-col gap-2">
      {members?.map((member) => (
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

    {/* LOADING INDICATOR */}
    {loadingMore && (
      <div className="py-4 text-center text-gray-500">
        Loading more members...
      </div>
    )}

    {/* INFINITE SCROLL TRIGGER */}
    {hasMore && <div ref={bottomRef} className="w-full h-5" />}

    {/* NO MORE DATA */}
    {!hasMore && members?.length > 0 && (
      <p className="text-center text-gray-400 py-4">
        No more members to load.
      </p>
    )}

    {/* EMPTY STATE */}
    {members?.length === 0 && !loadingMore && (
      <p className="text-center text-gray-400 py-6">No members found.</p>
    )}
  </div>
);

}

export default MemberContainer;
