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
    <div className="relative min-h-screen bg-slate-50">

      <div className="max-w-[1400px] mx-auto px-4 lg:px-10 py-6 lg:py-8">

        {/* ===== BACK BUTTON ===== */}
        <button
          onClick={() => navigate(-1)}
          className="
            mb-5 inline-flex items-center gap-2
            text-sm font-medium
            text-slate-600
            hover:text-indigo-800
            hover:bg-white
            px-4 py-2
            rounded-lg
            transition duration-200
          "
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


        {/* ================= MOBILE ================= */}
        <div className="lg:hidden space-y-6">

          {post ? (
            <PostCardFull
              post={post}
              isLiked={isLiked}
              onLike={onLikeClick}
              onDelete={() => setOpenConfirm(true)}
            />
          ) : (
            <p className="text-center text-slate-500 py-10">
              Loading post...
            </p>
          )}

          {post && <CommentContainer />}
        </div>


        {/* ================= DESKTOP ================= */}
        <div className="hidden lg:grid lg:grid-cols-12 lg:gap-14 items-start">

          {/* LEFT — POST (Reduced Width) */}
          <div className="lg:col-span-7 flex justify-center">

            <div className="w-full max-w-[720px]">
              {post ? (
                <PostCardFull
                  post={post}
                  isLiked={isLiked}
                  onLike={onLikeClick}
                  onDelete={() => setOpenConfirm(true)}
                />
              ) : (
                <div className="text-center text-slate-500 py-16">
                  Loading post...
                </div>
              )}
            </div>

          </div>


          {/* RIGHT — COMMENTS (Slightly Larger Now) */}
          <div className="lg:col-span-5">

            {post && (
              <div className="sticky top-20 max-h-[80vh] overflow-hidden">

                {/* Subtle divider */}
                <div className="absolute -left-7 top-0 bottom-0 w-px bg-slate-200 hidden xl:block" />

                <CommentContainer />

              </div>
            )}

          </div>
        </div>


        {/* ===== CONFIRM MODAL ===== */}
        <ConfirmModal
          isOpen={openConfirm}
          message="Are you sure you want to delete this post ? This action cannot be undone!"
          onConfirm={onDeleteConfirm}
          onCancel={() => setOpenConfirm(false)}
        />

      </div>
    </div>
  </HomeLayout>
);

}

export default PostPage;
