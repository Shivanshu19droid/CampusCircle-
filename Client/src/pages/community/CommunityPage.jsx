import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import FeedContainer from "../../components/community/FeedContainer";
import GroupContainer from "../../components/community/GroupContainer";
import {
  joinGroup,
  leaveGroup,
  getAllGroups,
} from "../../../Redux/Slices/GroupSlice";
import { likeUnlikePost, fetchAllPosts } from "../../../Redux/Slices/postSlice";
import { useNavigate } from "react-router-dom";
import HomeLayout from "../../layouts/HomeLayouts";
import { useRef } from "react";
import ConfirmModal from "../../components/ConfirmModal";

function CommunityPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.data);

  //local UI state
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("cc_feed_tab") || "posts";
  });

  useEffect(() => {
    localStorage.setItem("cc_feed_tab", activeTab);
  }, [activeTab]);

  //useState for leave group confirmation modal
  const [openConfirm, setOpenConfirm] = useState(false);
  const [groupToLeave, setGroupToLeave] = useState(null);

  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current === false) {
      dispatch(fetchAllPosts({ page: 1 }));
      dispatch(getAllGroups({ page: 1 }));
      effectRan.current = true;
    }
  }, [dispatch]);

  // POSTS from redux
  const posts = useSelector((state) => state?.post?.posts);
  const postsPage = useSelector((state) => state?.post?.page);
  const hasMorePosts = useSelector((state) => state?.post?.hasMorePosts);
  const loadingMorePosts = useSelector(
    (state) => state?.post?.loadingMorePosts,
  );

  //GROUPS from redux
  const groups = useSelector((state) => state?.group?.groups);
  const groupsPage = useSelector((state) => state?.group?.page);
  const hasMoreGroups = useSelector((state) => state?.group?.hasMoreGroups);
  const loadingMoreGroups = useSelector(
    (state) => state?.group?.loadingMoreGroups,
  );

  //handling like/unlike post
  const onLike = (postId) => {
    dispatch(likeUnlikePost(postId));
  };

  //handling joining a group
  const onJoin = (groupId) => {
    dispatch(joinGroup(groupId)).then(() => {
      dispatch(getAllGroups({ page: 1 }));
    });
  };

  //handling leave request for a group
  const onLeave = (groupId) => {
    setOpenConfirm(true);
    setGroupToLeave(groupId);
  };

  //handling leave group confirmation
  const confirmLeave = (groupToLeave) => {
    dispatch(leaveGroup(groupToLeave))
      .then(() => {
        dispatch(getAllGroups({ page: 1 }));
      })
      .finally(() => {
        setOpenConfirm(false);
        setGroupToLeave(null);
      });
  };

  //loading more posts
  const loadMorePosts = () => {
    if (hasMorePosts && !loadingMorePosts) {
      dispatch(fetchAllPosts({ page: postsPage + 1 }));
    }
  };

  //loading more groups
  const loadMoreGroups = () => {
    if (hasMoreGroups && !loadingMoreGroups) {
      dispatch(getAllGroups({ page: groupsPage + 1 }));
    }
  };

  return (
    <HomeLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* ================= HERO HEADER ================= */}
        <div className="mb-10">
          {/* Hero Container */}
          <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 rounded-3xl p-8 sm:p-10 text-white shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight flex items-center gap-3">
                  🌐 Community
                </h1>

                <p className="mt-4 text-sm sm:text-base lg:text-lg text-indigo-100 max-w-2xl leading-relaxed">
                  {activeTab === "posts"
                    ? "✨ Discover what’s happening across your campus — insights, ideas, updates, and conversations that matter."
                    : "🤝 Join focused communities, connect with like-minded peers, and collaborate around what inspires you."}
                </p>
              </div>

              <div className="w-full sm:w-auto">
                <button
                  onClick={() => {
                    if (activeTab === "posts") {
                      navigate("/community/create-post");
                    } else {
                      navigate("/community/new-group");
                    }
                  }}
                  className="
                  w-full sm:w-auto
                  px-6 py-3
                  text-base font-semibold
                  bg-white
                  text-indigo-900
                  rounded-xl
                  shadow-md
                  hover:bg-indigo-50
                  transition-all duration-200
                "
                >
                  {activeTab === "posts"
                    ? "Create New Post"
                    : "Create New Group"}
                </button>
              </div>
            </div>

            {/* Enlarged Toggle */}
            <div className="mt-8 flex justify-center sm:justify-start">
              <div className="inline-flex bg-white/10 backdrop-blur-md p-1 rounded-full">
                <button
                  onClick={() => setActiveTab("posts")}
                  className={`
        px-5 py-2
        text-sm
        font-semibold
        rounded-full
        transition-all
        ${
          activeTab === "posts"
            ? "bg-white text-indigo-900 shadow-sm"
            : "text-indigo-100 hover:text-white"
        }
      `}
                >
                  Posts
                </button>

                <button
                  onClick={() => setActiveTab("groups")}
                  className={`
        px-5 py-2
        text-sm
        font-semibold
        rounded-full
        transition-all
        ${
          activeTab === "groups"
            ? "bg-white text-indigo-900 shadow-sm"
            : "text-indigo-100 hover:text-white"
        }
      `}
                >
                  Groups
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ================= MAIN GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* -------- LEFT: MAIN CONTENT -------- */}
          <div className="lg:col-span-2">
            {activeTab === "posts" ? (
              <FeedContainer
                posts={posts}
                onLike={onLike}
                onLoadMore={loadMorePosts}
                hasMore={hasMorePosts}
                loadingMore={loadingMorePosts}
              />
            ) : (
              <GroupContainer
                user={user}
                groups={groups}
                onJoin={onJoin}
                onLeave={onLeave}
                onLoadMore={loadMoreGroups}
                hasMore={hasMoreGroups}
                loadingMore={loadingMoreGroups}
              />
            )}
          </div>

          {/* -------- RIGHT: SIDEBAR -------- */}
          <div className="space-y-6">
            {/* Trending */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-base font-semibold text-slate-900 mb-4">
                🔥 Trending Topics
              </h3>

              <div className="space-y-3 text-sm">
                <div className="px-3 py-2 rounded-lg bg-indigo-50 text-indigo-900 font-medium hover:bg-indigo-100 cursor-pointer transition">
                  #MachineLearning
                </div>
                <div className="px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 font-medium hover:bg-emerald-100 cursor-pointer transition">
                  #CampusEvents
                </div>
                <div className="px-3 py-2 rounded-lg bg-orange-50 text-orange-700 font-medium hover:bg-orange-100 cursor-pointer transition">
                  #Hackathon2026
                </div>
                <div className="px-3 py-2 rounded-lg bg-sky-50 text-sky-700 font-medium hover:bg-sky-100 cursor-pointer transition">
                  #AIResearch
                </div>
              </div>
            </div>

            {/* Contextual Promo */}
            {activeTab === "posts" && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-base font-semibold text-slate-900 mb-2">
                  🚀 Build Your Circle
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed mb-5">
                  Groups help you connect with people who share your interests.
                  Learn together, collaborate on ideas, and grow within focused
                  communities.
                </p>

                <div className="space-y-3 text-sm">
                  {groups?.slice(0, 4).map((group) => (
                    <div
                      key={group?._id}
                      className="px-3 py-2 rounded-lg bg-indigo-50 text-indigo-900 font-medium hover:bg-indigo-100 cursor-pointer transition"
                    >
                      {group?.name}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setActiveTab("groups")}
                  className="w-full mt-6 px-4 py-2.5 text-sm font-semibold text-white bg-indigo-900 rounded-lg hover:bg-indigo-800 transition-colors"
                >
                  Explore Groups
                </button>
              </div>
            )}

            {activeTab === "groups" && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-base font-semibold text-slate-900 mb-2">
                  💬 Join the Conversation
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed mb-5">
                  Posts bring your campus to life. Share updates, exchange
                  ideas, and stay connected with what’s happening around you.
                </p>

                <div className="space-y-3 text-sm">
                  <div className="px-3 py-2 rounded-lg bg-slate-100 text-slate-700">
                    📢 Trending Discussions
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-slate-100 text-slate-700">
                    🔥 Most Liked Posts
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-slate-100 text-slate-700">
                    🧠 Knowledge Sharing
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab("posts")}
                  className="w-full mt-6 px-4 py-2.5 text-sm font-semibold text-white bg-indigo-900 rounded-lg hover:bg-indigo-800 transition-colors"
                >
                  Explore Posts
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={openConfirm}
        message="Are you sure you want to leave this group?"
        onConfirm={() => confirmLeave(groupToLeave)}
        onCancel={() => {
          setOpenConfirm(false);
          setGroupToLeave(null);
        }}
      />
    </HomeLayout>
  );
}

export default CommunityPage;
