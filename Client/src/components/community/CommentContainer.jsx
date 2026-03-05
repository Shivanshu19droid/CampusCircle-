import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import CommentCard from "./CommentCard";
import { SendHorizontal } from "lucide-react";


import { 
  fetchPaginatedComments, 
  deleteComment, 
  commentOnPost 
} from "../../../Redux/Slices/postSlice";
import ConfirmModal from "../ConfirmModal";

function CommentContainer() {

  const dispatch = useDispatch();
  
  const postId = useSelector((state) => state.post.singlePost?._id);
  const comments = useSelector((state) => state.post.comments);

  const hasMoreComments = useSelector((state) => state.post.hasMoreComments);
  const commentsPage = useSelector((state) => state.post.commentsPage);
  const loadingMoreComments = useSelector((state) => state.post.moreCommentsLoading);

  const [commentContent, setCommentContent] = useState("");
  const [openConfirm, setOpenConfirm] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  const bottomRef = useRef(null);

  const onDelete = (postId, commentId) => {
    dispatch(deleteComment({ postId, commentId }))
      .then(() => {
        dispatch(fetchPaginatedComments({ postId, page: 1 }));
      })
      .finally(() => {
        setOpenConfirm(false);
        setCommentToDelete(null);
      });
  };

  const handleCommentInputChange = (e) => {
    setCommentContent(e.target.value);
  };

  const handlePostComment = (e) => {
    e.preventDefault();
    dispatch(commentOnPost({ postId, content: commentContent }))
      .then(() => {
        dispatch(fetchPaginatedComments({ postId, page: 1 }));
        setCommentContent("");
      });
  };

  // Load initial comments
  useEffect(() => {
    console.log(`Inital comments useEffect triggered, ${postId}`);
    if (postId) {
      dispatch(fetchPaginatedComments({ postId, page: 1 }));
    }
    console.log(postId);
  }, [postId, dispatch]);

  // Infinite scroll observer
  useEffect(() => {
    console.log(`Infinte scroll useEffect triggered, ${postId}`);
    if (!postId) return;
    if (!hasMoreComments) return;

    const observer = new IntersectionObserver((entries) => {
      if (
        entries[0].isIntersecting &&
        hasMoreComments &&
        !loadingMoreComments
      ) {
        dispatch(fetchPaginatedComments({ postId, page: commentsPage + 1 }));
      }
    });

    if (bottomRef.current) observer.observe(bottomRef.current);

    return () => observer.disconnect();
  }, [commentsPage, hasMoreComments, loadingMoreComments, postId]);

return (
  <div
    className="
      mt-6
      bg-white
      rounded-2xl
      border border-slate-200
      shadow-[0_20px_25px_-5px_rgb(0_0_0_/0.1)]
      overflow-hidden
    "
  >

    {/* ===== MOBILE HEADER (Simple) ===== */}
    <div className="px-6 py-4 border-b border-slate-200 lg:hidden">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900">
          Comments
        </h3>

        <span className="text-xs text-slate-500">
          {comments?.length || 0}
        </span>
      </div>
    </div>

    {/* ===== DESKTOP HEADER (Indigo Strip) ===== */}
    <div className="hidden lg:flex bg-gradient-to-r from-indigo-900 to-indigo-800 px-6 py-4 items-center justify-between">
      <h3 className="text-sm font-semibold text-white tracking-wide">
        Comments
      </h3>

      <span className="text-xs text-indigo-200">
        {comments?.length || 0}
      </span>
    </div>


    {/* ===== SCROLLABLE COMMENTS AREA ===== */}
    <div
      className="px-6 py-5 space-y-4 overflow-y-auto"
      style={{ maxHeight: "420px" }}
    >
      {comments?.length > 0 ? (
        comments.map((comment) => (
          <CommentCard
            key={comment._id}
            comment={comment}
            onDelete={() => {
              setOpenConfirm(true);
              setCommentToDelete(comment._id);
            }}
          />
        ))
      ) : (
        <div className="text-center text-slate-400 py-8 text-sm">
          No comments yet.
        </div>
      )}

      <div ref={bottomRef} className="h-6"></div>

      {loadingMoreComments && (
        <p className="text-center text-slate-400 text-sm">
          Loading more comments...
        </p>
      )}
    </div>


    {/* ===== INPUT SECTION ===== */}
    <div className="border-t border-slate-200 px-6 py-4 bg-slate-50">
      <form
        onSubmit={handlePostComment}
        className="flex items-center gap-3"
      >
        <input
          type="text"
          placeholder="Add a comment..."
          value={commentContent}
          onChange={handleCommentInputChange}
          className="
            flex-1
            bg-white
            border border-slate-300
            rounded-lg
            px-4 py-2
            text-sm
            focus:outline-none
            focus:ring-2 focus:ring-indigo-800
          "
        />

        <button
          type="submit"
          className="
            px-4 py-2
            rounded-lg
            bg-indigo-800
            text-white
            text-sm
            hover:bg-indigo-900
          "
        >
          <SendHorizontal size={18} />
        </button>
      </form>
    </div>


    <ConfirmModal
      isOpen={openConfirm}
      message="Are you sure you want to delete this comment ? This action cannot be undone!"
      onConfirm={() => onDelete(postId, commentToDelete)}
      onCancel={() => setOpenConfirm(false)}
    />

  </div>
);

}


export default CommentContainer;