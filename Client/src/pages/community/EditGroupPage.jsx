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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-5xl bg-white border border-gray-200 rounded-2xl p-10 flex gap-12"
        >
            {/* LEFT: ICON */}
            <div className="w-1/3 flex flex-col items-center gap-6">
                <div className="w-44 h-44 rounded-full overflow-hidden border border-gray-300 bg-gray-100 flex items-center justify-center">
                    {previewIcon ? (
                        <img
                            src={previewIcon}
                            alt="Group icon"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-gray-400 text-sm">
                            No image
                        </span>
                    )}
                </div>

                <label className="cursor-pointer text-sm font-medium text-blue-600 hover:underline">
                    Upload / Change icon
                    <input
                        type="file"
                        accept="image/*"
                        onChange={onIconChange}
                        hidden
                    />
                </label>

                <p className="text-xs text-gray-500 text-center">
                    Recommended: square image, minimum 300×300 px
                </p>
            </div>

            {/* RIGHT: FORM FIELDS */}
            <div className="w-2/3 flex flex-col gap-6">
                {/* Group Name */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-700">
                        Group Name
                        <span className="text-gray-400 font-normal">
                            {" "} (public name visible to everyone)
                        </span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={userInput.name}
                        onChange={onInputChange}
                        placeholder="e.g. Campus Web Developers"
                        className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500"
                    />
                </div>

                {/* Category */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-700">
                        Category
                        <span className="text-gray-400 font-normal">
                            {" "} (helps people discover your group)
                        </span>
                    </label>
                    <input
                        type="text"
                        name="category"
                        value={userInput.category}
                        onChange={onInputChange}
                        placeholder="e.g. Web Development, AI, College Club"
                        className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500"
                    />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-700">
                        Description
                        <span className="text-gray-400 font-normal">
                            {" "} (what is this group about?)
                        </span>
                    </label>
                    <textarea
                        name="description"
                        value={userInput.description}
                        onChange={onInputChange}
                        placeholder="Write a short description explaining the purpose of this group"
                        rows={5}
                        className="border border-gray-300 rounded-lg px-4 py-3 outline-none resize-none focus:border-blue-500"
                    />
                </div>

                {/* ACTIONS */}
                <div className="mt-4 flex gap-4">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-6 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="px-7 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                    >
                        Save changes
                    </button>
                </div>
            </div>
        </form>
    </div>
);



}

export default EditGroupPage;