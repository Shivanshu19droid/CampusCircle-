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
  const [activeTab, setActiveTab] = useState("posts");

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
    (state) => state?.post?.loadingMorePosts
  );

  //GROUPS from redux
  const groups = useSelector((state) => state?.group?.groups);
  const groupsPage = useSelector((state) => state?.group?.page);
  const hasMoreGroups = useSelector((state) => state?.group?.hasMoreGroups);
  const loadingMoreGroups = useSelector(
    (state) => state?.group?.loadingMoreGroups
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      
      {/* ---------- TABS + ACTION BUTTON ---------- */}
      <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-5 mb-6 hover:scale-[1.01] transition-transform duration-200">
        
        <div className="flex items-center justify-between">
          
          {/* Tabs */}
          <div className="flex gap-8 text-sm">
            <button
              className={`pb-2 transition-colors ${
                activeTab === "posts"
                  ? "font-semibold border-b-2 border-[#FF6B35] text-gray-800"
                  : "text-gray-500 hover:text-gray-800"
              }`}
              onClick={() => setActiveTab("posts")}
            >
              Posts
            </button>

            <button
              className={`pb-2 transition-colors ${
                activeTab === "groups"
                  ? "font-semibold border-b-2 border-[#FF6B35] text-gray-800"
                  : "text-gray-500 hover:text-gray-800"
              }`}
              onClick={() => setActiveTab("groups")}
            >
              Groups
            </button>
          </div>

          {/* Create Button */}
          <button
            onClick={() => {
              if (activeTab === "posts") {
                navigate("/community/create-post");
              } else {
                navigate("/community/new-group");
              }
            }}
            className="px-5 py-2 text-sm font-medium text-white bg-[#FF6B35] rounded-full hover:opacity-90 transition-all"
          >
            {activeTab === "posts" ? "Create New Post" : "Create New Group"}
          </button>
        </div>
      </div>

      {/* ---------- CONDITIONAL RENDERING ---------- */}
      <div className="transition-all duration-200">
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
