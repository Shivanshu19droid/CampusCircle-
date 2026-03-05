import { useDispatch, useSelector } from "react-redux";
import QueuedPostCard from "../../components/community/QueuedPostCard";
import { useEffect, useRef } from "react";
import ConfirmModal from "../../components/ConfirmModal";
import { useState } from "react";
import {
  fetchPaginatedQueuedPosts,
  approveQueuedPost,
  rejectQueuedPost,
} from "../../../Redux/Slices/QueuedPostSlice";
import HomeLayout from "../../layouts/HomeLayouts";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function QueuedPostPage() {
  const dispatch = useDispatch();

  const group = useSelector((state) => state?.queuedPosts?.groupDetails);

  const groupName = group?.name;
  const groupIcon = group?.icon?.secure_url;
  
  const {groupId} = useParams();

  const queuedPosts = useSelector((state) => state?.queuedPosts?.queuedPosts);
  const isLoading = useSelector((state) => state?.queuedPosts?.isLoading);
  const hasMoreQueuedPosts = useSelector(
    (state) => state?.queuedPosts?.hasMoreQueuedPosts
  );
  const queuedPostsCount = useSelector(
    (state) => state?.queuedPosts?.queuedPostsCount
  );
  const queuedPostsPage = useSelector(
    (state) => state?.queuedPosts?.queuedPostsPage
  );

  const effectRan = useRef(false);

  useEffect(() => {
    if(effectRan.current === true) return;
    if (!groupId) return;
    dispatch(fetchPaginatedQueuedPosts({ groupId, page: 1 }));
    effectRan.current = true;
  }, [dispatch]);

  //infinite scroll detector

  const onLoadMore = () => {
    if (hasMoreQueuedPosts && !isLoading) {
      dispatch(
        fetchPaginatedQueuedPosts({ groupId, page: queuedPostsPage + 1 })
      );
    }
  };

  const bottomRef = useRef(null);

  useEffect(() => {
    if (!hasMoreQueuedPosts) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          onLoadMore();
        }
      },
      { threshold: 1 }
    );

    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }

    return () => observer.disconnect();
  }, [hasMoreQueuedPosts, isLoading, dispatch, groupId, queuedPostsPage]);

  const onApprove = (postId) => {
    dispatch(approveQueuedPost({ postId }));
  };

  const onReject = (postId) => {
    dispatch(rejectQueuedPost({ postId }));
  };

  // setting up the confirm handler

  //first we define the initial state
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: "",
    message: "",
    payload: null,
  });

  //then we define the functions onOpenConfirm and onCloseConfirm
  const openConfirm = ({
    type,
    payload = null,
    title = "Please confirm",
    message = "Are you sure you want to perform this action?",
  }) => {
    setConfirmState({ isOpen: true, type, payload, title, message });
  };

  const closeConfirm = () => {
    setConfirmState((s) => ({ ...s, isOpen: false }));
  };

  // defining the confirm-handler to handle multiple function calls
  const getConfirmHandler = () => {
    const { type, payload } = confirmState;

    switch (type) {
      case "approve-post":
        return () => {
          onApprove(payload.postId);
        };

      case "reject-post":
        return () => {
          onReject(payload.postId);
        };

      default:
        () => {};
    }
  };

  const navigate = useNavigate();

  return (
  <HomeLayout>
    <div className="max-w-5xl mx-auto px-6 py-10">

      {/* ================= BACK BUTTON ================= */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="
            inline-flex items-center gap-2
            px-4 py-2
            rounded-lg
            border border-slate-300
            bg-slate-100
            text-slate-700
            text-sm font-medium
            hover:bg-slate-200
            hover:border-slate-400
            transition duration-200
            shadow-sm
          "
        >
          <span className="text-base leading-none">←</span>
          Back
        </button>
      </div>

      {/* ================= PAGE HEADER ================= */}
      <div className="mb-10">

        <div className="flex items-center gap-4">

          {groupIcon && (
            <img
              src={groupIcon}
              alt={groupName}
              className="w-12 h-12 rounded-full object-cover shadow-sm"
            />
          )}

          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Queued Posts
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Review and manage posts queued for approval.
            </p>
          </div>

        </div>

        <div className="mt-6 border-b border-slate-200" />
      </div>

      {/* ================= QUEUED POSTS ================= */}
      <div className="space-y-6">
        {queuedPosts?.length > 0 ? (
          queuedPosts.map((post) => (
            <QueuedPostCard
              key={post._id}
              queuedPost={post}
              onAccept={() =>
                openConfirm({
                  type: "approve-post",
                  payload: { postId: post._id },
                  title: "Approve post",
                  message: "Are you sure you want to approve this post?",
                })
              }
              onReject={() =>
                openConfirm({
                  type: "reject-post",
                  payload: { postId: post._id },
                  title: "Reject post",
                  message: "Are you sure you want to reject this post?",
                })
              }
            />
          ))
        ) : !isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">

            <div className="mb-5 flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-emerald-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h2 className="text-xl font-semibold text-slate-900">
              All queued posts reviewed 🎉
            </h2>

            <p className="mt-2 text-sm text-slate-500 max-w-md">
              You’re all caught up. New posts will appear here when they need review.
            </p>
          </div>
        ) : null}
      </div>

      {isLoading && (
        <div className="text-center text-slate-500 py-8">
          Loading more posts...
        </div>
      )}

      <div ref={bottomRef} className="h-1" />

      <ConfirmModal
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        onCancel={closeConfirm}
        onConfirm={async () => {
          try {
            const handler = getConfirmHandler();
            if (typeof handler === "function") {
              const result = handler();
              if (result && typeof result.then === "function") {
                await result;
              }
            }
          } catch (err) {
            console.error("Confirm action failed:", err);
          } finally {
            closeConfirm();
          }
        }}
      />
    </div>
  </HomeLayout>
);

}

export default QueuedPostPage;
