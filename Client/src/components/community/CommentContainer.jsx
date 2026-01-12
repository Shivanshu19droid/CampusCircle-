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
  <div className="mt-6 flex flex-col h-full">

    {/* COMMENTS LIST (scrollable) */}
    <div className="flex-1 space-y-4 overflow-y-auto pr-2">

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
        <p className="text-center text-gray-500 py-4">No comments yet.</p>
      )}

      {/* Pagination trigger */}
      <div ref={bottomRef} className="h-6"></div>

      {loadingMoreComments && (
        <p className="text-center text-gray-500 pb-3">
          Loading more comments...
        </p>
      )}
    </div>

    {/* ADD COMMENT BOX */}
    <form
      onSubmit={handlePostComment}
      className="flex items-center gap-3 mt-4 border-t pt-4"
    >
      <input
        type="text"
        placeholder="Write a comment..."
        value={commentContent}
        onChange={handleCommentInputChange}
        className="flex-1 border rounded-lg p-2 focus:outline-none"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white p-2 rounded-lg flex items-center justify-center hover:bg-blue-700 transition"
      >
        <SendHorizontal size={20} />
      </button>
    </form>

    <ConfirmModal
       isOpen = {openConfirm}
       message = "Are you sure you want to delete this comment ? This action cannot be undone!"
       onConfirm = {() => onDelete(postId, commentToDelete)}
       onCancel = {() => setOpenConfirm(false)}
      />

  </div>
);


}


export default CommentContainer;