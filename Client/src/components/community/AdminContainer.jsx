import MemberCard from "./MemberCard";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

function AdminContainer({
  isOpen,
  onClose,
  admins = [],
  onLoadMore,
  hasMore,
  loadingMore,
  onProfileClick,
  onRemoveFromAdmin,
  isAdmin,
}) {
  const bottomRef = useRef(null);

  // infinite scroll detector — only active when open
  useEffect(() => {
    if (!isOpen || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore?.();
        }
      },
      { threshold: 1 }
    );

    if (bottomRef.current) observer.observe(bottomRef.current);

    return () => observer.disconnect();
  }, [isOpen, hasMore, onLoadMore]);

  // close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

 return createPortal(
  <div
    role="dialog"
    aria-modal="true"
    className="fixed inset-0 z-50 flex items-center justify-center"
  >
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black/50"
      onClick={onClose}
    />

    {/* Panel */}
    <div className="relative bg-white rounded-lg shadow-xl w-[95%] sm:w-[80%] md:w-[60%] lg:w-[50%] max-h-[80vh] overflow-y-auto p-6 z-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Admins</h3>

        <button
          onClick={onClose}
          aria-label="Close admins panel"
          className="px-3 py-1 rounded-md border text-sm hover:bg-gray-100"
        >
          Close
        </button>
      </div>

      {/* ADMINS LIST — STACKED */}
      <div className="flex flex-col gap-4">
        {admins?.map((admin) => (
          <MemberCard
            key={admin?._id}
            member={admin}
            isAdmin={isAdmin}
            onRemoveFromAdmin={() => onRemoveFromAdmin?.(admin?._id)}
            onProfileClick={() => onProfileClick?.(admin?._id)}
          />
        ))}
      </div>

      {/* LOADING STATE */}
      {loadingMore && (
        <div className="py-4 text-center text-gray-500">
          Loading more admins...
        </div>
      )}

      {/* INFINITE SCROLL TRIGGER */}
      {hasMore && <div ref={bottomRef} className="w-full h-5" />}

      {/* NO MORE ADMINS */}
      {!hasMore && admins?.length > 0 && (
        <p className="text-center text-gray-400 py-4">
          No more admins to load.
        </p>
      )}

      {/* EMPTY STATE */}
      {admins?.length === 0 && !loadingMore && (
        <p className="text-center text-gray-400 py-6">
          No admins found.
        </p>
      )}
    </div>
  </div>,
  document.body
);

}

export default AdminContainer;
