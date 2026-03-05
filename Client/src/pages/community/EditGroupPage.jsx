import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { editGroup } from "../../../Redux/Slices/GroupSlice";
import toast from "react-hot-toast";

function EditGroupPage() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const groupDetails = useLocation().state;

    const [userInput, setUserInput] = useState({
        name: groupDetails.groupName,
        description: groupDetails.groupDescription,
        category: groupDetails.groupCategory
    });

    const [icon, setIcon] = useState(groupDetails?.groupIcon);

    const onInputChange = (e) => {
        const {name, value} = e.target;
        setUserInput((s) => ({...s, [name]: value}));
    }

    const onIconChange = (e) => {
        const file = e.target.files[0];
        if(!file) return;
        setIcon(file);
    }

    // setting the preview icon
    const [previewIcon, setPreviewIcon] = useState(icon);

    useEffect(() => {
        if(!icon)  {
            setPreviewIcon(null);
            return;
        }

        if (!(icon instanceof File)) {
        setPreviewIcon(icon?.secure_url);
        return;
    }

        const objectURL = URL.createObjectURL(icon);
        setPreviewIcon(objectURL);

        return () => {
            URL.revokeObjectURL(objectURL);
        }
    }, [icon]);

    const handleSubmit = async(e) => {
        e.preventDefault();

        const {name, description, category} = userInput;

        console.log(name);
        console.log(description);
        console.log(category);
        console.log(icon);

        if(!name.trim() || !description.trim() || !category.trim()) {
            toast.error("All fields are required!");
            return;
        }

        const formData = new FormData();
        formData.append("name", name.trim());
        formData.append("description", description.trim());
        formData.append("category", category.trim());
        if(icon instanceof File) formData.append("icon", icon);

        const response = await dispatch(editGroup({
            data: formData,
            groupId: groupDetails.groupId
        }));

        if(response?.payload?.success) {
            navigate(-1);
        }
    }


    
    return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-900 to-[#2E2A8C] px-4 py-12">
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-5xl bg-white border border-slate-200 rounded-2xl shadow-[0_25px_40px_-10px_rgba(0,0,0,0.45)] overflow-hidden"
    >
      {/* HEADER */}
      <div className="px-10 pt-8 pb-6 border-b border-slate-200">
        <h1 className="text-2xl font-semibold text-slate-900">
          Edit Group
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your group information for your campus community.
        </p>
      </div>

      {/* BODY */}
      <div className="flex flex-col md:flex-row px-10 py-8 gap-10">

        {/* LEFT: IMAGE */}
        <div className="md:w-1/3 flex flex-col items-center">
          <h3 className="text-sm font-semibold text-slate-700 mb-6">
            Change Group Icon
          </h3>

          <div className="w-44 h-44 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center mb-5">
            {previewIcon ? (
              <img
                src={previewIcon}
                alt="Group icon"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-slate-400 text-sm">
                No image
              </span>
            )}
          </div>

          <label className="cursor-pointer w-full">
            <span className="block text-center px-4 py-2.5 rounded-lg bg-indigo-900 text-white text-sm font-medium hover:bg-indigo-800 transition">
              Change Picture
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={onIconChange}
              hidden
            />
          </label>

          <p className="text-xs text-slate-400 mt-3 text-center">
            Recommended: square image, minimum 300×300 px
          </p>
        </div>

        {/* RIGHT: FORM */}
        <div className="md:w-2/3 flex flex-col gap-6">

          {/* Group Name */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">
              Group Name
              <span className="text-slate-400 font-normal">
                {" "} (public name visible to everyone)
              </span>
            </label>

            <input
              type="text"
              name="name"
              value={userInput.name}
              onChange={onInputChange}
              placeholder="e.g. Campus Web Developers"
              className="border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-900 focus:border-indigo-900 transition"
            />
          </div>

          {/* Category */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">
              Category
              <span className="text-slate-400 font-normal">
                {" "} (helps people discover your group)
              </span>
            </label>

            <input
              type="text"
              name="category"
              value={userInput.category}
              onChange={onInputChange}
              placeholder="e.g. Web Development, AI, College Club"
              className="border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-900 focus:border-indigo-900 transition"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">
              Description
              <span className="text-slate-400 font-normal">
                {" "} (what is this group about?)
              </span>
            </label>

            <textarea
              name="description"
              value={userInput.description}
              onChange={onInputChange}
              placeholder="Write a short description explaining the purpose of this group"
              rows={5}
              className="border border-slate-200 rounded-lg px-4 py-3 text-sm outline-none resize-none focus:ring-2 focus:ring-indigo-900 focus:border-indigo-900 transition"
            />
          </div>

        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="flex justify-end gap-4 px-10 py-6 border-t border-slate-200">

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 transition text-sm"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-7 py-2.5 rounded-lg bg-indigo-900 text-white font-medium hover:bg-indigo-800 transition text-sm shadow-[0_20px_25px_-5px_rgba(0,0,0,0.2)]"
        >
          Save
        </button>

      </div>
    </form>
  </div>
);



}

export default EditGroupPage;