import GroupPageHeader from "../../components/community/GroupPageHeader";
import GroupFeedContainer from "../../components/community/GroupFeedContainer";
import MemberContainer from "../../components/community/MemberContainer";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  deleteGroup,
  fetchPaginatedGroupMembers,
  joinGroup,
  leaveGroup,
  makeGroupAdmin,
  removeFromAdmin,
  removeFromGroup,
  fetchPaginatedGroupPosts,
  deleteGroupPost,
} from "../../../Redux/Slices/GroupSlice";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { getSingleGroup } from "../../../Redux/Slices/GroupSlice";
import AdminContainer from "../../components/community/AdminContainer";
import { likeUnlikePost } from "../../../Redux/Slices/GroupSlice";
import ConfirmModal from "../../components/ConfirmModal";
import { useRef } from "react";

function GroupPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { groupId } = useParams();

  const user = useSelector((state) => state?.auth?.data);

  const group = useSelector((state) => state?.group?.singleGroup);

  const isAdmin = group?.admins?.some((admin) => admin?._id === user?._id);
  const isMember = group?.members?.some((member) => member === user?._id);
  //const isOnlyAdmin = group?.admins?.length === 1 && isAdmin;
  const currAdmins = useSelector(state => state?.group?.admins);
  const isOnlyAdmin = currAdmins.length === 1;

  //toggle for members and posts
  const [toggle, setToggle] = useState("posts");

  const onToggleClick = (value) => {
    setToggle(value);
  };

  // useEffect(() => {
  //     console.log(groupId);
  //     console.log(isMember);
  //     console.log(group);
  //     console.log(user._id);
  //     console.log(`The logged in member is admin : ${isAdmin}`);

  // },[isAdmin])

  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current === false) {
      dispatch(getSingleGroup(groupId));
      dispatch(
        fetchPaginatedGroupMembers({ groupId, page: 1, flag: "members" })
      );
      dispatch(fetchPaginatedGroupPosts({ groupId, page: 1 }));
      effectRan.current = true;
    }
  }, [dispatch, groupId]);

  useEffect(() => {
    console.log(group);
  }, [groupId, group, dispatch]);

  // props for group header component
  const onJoin = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    dispatch(joinGroup(groupId)).then(() => {
      dispatch(getSingleGroup(groupId));
    });
  };

  const onLeave = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    dispatch(leaveGroup(groupId)).then(() => {
      dispatch(getSingleGroup(groupId));
    });
  };

  const onDelete = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!isAdmin) return;

    dispatch(deleteGroup({ groupId }));
    navigate("/community");
  };

  const onAdminClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setIsOpenAdmin(true);
    dispatch(fetchPaginatedGroupMembers({ groupId, page: 1, flag: "admins" }));
  };

  //we will create a helper function to make the logged in user appear on top
  const moveCurrentUserToTop = (list, userId) => {
  if (!userId || !Array.isArray(list)) return list;

  const index = list.findIndex(item => item?._id === userId);
  if (index === -1) return list;

  const userItem = list[index];
  const remaining = list.filter(item => item?._id !== userId);

  return [userItem, ...remaining];

  // prop definitions for member container component
};

  const fetchedMembers = useSelector((state) => state?.group?.members);
  const members = moveCurrentUserToTop(fetchedMembers, user?._id);
  
  const onRemoveMember = ({ groupId, memberId }) => {
    if (!user || !isAdmin) return;

    dispatch(removeFromGroup({ groupId, memberId }));
  };

  const hasMoreMembers = useSelector((state) => state?.group?.hasMoreMembers);

  const loadingMoreMembers = useSelector(
    (state) => state?.group?.loadingMoreMembers
  );

  const onMakeAdmin = ({ groupId, memberId }) => {
    if (!user || !isAdmin) return;

    dispatch(makeGroupAdmin({ groupId, memberId }));
  };

  const onRemoveFromAdmin = ({ groupId, memberId }) => {
    if (!user || !isAdmin) return;

    dispatch(removeFromAdmin({ groupId, memberId }));
  };

  const onProfileClick = (memberId) => {
    navigate(`/view-profile/${memberId}`);
  };

  const currentMemberPage = useSelector((state) => state?.group?.memberPage);

  const onLoadMoreMembers = ({ groupId, currentMemberPage }) => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (hasMoreMembers && !loadingMoreMembers) {
      dispatch(
        fetchPaginatedGroupMembers({
          groupId,
          page: currentMemberPage + 1,
          flag: "members",
        })
      );
    }
  };

  // props for feed container component
  const posts = useSelector((state) => state?.group?.posts);
  const currentPostPage = useSelector((state) => state?.group?.postPage);
  const hasMorePosts = useSelector((state) => state?.group?.hasMorePosts);
  const loadingMorePosts = useSelector(
    (state) => state?.group?.loadingMorePosts
  );

  const onLikePost = (postId) => {
    dispatch(likeUnlikePost(postId));
  };

  const onLoadMorePosts = (groupId) => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (currentPostPage === 1) return;

    if (hasMorePosts && !loadingMorePosts) {
      dispatch(
        fetchPaginatedGroupPosts({ groupId, page: currentPostPage + 1 })
      );
    }
  };

  const onDeletePost = (postId) => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (isAdmin || isOnlyAdmin) {
      dispatch(deleteGroupPost(postId));
    }
  };

  const onPostClick = (postId) => {
    navigate(`/community/posts/${postId}`);
  };

  // props for admin container component

  const fetchedAdmins = useSelector((state) => state?.group?.admins);
  const admins = moveCurrentUserToTop(fetchedAdmins, user?._id);

  const hasMoreAdmins = useSelector((state) => state?.group?.hasMoreAdmins);
  const loadingMoreAdmins = useSelector(
    (state) => state?.group?.loadingMoreAdmins
  );
  const currentAdminPage = useSelector((state) => state?.group?.adminsPage);

  const [isOpenAdmin, setIsOpenAdmin] = useState(false);

  const onCloseAdmin = () => {
    setIsOpenAdmin(false);
  };

  const onRemoveAdmin = ({ groupId, memberId }) => {
    if (!user || !isAdmin) return;
    dispatch(removeFromAdmin({ groupId, memberId }));
  };

  const onLoadMoreAdmins = ({ groupId }) => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (hasMoreAdmins && !loadingMoreAdmins) {
      dispatch(
        fetchPaginatedGroupMembers({
          groupId,
          page: currentAdminPage + 1,
          flag: "admins",
        })
      );
    }
  };

  // since we have to use the confirm modal for multiple tasks, we will create a single handler for all cases

  // first define a confirm state
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: "",
    message: "",
    payload: null,
  });

  // everytime a button is clicked whose action needs confirmation, we call the openConfirm function with the requried parameters.
  const openConfirm = ({
    type,
    payload = null,
    title = "Please confirm",
    message = "",
  }) => {
    setConfirmState({ isOpen: true, type, payload, title, message });
  };

  useEffect(() => {
    console.log(confirmState);
  }, [confirmState]);

  const closeConfirm = () => {
    setConfirmState((s) => ({ ...s, isOpen: false }));
  };

  const getConfirmHandler = () => {
    const { type, payload } = confirmState;

    switch (type) {
      case "remove-member":
        return () => {
          onRemoveMember({
            groupId,
            memberId: payload.memberId,
          });
        };

      case "make-admin":
        return () => {
          onMakeAdmin({
            groupId,
            memberId: payload.memberId,
          });
        };

      case "remove-from-admin":
        return () => {
          onRemoveFromAdmin({
            groupId,
            memberId: payload.memberId,
          });
        };

      case "delete-group":
        return () => {
          onDelete();
        };

      case "leave-group":
        return () => {
          onLeave();
        };

      default:
        return () => {};
    }
  };

  useEffect(() => {
    if (posts) {
      console.log(posts);
    }
    if (members) {
      console.log(members);
    }
  }, [posts, members]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header (contains group details + actions) */}
      <GroupPageHeader
        group={group}
        isMember={isMember}
        isAdmin={isAdmin}
        isOnlyAdmin={isOnlyAdmin}
        onJoin={() => onJoin()}
        onAdminClick={() => onAdminClick()}
        onLeave={() => {
          openConfirm({
            type: "leave-group",
            title: "Leave Group",
            message: "Are you sure you want to leave this group?",
            payload: { groupId }
          })
        }}
        onDelete={() => {
          openConfirm({
            type: "delete-group",
            title: "Delete-Group",
            message: "Are you sure you want to delete this group? This action cannot be undone!",
            payload: {groupId}
          })
        }}
      />

      {/* Toggle */}
      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleClick("posts")}
            className={`px-4 py-2 rounded-full text-sm transition ${
              toggle === "posts"
                ? "bg-slate-900 text-white shadow"
                : "bg-white/80 text-slate-800"
            }`}
          >
            Posts
          </button>

          <button
            onClick={() => onToggleClick("members")}
            className={`px-4 py-2 rounded-full text-sm transition ${
              toggle === "members"
                ? "bg-slate-900 text-white shadow"
                : "bg-white/80 text-slate-800"
            }`}
          >
            Members
          </button>
        </div>

        <div className="text-sm text-slate-500">
          {toggle === "posts"
            ? `${posts?.length ?? 0} posts`
            : `${members?.length ?? 0} members`}
        </div>
      </div>

      {/* Main content - single column */}
      <div className="mt-5">
        {toggle === "posts" ? (
          <GroupFeedContainer
            posts={posts}
            onLike={onLikePost}
            onDelete={(postId) =>
              openConfirm({
                type: "delete-post",
                payload: { postId },
                title: "Delete Post",
                message: "Delete this post? This cannot be undone.",
              })
            }
            onLoadMore={() => onLoadMorePosts(groupId)}
            hasMore={hasMorePosts}
            loadingMore={loadingMorePosts}
            onPostClick={(postId) => onPostClick(postId)}
          />
        ) : (
          <MemberContainer
            members={members}
            isAdmin={isAdmin}
            onRemove={({ memberId }) =>
              openConfirm({
                type: "remove-member",
                payload: { memberId },
                title: "Remove member",
                message:
                  "Are you sure you want to remove this member from the group?",
              })
            }
            onMakeAdmin={({ memberId }) =>
              openConfirm({
                type: "make-admin",
                payload: { memberId },
                title: "Make admin",
                message: "Are you sure you want to make this member an admin?",
              })
            }
            onRemoveFromAdmin={({ memberId }) =>
              openConfirm({
                type: "remove-from-admin",
                payload: { memberId },
                title: "Remove admin",
                message:
                  "Are you sure you want to remove admin privileges for this user?",
              })
            }
            
            onProfileClick={onProfileClick}
            onLoadMore={() => onLoadMoreMembers({ groupId, currentMemberPage })}
            hasMore={hasMoreMembers}
            loadingMore={loadingMoreMembers}
            isMemberAdmin={({ memberId }) => isMemberAdmin({ memberId })}
          />
        )}
      </div>

      {/* Optional admin container / confirm modal */}
      <AdminContainer
        isOpen={isOpenAdmin}
        onClose={onCloseAdmin}
        admins={admins}
        onLoadMore={() => onLoadMoreAdmins({ groupId })}
        hasMore={hasMoreAdmins}
        loadingMore={loadingMoreAdmins}
        onProfileClick={onProfileClick}
        onRemoveFromAdmin={({ memberId }) => onRemoveAdmin({ groupId, memberId })}
        isAdmin={isAdmin}
      />

      <ConfirmModal
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        onCancel={() => closeConfirm()}
        onConfirm={async () => {
          try {
            const handler = getConfirmHandler();
            if (typeof handler === "function") {
              const result = handler();
              if (result && typeof result.then === "function") {
                await result;
              }
            }
            //dispatch(getSingleGroup(groupId));
          } catch (err) {
            console.error("Confirm action failed:", err);
          } finally {
            closeConfirm();
          }
        }}
      />
    </div>
  );
}

export default GroupPage;
