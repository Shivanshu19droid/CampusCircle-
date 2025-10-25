import { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchUserProfile } from "../../../Redux/Slices/ProfileSlice";
import { useParams } from "react-router-dom";
import HomeLayout from "../../layouts/HomeLayouts";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useRef } from "react";

function ViewProfile() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const didFetch = useRef(false);

    const loggedInUser = useSelector((state) => state.auth.data);

    const {id} = useParams()

    useEffect( () => {
        if(!didFetch.current){
            dispatch(fetchUserProfile(id));
            didFetch.current = true;
        }
    }, [id])

    const searchedUser = useSelector((state) => state.profile.data);

    console.log(id);
    console.log(searchedUser);


    return (
  <HomeLayout>
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
        <div className="absolute -bottom-16 left-6 flex items-end">
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
            {(searchedUser?.currentProfession || searchedUser?.currentCompany) && (
              <p className="text-gray-600">
                {searchedUser.currentProfession
                  ? searchedUser.currentProfession
                  : ""}{" "}
                {searchedUser.currentCompany ? `at ${searchedUser.currentCompany}` : ""}
              </p>
            )}
            {searchedUser?.currentLocation && (
              <p className="text-gray-500 text-sm">{searchedUser.currentLocation}</p>
            )}
          </div>

          {/* Edit / Follow Button */}
          {loggedInUser?._id === searchedUser?._id ? (
            <button
              onClick={() => navigate("/edit-profile")}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Edit Profile
            </button>
          ) : (
            <button
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              {searchedUser?.followers?.includes(loggedInUser?._id)
                ? "Unfollow"
                : "Follow"}
            </button>
          )}
        </div>

        {/* Bio */}
        <p className="mt-4 text-gray-700 leading-relaxed">
          {searchedUser?.bio || "No bio added yet."}
        </p>

        {/* Location, Role & Batch */}
        <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">
          {searchedUser?.currentLocation && <span>📍 {searchedUser.currentLocation}</span>}
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
          searchedUser?.links?.linkedIn ||
          searchedUser?.links?.portfolio) && (
          <div className="mt-5">
            <h3 className="font-semibold text-gray-800 mb-2">Links</h3>
            <div className="flex gap-4">
              {searchedUser?.links?.linkedIn && (
                <a
                  href={searchedUser.links.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  LinkedIn
                </a>
              )}
              {searchedUser?.links?.github && (
                <a
                  href={searchedUser.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-800 hover:underline"
                >
                  GitHub
                </a>
              )}
              {searchedUser?.links?.portfolio && (
                <a
                  href={searchedUser.links.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:underline"
                >
                  Portfolio
                </a>
              )}
            </div>
          </div>
        )}

        {/* Followers & Following */}
        <div className="mt-6 flex gap-6 text-sm text-gray-600">
          <span>👥 {searchedUser?.followers?.length || 0} Followers</span>
          <span>➡️ {searchedUser?.following?.length || 0} Following</span>
        </div>
      </div>
    </div>
  </HomeLayout>
);
  


}

 export default ViewProfile; 