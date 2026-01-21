import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  deletePost,
  fetchSinglePost,
  likeUnlikePost,
} from "../../../Redux/Slices/postSlice";
import PostCardFull from "../../components/community/PostCardFull";
import CommentContainer from "../../components/community/CommentContainer";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../../components/ConfirmModal";
import { useState } from "react";
import HomeLayout from "../../layouts/HomeLayouts";

function PostPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [openConfirm, setOpenConfirm] = useState(false);

  //const post = useSelector((state) => state?.post?.singlePost);
  const {postId} = useParams(); 
  const post = useSelector((state) => state?.post?.singlePost);

  const userId = useSelector((state) => state?.auth?.data?._id);

  const isLiked = post?.likes?.includes(userId);

  const onLikeClick = (postId) => {
    dispatch(likeUnlikePost(postId));
  };

  // const onDelete = () => {
  //   setOpenConfirm(true);
  // };

  const onDeleteConfirm = () => {
    dispatch(deletePost(postId))
    .finally(() => {
      setOpenConfirm(false);
      navigate("/community");
    })
  }

  useEffect(() => {
    if(!postId) return;
    dispatch(fetchSinglePost({ postId }));
  }, [postId, dispatch]);

  return (
  <HomeLayout>
    <div className="max-w-3xl mx-auto px-4 py-6">
    
    {/* Back Button */}
    <button
      onClick={() => navigate(-1)}
      className="mb-4 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 px-3 py-2 rounded-lg transition"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-4 h-4"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      Back
    </button>

    {/* Post Section */}
    {post ? (
      <PostCardFull
        post={post}
        isLiked={isLiked}
        onLike={onLikeClick}
        onDelete={() => setOpenConfirm(true)}
      />
    ) : (
      <p className="text-center text-gray-500 py-10">Loading post...</p>
    )}

    {/* Comments Section */}
    <div className="mt-8">
      {post && <CommentContainer />}
    </div>

    <ConfirmModal
      isOpen={openConfirm}
      message="Are you sure you want to delete this post ? This action cannot be undone!"
      onConfirm={onDeleteConfirm}
      onCancel={() => setOpenConfirm(false)}
    />
  </div>
  </HomeLayout>
);


}

export default PostPage;
