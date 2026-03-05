import { useDispatch } from "react-redux";
import HomeLayout from "../../layouts/HomeLayouts";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { editUserProfile } from "../../../Redux/Slices/ProfileSlice";
import { useState } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { getMyProfile } from "../../../Redux/Slices/AuthSlice";
import AiBioPopup from "../../components/Profile/AiBioPopUp";

function EditProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [BioPopup, setBioPopup] = useState(false);

  const user = useSelector((state) => state.auth.data);

  const [userInput, setUserInput] = useState({
    fullName: "",
    bio: "",
    currentProfession: "",
    currentCompany: "",
    currentLocation: "",
    skills: [],
    github: "",
    linkedin: "",
    portfolio: "",
    batch: "",
    role: "STUDENT",
  });

  useEffect(() => {
    console.log(user);
    if (user) {
      setUserInput({
        fullName: user.fullName || "",
        bio: user.bio || "",
        currentProfession: user.currentProfession || "",
        currentCompany: user.currentCompany || "",
        currentLocation: user.currentLocation || "",
        skills: user.skills || [],
        github: user.links?.github || "",
        linkedin: user.links?.linkedin || "",
        portfolio: user.links?.portfolio || "",
        batch: user.batch || "",
        role: user.role || "STUDENT",
      });
    }
  }, [user]);

  const [avatar, setAvatar] = useState(user?.avatar || null);
  const [coverImage, setCoverImage] = useState(user?.coverImage || null);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];

    if (type === "avatar") setAvatar(file);
    if (type === "cover") setCoverImage(file);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setUserInput({
      ...userInput,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userInput.fullName) {
      toast.error("Your Full Name is a mandatory field");
      return;
    }

    const formData = new FormData();
    formData.append("fullName", userInput.fullName);
    formData.append("bio", userInput.bio);
    formData.append("currentProfession", userInput.currentProfession);
    formData.append("currentCompany", userInput.currentCompany);
    formData.append("currentLocation", userInput.currentLocation);
    formData.append("skills", userInput.skills);
    formData.append("links.github", userInput.github);
    formData.append("links.linkedin", userInput.linkedin);
    formData.append("links.portfolio", userInput.portfolio);
    formData.append("batch", userInput.batch);
    formData.append("role", userInput.role);

    if (avatar) formData.append("avatar", avatar);
    if (coverImage) formData.append("coverImage", coverImage);

    const response = await dispatch(editUserProfile(formData));

    if (response?.payload?.success) {
      await dispatch(getMyProfile());
      navigate(`/view-profile/${user?._id}`);
    }
  };

 return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-900 to-[#2E2A8C] px-4 py-12">
    <div className="w-full max-w-5xl bg-white border border-slate-200 rounded-2xl shadow-[0_25px_40px_-10px_rgba(0,0,0,0.45)] overflow-hidden">

      {/* Header */}
      <div className="px-8 pt-8 pb-6 border-b border-slate-200">
        <h2 className="text-2xl font-semibold text-slate-900">
          Edit Profile
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Manage your profile information for your campus community.
        </p>
      </div>

      <form onSubmit={handleSubmit}>

        <div className="flex flex-col md:flex-row gap-10 px-8 py-8">

          {/* LEFT PANEL */}
          <div className="md:w-1/3 flex flex-col gap-6">

            {/* Avatar Upload */}
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-2">
                Avatar
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "avatar")}
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2"
              />
            </div>

            {/* Cover Upload */}
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-2">
                Cover Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "cover")}
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2"
              />
            </div>

          </div>

          {/* RIGHT PANEL */}
          <div className="md:w-2/3 flex flex-col gap-6">

            {/* Full Name */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">
                Full Name *
              </label>

              <input
                type="text"
                name="fullName"
                value={userInput.fullName}
                onChange={handleInputChange}
                className="border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-900 focus:border-indigo-900 outline-none"
              />
            </div>

            {/* Bio */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">

                <label className="text-sm font-medium text-slate-700">
                  Bio
                </label>

                <button
                  onClick={() => setBioPopup(!BioPopup)}
                  type="button"
                  className="text-sm font-medium text-indigo-900 hover:underline"
                >
                  ✨ Generate with AI
                </button>

                {BioPopup && (
                  <AiBioPopup
                    onDone={(generatedBio) => {
                      setUserInput({
                        ...userInput,
                        bio: generatedBio,
                      });
                      setBioPopup(!BioPopup);
                    }}
                    onClose={() => setBioPopup(!BioPopup)}
                  />
                )}

              </div>

              <textarea
                name="bio"
                value={userInput.bio}
                onChange={handleInputChange}
                rows="3"
                className="border border-slate-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-900 focus:border-indigo-900 outline-none resize-none"
              ></textarea>
            </div>

            {/* Profession / Company / Location */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              <input
                type="text"
                name="currentProfession"
                value={userInput.currentProfession}
                onChange={handleInputChange}
                placeholder="Profession"
                className="border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-900 outline-none"
              />

              <input
                type="text"
                name="currentCompany"
                value={userInput.currentCompany}
                onChange={handleInputChange}
                placeholder="Company"
                className="border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-900 outline-none"
              />

              <input
                type="text"
                name="currentLocation"
                value={userInput.currentLocation}
                onChange={handleInputChange}
                placeholder="Location"
                className="border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-900 outline-none"
              />

            </div>

            {/* Skills */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">
                Skills
              </label>

              <input
                type="text"
                name="skills"
                value={userInput.skills}
                onChange={handleInputChange}
                placeholder="React, Node.js, MongoDB"
                className="border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-900 outline-none"
              />
            </div>

            {/* Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              <input
                type="text"
                name="github"
                value={userInput.github}
                onChange={handleInputChange}
                placeholder="GitHub"
                className="border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-900 outline-none"
              />

              <input
                type="text"
                name="linkedin"
                value={userInput.linkedin}
                onChange={handleInputChange}
                placeholder="LinkedIn"
                className="border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-900 outline-none"
              />

              <input
                type="text"
                name="portfolio"
                value={userInput.portfolio}
                onChange={handleInputChange}
                placeholder="Portfolio"
                className="border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-900 outline-none"
              />

            </div>

            <p className="text-xs text-slate-500">
              Please include full URLs starting with
              <span className="font-medium"> https://</span>
            </p>

            {/* Batch & Role */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <input
                type="text"
                name="batch"
                value={userInput.batch}
                onChange={handleInputChange}
                placeholder="Batch (e.g. 2025)"
                className="border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-900 outline-none"
              />

              <select
                name="role"
                value={userInput.role}
                onChange={handleInputChange}
                className="border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-900 outline-none"
              >
                <option value="STUDENT">Student</option>
                <option value="ALUMNI">Alumni</option>
                <option value="FACULTY">Faculty</option>
              </select>

            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-8 py-6 flex justify-end gap-4">

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition text-sm"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-8 py-2.5 rounded-lg bg-indigo-900 text-white font-medium hover:bg-indigo-800 transition shadow-[0_20px_25px_-5px_rgba(0,0,0,0.2)]"
          >
            Save Changes
          </button>

        </div>

      </form>
    </div>
  </div>
);

}

export default EditProfile;
