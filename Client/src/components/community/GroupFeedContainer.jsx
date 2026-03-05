import PostCard from "./PostCard";
import { useRef } from "react";
import { useEffect } from "react";

function GroupFeedContainer({
  posts,
  onLike,
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
  <div className="space-y-8">

    {/* Section Header */}
    {/* <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold text-slate-900">
          Group Posts
        </h2>

        <span className="text-sm text-slate-500">
          {posts?.length ?? 0} post
          {(posts?.length ?? 0) > 1 ? "s" : ""}
        </span>
      </div>
    </div> */}

    {/* Posts List */}
    <div className="space-y-6">

      {posts && posts.length > 0 ? (
        posts.map((post) => (
          <article
            key={post._id}
            onClick={() => onPostClick && onPostClick(post._id)}
            className="bg-white border border-slate-200 rounded-2xl p-5 
                       shadow-[0_1px_3px_0_rgb(0_0_0_/0.08)] 
                       hover:shadow-[0_20px_25px_-5px_rgb(0_0_0_/0.1)] 
                       hover:-translate-y-[2px] 
                       transition-all duration-200 ease-in-out cursor-pointer"
          >
            <PostCard
              post={post}
              onLike={() => onLike && onLike(post._id)}
              navigateToPost={(id) => onPostClick && onPostClick(id)}
              navigateToComments={(id) => onPostClick && onPostClick(id)}
            />
          </article>
        ))
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center shadow-sm">
          <p className="text-base font-medium text-slate-700 mb-2">
            No posts yet
          </p>
          <p className="text-sm text-slate-500">
            Be the first to share something useful with the group.
          </p>
        </div>
      )}

    </div>

    {/* Infinite-scroll sentinel */}
    <div ref={bottomRef} className="w-full h-6" />

    {/* Loading / End States */}
    {loadingMore && (
      <p className="text-center py-6 text-sm text-slate-500">
        Loading more posts…
      </p>
    )}

    {!hasMore && posts?.length > 0 && (
      <p className="text-center py-6 text-sm text-slate-400">
        No more posts to show.
      </p>
    )}
  </div>
);

}

export default GroupFeedContainer;
