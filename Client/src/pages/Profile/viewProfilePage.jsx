import { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchPaginatedUserPosts, fetchUserProfile, followUser, unfollowUser } from "../../../Redux/Slices/ProfileSlice";
import { useParams } from "react-router-dom";
import HomeLayout from "../../layouts/HomeLayouts";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useRef } from "react";
import { FaGithub, FaLinkedin, FaGlobe } from "react-icons/fa";
import FeedContainer from "../../components/community/FeedContainer";
import { likeUnlikePost } from "../../../Redux/Slices/postSlice";
import ConfirmModal from "../../components/ConfirmModal";



function ViewProfile() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    //const didFetch = useRef(false);

    const loggedInUser = useSelector((state) => state.auth.data);

    const {id} = useParams();

    // user posts
    const userPosts = useSelector((state) => state?.profile?.userPosts);
    const isLoading = useSelector((state) => state?.profile?.isLoading);
    const loadingMorePosts = useSelector((state) => state?.profile?.loadingMorePosts);
    const hasMorePosts = useSelector((state) => state?.profile?.hasMorePosts);
    const postsCount = useSelector((state) => state?.profile?.postsCount);
    const page = useSelector((state) => state?.profile?.page);

    useEffect( () => {
            dispatch(fetchUserProfile(id));
            
            dispatch(fetchPaginatedUserPosts({id, page: 1}));

    }, [id])

    const searchedUser = useSelector((state) => state.profile.data);

    // loading more posts
    const onLoadMorePosts = () => {
      if(hasMorePosts && !loadingMorePosts) {
        dispatch(fetchPaginatedUserPosts({id, page: page + 1}));
      }
    }

    // like unlike
    const handleLike = (postId) => {
      dispatch(likeUnlikePost(postId));
    }

    const isFollowing = loggedInUser?.following?.includes(searchedUser?._id);

    // follow user
    const handleFollow = async () => {

      if(isFollowing) {
        toast.error("You are already following this user");
        return;
      }

      dispatch(followUser(id));

    }

    // unfollow user
    const handleUnFollow = async () => {

      if(!isFollowing) {
        toast.error("You do not follow this user");
        return;
      }
      dispatch(unfollowUser(id));

    }

    // confirm handler
    const [confirmState, setConfirmState] = useState({
      isOpen: false,
      message: "",
      title: "",
      payload: null
    });

    const openConfirm = ({
      type,
      payload = null,
      title = "Please Confirm!",
      message = ""
    }) => {
      setConfirmState({isOpen: true, type, payload, title, message});
    }

    const closeConfirm = () => {
      setConfirmState((s) => ({...s, isOpen: false}));
    }

    const getConfirmHandler = () => {
      
      const {type, payload} = confirmState;

      switch(type) {
        case "unfollow":
          return () => {
            handleUnFollow(payload?.id);
          }
        
          default: 
            return () => {};
      }
    };

  return (
  <HomeLayout>
    <div className="max-w-6xl mx-auto mt-8">

      {/* ================= PROFILE CARD ================= */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-200">

        {/* ===== COVER ===== */}
        <div className="relative h-56 bg-slate-200">
          {searchedUser?.coverImage?.secure_url ? (
            <img
              src={searchedUser.coverImage.secure_url}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-slate-300 flex items-center justify-center text-slate-500 text-sm">
              No Cover Image
            </div>
          )}

          {/* Avatar */}
          <div className="absolute -bottom-16 left-8">
            <img
              src={
                searchedUser?.avatar?.secure_url ||
                "https://cdn-icons-png.flaticon.com/512/847/847969.png"
              }
              alt="Avatar"
              className="w-36 h-36 rounded-full border-4 border-white shadow-lg object-cover"
            />
          </div>
        </div>

        {/* ===== PROFILE BODY ===== */}
        <div className="pt-20 px-8 pb-10">

          {/* Top Row */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">

            {/* Left Info */}
            <div>

              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                {searchedUser?.fullName || "No Name Yet"}
              </h1>

              {(searchedUser?.currentProfession ||
                searchedUser?.currentCompany) && (
                <p className="mt-1 text-slate-600 text-lg">
                  {searchedUser.currentProfession || ""}
                  {searchedUser.currentCompany
                    ? ` at ${searchedUser.currentCompany}`
                    : ""}
                </p>
              )}

              {searchedUser?.bio && (
                <p className="mt-4 text-slate-700 leading-relaxed max-w-2xl">
                  {searchedUser.bio}
                </p>
              )}

            </div>

            {/* Right Section (Action + Stats) */}
            <div className="flex flex-col items-start lg:items-end gap-5">

              {/* Action Button */}
              {loggedInUser?._id === searchedUser?._id ? (
                <button
                  onClick={() => navigate("/edit-profile")}
                  className="px-6 py-2.5 rounded-lg bg-indigo-800 text-white font-medium hover:bg-indigo-900 transition duration-200 shadow-md"
                >
                  Edit Profile
                </button>
              ) : isFollowing ? (
                <button
                  onClick={() => {
                    openConfirm({
                      type: "unfollow",
                      payload: searchedUser._id,
                      title: "Unfollow user",
                      message: `Are you sure you want to unfollow ${searchedUser.fullName}?`,
                    });
                  }}
                  className="px-6 py-2.5 rounded-lg bg-slate-200 text-slate-800 font-medium hover:bg-slate-300 transition duration-200"
                >
                  Following
                </button>
              ) : (
                <button
                  onClick={handleFollow}
                  className="px-6 py-2.5 rounded-lg bg-indigo-800 text-white font-medium hover:bg-indigo-900 transition duration-200 shadow-md"
                >
                  Follow
                </button>
              )}

              {/* Followers Stats */}
              <div className="flex gap-8 text-sm text-slate-600">
                <div>
                  <span className="font-semibold text-slate-900">
                    {searchedUser?.following?.length || 0}
                  </span>{" "}
                  Following
                </div>
                <div>
                  <span className="font-semibold text-slate-900">
                    {searchedUser?.followers?.length || 0}
                  </span>{" "}
                  Followers
                </div>
              </div>

            </div>

          </div>

          {/* Meta Info */}
          <div className="mt-6 flex flex-wrap gap-6 text-sm text-slate-500">
            {searchedUser?.currentLocation && (
              <span>📍 {searchedUser.currentLocation}</span>
            )}
            {searchedUser?.batch && (
              <span>🎓 Batch: {searchedUser.batch}</span>
            )}
            {searchedUser?.role && (
              <span>👤 Role: {searchedUser.role}</span>
            )}
          </div>

          {/* Skills */}
          {searchedUser?.skills?.length > 0 && (
            <div className="mt-8">
              <h3 className="font-semibold text-slate-900 mb-3">
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {searchedUser.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-indigo-50 text-indigo-800 text-sm rounded-full font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          {(searchedUser?.links?.github ||
            searchedUser?.links?.linkedin ||
            searchedUser?.links?.portfolio) && (
            <div className="mt-8">
              <h3 className="font-semibold text-slate-900 mb-4">
                Links
              </h3>

              <div className="flex flex-wrap gap-4">
                {searchedUser?.links?.linkedin && (
                  <a
                    href={searchedUser.links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg border border-slate-200 hover:bg-indigo-50 transition"
                  >
                    LinkedIn
                  </a>
                )}

                {searchedUser?.links?.github && (
                  <a
                    href={searchedUser.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-100 transition"
                  >
                    GitHub
                  </a>
                )}

                {searchedUser?.links?.portfolio && (
                  <a
                    href={searchedUser.links.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg border border-slate-200 hover:bg-indigo-50 transition"
                  >
                    Portfolio
                  </a>
                )}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ================= POSTS SECTION ================= */}
      <div className="max-w-6xl mx-auto mt-10">

        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold text-slate-900">
            Posts
          </h2>
          <span className="text-sm text-slate-500">
            {postsCount || 0} posts
          </span>
        </div>

        <div className="border-t border-slate-200 mb-6" />

        <FeedContainer
          posts={userPosts}
          hasMore={hasMorePosts}
          loadingMore={loadingMorePosts}
          onLoadMore={onLoadMorePosts}
          onLike={handleLike}
        />
      </div>

      {/* Confirm Modal */}
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

 export default ViewProfile; 