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
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-900 to-[#2E2A8C] px-4 py-12">
    <form
      onSubmit={handleSubmit}
      className="
        w-full
        max-w-5xl
        bg-white
        rounded-2xl
        border border-slate-200
        shadow-[0_25px_40px_-10px_rgba(0,0,0,0.45)]
        overflow-hidden
        transition-all duration-200
      "
    >
      {/* Header */}
      <div className="px-8 pt-8 pb-6 border-b border-slate-200">
        <h1 className="text-2xl font-semibold text-slate-900">
          Create New Group
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Set up a new group for your campus community.
        </p>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 px-8 py-8">
        
        {/* LEFT — IMAGE */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-4">
            Upload Group Image
          </label>

          <div className="w-full aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center mb-4">
            {previewIcon ? (
              <img
                src={previewIcon}
                alt="Group preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm text-slate-400">
                No image selected
              </span>
            )}
          </div>

          <label className="cursor-pointer block">
            <span className="w-full inline-flex justify-center items-center px-4 py-2.5 text-sm font-medium rounded-lg bg-indigo-900 hover:bg-indigo-800 text-white transition duration-200">
              Upload Image
            </span>
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={onIconChange}
            />
          </label>

          <p className="text-xs text-slate-400 mt-3">
            JPG or PNG, max 5MB
          </p>
        </div>

        {/* RIGHT — FORM */}
        <div className="space-y-6">

          {/* Group Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Group Name
            </label>

            <input
              type="text"
              name="name"
              value={userInput.name}
              onChange={onInputChange}
              placeholder="Enter group name"
              required
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-900 focus:border-indigo-900 transition"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Category
            </label>

            <input
              type="text"
              name="category"
              value={userInput.category}
              onChange={onInputChange}
              placeholder="e.g. Web Development, AI, Startups"
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-900 focus:border-indigo-900 transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>

            <textarea
              name="description"
              value={userInput.description}
              onChange={onInputChange}
              placeholder="Write a brief description..."
              rows={4}
              className="w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-900 focus:border-indigo-900 transition"
            />
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-4 px-8 pb-8 pt-4 border-t border-slate-200">

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-5 py-2.5 text-sm rounded-lg text-slate-600 hover:bg-slate-100 transition"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-6 py-2.5 text-sm font-medium rounded-lg bg-indigo-900 hover:bg-indigo-800 text-white transition shadow-[0_20px_25px_-5px_rgba(0,0,0,0.2)]"
        >
          Create Group
        </button>

      </div>
    </form>
  </div>
);


};

export default CreateGroupPage;