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
    {/* Profile Card */}
    <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm mt-8 overflow-hidden">
      {/* Cover Image */}
      <div className="relative h-48 bg-gray-200">
        {searchedUser?.coverImage?.secure_url ? (
          <img
            src={searchedUser.coverImage.secure_url}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">
            No Cover Image
          </div>
        )}

        {/* Avatar */}
        <div className="absolute -bottom-16 left-6">
          <img
            src={
              searchedUser?.avatar?.secure_url ||
              "https://cdn-icons-png.flaticon.com/512/847/847969.png"
            }
            alt="Avatar"
            className="w-32 h-32 rounded-full border-4 border-white shadow-md"
          />
        </div>
      </div>

      {/* Profile Info */}
      <div className="mt-20 px-6 pb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold">
              {searchedUser?.fullName || "No Name Yet"}
            </h1>

            {(searchedUser?.currentProfession ||
              searchedUser?.currentCompany) && (
              <p className="text-gray-600">
                {searchedUser.currentProfession || ""}
                {searchedUser.currentCompany
                  ? ` at ${searchedUser.currentCompany}`
                  : ""}
              </p>
            )}

            {searchedUser?.currentLocation && (
              <p className="text-gray-500 text-sm">
                {searchedUser.currentLocation}
              </p>
            )}
          </div>

          {/* Action Button (slightly left + larger) */}
          {loggedInUser?._id === searchedUser?._id ? (
            <button
              onClick={() => navigate("/edit-profile")}
              className="mr-4 px-5 py-2.5 text-base bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
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
              className="mr-4 px-5 py-2.5 text-base bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Following
            </button>
          ) : (
            <button
              onClick={handleFollow}
              className="mr-4 px-5 py-2.5 text-base bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Follow
            </button>
          )}
        </div>

        {/* Bio */}
        <p className="mt-4 text-gray-700 leading-relaxed">
          {searchedUser?.bio || "No bio added yet."}
        </p>

        {/* Meta Info */}
        <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">
          {searchedUser?.currentLocation && (
            <span>📍 {searchedUser.currentLocation}</span>
          )}
          {searchedUser?.batch && <span>🎓 Batch: {searchedUser.batch}</span>}
          {searchedUser?.role && <span>👤 Role: {searchedUser.role}</span>}
        </div>

        {/* Skills */}
        {searchedUser?.skills?.length > 0 && (
          <div className="mt-5">
            <h3 className="font-semibold text-gray-800 mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {searchedUser.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm rounded-full"
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
          <div className="mt-6">
            <h3 className="font-semibold text-gray-800 mb-3">Links</h3>

            <div className="flex flex-wrap gap-4">
              {searchedUser?.links?.linkedin && (
                <a
                  href={searchedUser.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-blue-50 transition"
                >
                  <FaLinkedin className="text-blue-600 text-xl" />
                  <span className="text-sm font-medium text-blue-600">
                    LinkedIn
                  </span>
                </a>
              )}

              {searchedUser?.links?.github && (
                <a
                  href={searchedUser.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
                >
                  <FaGithub className="text-gray-800 text-xl" />
                  <span className="text-sm font-medium text-gray-800">
                    GitHub
                  </span>
                </a>
              )}

              {searchedUser?.links?.portfolio && (
                <a
                  href={searchedUser.links.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-purple-50 transition"
                >
                  <FaGlobe className="text-purple-600 text-xl" />
                  <span className="text-sm font-medium text-purple-600">
                    Portfolio
                  </span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Followers / Following */}
        <div className="mt-6 flex gap-6 text-sm text-gray-600">
          <span>👥 {searchedUser?.followers?.length || 0} Followers</span>
          <span>➡️ {searchedUser?.following?.length || 0} Following</span>
        </div>
      </div>
    </div>

    {/* Posts Indicator */}
    <div className="max-w-5xl mx-auto mt-8">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-gray-800">Posts</h2>
        <span className="text-sm text-gray-500">
          {postsCount || 0} posts
        </span>
      </div>
      <div className="border-t border-gray-200" />
    </div>

    {/* Feed Section */}
    <div className="max-w-5xl mx-auto mt-6">
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
  </HomeLayout>
);




  


}

 export default ViewProfile; 