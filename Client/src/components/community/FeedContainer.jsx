import PostCard from "./PostCard";
import { useEffect, useRef } from "react";
import {useNavigate} from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchSinglePost } from "../../../Redux/Slices/postSlice";

function FeedContainer({ posts, onLike, onLoadMore, hasMore, loadingMore }) {
  const navigate = useNavigate();
  const bottomRef = useRef(null);

  const navigateToPost = (postId) => {
    //dispatch(fetchSinglePost({postId}));
    navigate(`/community/posts/${postId}`);
  };

  const navigateToComments = (postId) => {
    navigate(`/community/posts/${postId}`);
  };

  //infinite scroll detector
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
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post._id}>
          <PostCard
            post={post}
            onLike={onLike}
            navigateToPost={navigateToPost}
            navigateToComments={navigateToComments}
          />
        </div>
      ))}

      {/* Infinite scroll sentinel */}
      <div ref={bottomRef} className="h-10"></div>

      {/* Loading more indicator */}
      {loadingMore && (
        <p className="text-center py-4 text-gray-500">Loading more posts...</p>
      )}
    </div>
  );
}


export default FeedContainer;