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
      className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm 
                 transition-opacity duration-200 ease-in-out"
      onClick={onClose}
    />

    {/* Modal Panel */}
    <div
      className="
        relative z-10
        w-[95%] sm:w-[85%] md:w-[65%] lg:w-[48%]
        max-h-[85vh]
        rounded-2xl
        overflow-hidden
        bg-white
        shadow-[0_25px_50px_-12px_rgb(0_0_0_/0.25)]
        flex flex-col
        animate-[fadeInUp_200ms_ease-in-out]
      "
    >

      {/* Indigo Accent Bar */}
      <div className="h-1.5 bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-700" />

      {/* Header */}
      <div className="px-6 py-6 border-b border-slate-200 bg-white">

        <div className="flex items-start justify-between">

          <div>
            <h3 className="text-xl font-semibold text-slate-900">
              Group Admins
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              {admins?.length ?? 0} admin
              {(admins?.length ?? 0) !== 1 ? "s" : ""}
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close admins panel"
            className="
              px-4 py-2 rounded-lg text-sm font-medium
              border border-slate-200 text-slate-600
              hover:bg-slate-100
              transition duration-200
            "
          >
            Close
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 bg-slate-50/50 space-y-4">

        {admins?.map((admin) => (
          <div
            key={admin?._id}
            className="
              bg-white rounded-xl border border-slate-200
              shadow-sm hover:shadow-md
              hover:-translate-y-[1px]
              transition-all duration-200
            "
          >
            <MemberCard
              member={admin}
              isAdmin={isAdmin}
              onRemoveFromAdmin={() =>
                onRemoveFromAdmin?.(admin?._id)
              }
              onProfileClick={() =>
                onProfileClick?.(admin?._id)
              }
            />
          </div>
        ))}

        {loadingMore && (
          <div className="py-4 text-center text-sm text-slate-500">
            Loading more admins...
          </div>
        )}

        {hasMore && <div ref={bottomRef} className="w-full h-6" />}

        {!hasMore && admins?.length > 0 && (
          <p className="text-center text-sm text-slate-400 py-4">
            No more admins to load.
          </p>
        )}

        {admins?.length === 0 && !loadingMore && (
          <div className="text-center py-12">
            <p className="text-base font-medium text-slate-700 mb-1">
              No admins found
            </p>
            <p className="text-sm text-slate-500">
              Admins will appear here once assigned.
            </p>
          </div>
        )}
      </div>

    </div>
  </div>,
  document.body
);

}

export default AdminContainer;
