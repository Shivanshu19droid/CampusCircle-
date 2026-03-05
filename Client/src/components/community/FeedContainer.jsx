import PostCard from "./PostCard";
import { useEffect, useRef } from "react";
import {useNavigate} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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

  const userId = useSelector((state) => state?.auth?.data?.id);

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
  <div className="flex flex-col gap-6 px-4 sm:px-0">
    
    {posts.map((post) => (
      <div
        key={post._id}
        className="hover:scale-[1.01] transition-transform duration-200"
      >
        <PostCard
          post={post}
          onLike={onLike}
          navigateToPost={navigateToPost}
          navigateToComments={navigateToComments}
          user_id={userId}
        />
      </div>
    ))}

    {/* Infinite scroll sentinel */}
    <div ref={bottomRef} className="h-10"></div>

    {/* Loading more indicator */}
    {loadingMore && (
      <div className="text-center py-6">
        <p className="text-sm text-gray-500 animate-pulse">
          Loading more posts...
        </p>
      </div>
    )}

  </div>
);

}


export default FeedContainer;