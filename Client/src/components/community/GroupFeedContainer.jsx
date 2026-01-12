import PostCard from "./PostCard";
import { useRef } from "react";
import { useEffect } from "react";

function GroupFeedContainer({
  posts,
  onLike,
  onDelete,
  onLoadMore,
  hasMore,
  loadingMore,
  onPostClick,
}) {
  const bottomRef = useRef(null);

  // setting up for infinite scroll
  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        onLoadMore();
      }
      {
        threshold: 1;
      }
    });

    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/5 rounded-lg shadow-sm">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold">Group Posts</h2>
          <span className="text-sm text-gray-400">
            {posts?.length ?? 0} post{(posts?.length ?? 0) > 1 ? "s" : ""}
          </span>
        </div>
        {/* removed the "Share something useful" / post button as requested */}
      </div>

      {/* Posts list */}
      <div className="space-y-4">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <article
              key={post._id}
              className="bg-white/3 p-4 rounded-xl hover:shadow-lg transition-shadow duration-150 cursor-pointer"
              /* removed article-level navigation; PostCard will handle on-click via navigate props */
            >
              {/* PostCard (presentational) - pass navigation through onPostClick */}
              <PostCard
                post={post}
                onLike={() => onLike && onLike(post._id)}
                navigateToPost={(id) => onPostClick && onPostClick(id)} // main-card click
                navigateToComments={(id) => onPostClick && onPostClick(id)} // comment click -> reuse onPostClick
              />

              {/* Actions row */}
              <div className="mt-3 flex items-center justify-between text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  {/* Keep a lightweight like control that won't navigate (duplicates PostCard's like but keeps list actions) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onLike && onLike(post._id);
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-900/60 hover:bg-gray-900/75 transition"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                    <span>
                      {post?.likes?.length ?? 0} Like
                      {(post?.likes?.length ?? 0) > 1 ? "s" : ""}
                    </span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {/* Optional delete button (visible when parent supplies onDelete) */}
                  {onDelete && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(post._id);
                      }}
                      className="px-3 py-1 rounded-md text-red-400 hover:bg-red-600/10 transition"
                      aria-label="Delete post"
                    >
                      Delete
                    </button>
                  )}

                  <div className="text-xs text-gray-500">
                    {new Date(post?.createdAt).toLocaleString?.() ?? ""}
                  </div>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="p-8 text-center text-gray-400">
            <p className="mb-2 font-medium">No posts yet</p>
            <p className="text-sm">
              Be the first to share something useful with the group.
            </p>
          </div>
        )}
      </div>

      {/* Infinite-scroll sentinel */}
      <div ref={bottomRef} className="w-full h-6" />

      {/* Loading / end states */}
      {loadingMore && (
        <p className="text-center py-4 text-gray-400">Loading more posts…</p>
      )}

      {!hasMore && posts?.length > 0 && (
        <p className="text-center py-4 text-gray-400">No more posts to show.</p>
      )}
    </div>
  );
}

export default GroupFeedContainer;
