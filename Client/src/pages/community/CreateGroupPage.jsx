import { useDispatch } from "react-redux";
import { createNewGroup } from "../../../Redux/Slices/GroupSlice";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateGroupPage() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [userInput, setUserInput] = useState({
        name: "",
        description: "",
        category: ""
    });

    const [icon, setIcon] = useState(null);

    const onInputChange = (e) => {
        const { name, value } = e.target;
        setUserInput((s) => ({...s, [name]: value}));
    }

    const onIconChange = (e) =>{
        const file = e.target.files[0];
        if(!file) return;
        setIcon(file);
    }

    //group icon preview
    const [previewIcon, setPreviewIcon] = useState(null);

    useEffect(() => {
        if(!icon) {
            setPreviewIcon(null);
            return;
        }
        const objectURL = URL.createObjectURL(icon);
        setPreviewIcon(objectURL);

        return () => {
            URL.revokeObjectURL(objectURL);
        }
    },[icon]);

    const handleSubmit = async(e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", userInput.name);
        if(userInput?.description) formData.append("description", userInput.description);
        if(userInput?.category) formData.append("category", userInput.category);
        if(icon) formData.append("icon",icon);

        try {
            const response = await dispatch(createNewGroup(formData)).unwrap();
            navigate(`/community/groups/${response?.newGroup?._id}`);
        } catch(error) {
            console.log(error);
        }
    }

    return (
  <div className="min-h-screen flex justify-center px-4 pt-10 backdrop-blur-sm">
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6 sm:p-8"
    >
      {/* Header */}
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Create New Group
      </h1>

      {/* Group Icon */}
      <div className="mb-8 flex flex-col items-center">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Group Icon
        </label>

        {/* Preview */}
        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border bg-gray-50 flex items-center justify-center overflow-hidden mb-3">
          {previewIcon ? (
            <img
              src={previewIcon}
              alt="Group icon preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xs text-gray-400 text-center px-3">
              No icon
            </span>
          )}
        </div>

        {/* Upload Button */}
        <label className="cursor-pointer">
          <span className="inline-block px-4 py-2 text-sm border rounded-lg text-gray-700 hover:bg-gray-50 transition">
            Upload Icon
          </span>
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={onIconChange}
          />
        </label>
      </div>

      {/* Group Name */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Group Name
        </label>
        <input
          type="text"
          name="name"
          value={userInput.name}
          onChange={onInputChange}
          placeholder="Enter group name"
          required
          className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={userInput.description}
          onChange={onInputChange}
          placeholder="What is this group about?"
          rows={4}
          className="w-full resize-none border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Category */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <input
          type="text"
          name="category"
          value={userInput.category}
          onChange={onInputChange}
          placeholder="e.g. Web Development, AI, Startups"
          className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-5 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-6 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Create Group
        </button>
      </div>
    </form>
  </div>
);



};

export default CreateGroupPage;