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
  links: {
    github: "",
    linkedIn: "",
    portfolio: "",
  },
  batch: "",
  role: "STUDENT",
});

useEffect(() => {
  console.log(user)
  if (user) {
    setUserInput({
      fullName: user.fullName || "",
      bio: user.bio || "",
      currentProfession: user.currentProfession || "",
      currentCompany: user.currentCompany || "",
      currentLocation: user.currentLocation || "",
      skills: user.skills || [],
      links: {
        github: user.links?.github || "",
        linkedIn: user.links?.linkedIn || "",
        portfolio: user.links?.portfolio || "",
      },
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
    formData.append("links", JSON.stringify(userInput.links)); 
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
    <HomeLayout>
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-8 mt-10">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Edit Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Avatar Upload */}
          <div>
            <label className="block text-gray-600 mb-2">Avatar</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "avatar")}
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* Cover Image Upload */}
          <div>
            <label className="block text-gray-600 mb-2">Cover Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "cover")}
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-gray-600 mb-2">Full Name *</label>
            <input
              type="text"
              name="fullName"
              value={userInput.fullName}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* Bio */}
          <div>
            <div className="flex justify-between items-center">
              <label className="block text-gray-600 mb-2">Bio</label>
              <button
                onClick={() => setBioPopup(!BioPopup)}
                type="button"
                className="text-sm text-indigo-600 hover:underline"
              >
                ✨ Generate with AI
              </button>
              {BioPopup && <AiBioPopup
                onDone={(generatedBio) => {
                  setUserInput({
                    ...userInput,
                    bio: generatedBio
                  })
                  setBioPopup(!BioPopup)
                }}
                onClose = {() => setBioPopup(!BioPopup)} />}
            </div>
            <textarea
              name="bio"
              value={userInput.bio}
              onChange={handleInputChange}
              rows="3"
              className="w-full p-2 border rounded-md"
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
              className="p-2 border rounded-md"
            />
            <input
              type="text"
              name="currentCompany"
              value={userInput.currentCompany}
              onChange={handleInputChange}
              placeholder="Company"
              className="p-2 border rounded-md"
            />
            <input
              type="text"
              name="currentLocation"
              value={userInput.currentLocation}
              onChange={handleInputChange}
              placeholder="Location"
              className="p-2 border rounded-md"
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block text-gray-600 mb-2">
              Skills (comma separated)
            </label>
            <input
              type="text"
              name="skills"
              value={userInput.skills}
              onChange={handleInputChange}
              placeholder="e.g. React, Node.js, MongoDB"
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              name="github"
              value={userInput.links.github}
              onChange={handleInputChange}
              placeholder="GitHub"
              className="p-2 border rounded-md"
            />
            <input
              type="text"
              name="linkedIn"
              value={userInput.links.linkedIn}
              onChange={handleInputChange}
              placeholder="LinkedIn"
              className="p-2 border rounded-md"
            />
            <input
              type="text"
              name="portfolio"
              value={userInput.links.portfolio}
              onChange={handleInputChange}
              placeholder="Portfolio"
              className="p-2 border rounded-md"
            />
          </div>

          {/* Batch & Role */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="batch"
              value={userInput.batch}
              onChange={handleInputChange}
              placeholder="Batch (e.g. 2025)"
              className="p-2 border rounded-md"
            />
            <select
              name="role"
              value={userInput.role}
              onChange={handleInputChange}
              className="p-2 border rounded-md"
            >
              <option value="STUDENT">Student</option>
              <option value="ALUMNI">Alumni</option>
              <option value="FACULTY">Faculty</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </HomeLayout>
  );
}

export default EditProfile;
