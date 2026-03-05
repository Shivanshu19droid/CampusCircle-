import { createPost } from "../../../Redux/Slices/postSlice";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";

function CreatePostPage() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { state } = useLocation();

    const groupId = state?.groupId;
    const groupName = state?.groupName;
    const groupIcon = state?.groupIcon?.secure_url;

    const isGroupPost = Boolean(groupId);

    const [content, setContent] = useState("");
    const [image, setImage] = useState(null);

    const onContentChange = (e) => {
        setContent(e.target.value);
    }

    const onImageChange = (e) => {
        const file = e.target.files[0];
        if(!file) return;
        setImage(file);
    }

    //image preview
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        if(!image) {
            setPreviewImage(null);
            return;
        }

        const objectURL = URL.createObjectURL(image);
        setPreviewImage(objectURL);

        return () => {
            URL.revokeObjectURL(objectURL);
        }
    }, [image]);

    const handleSubmit = async(e) => {

        e.preventDefault();

        if(!content.trim() && !image) {
            toast.error("You cannot create an empty post!");
            return;
        }

        const formData = new FormData();
        if(content.trim()) formData.append("content", content.trim());
        if(image) formData.append("postImage", image);
        if(groupId) formData.append("groupId", groupId);

        const response = await dispatch(createPost(formData));

        if(response?.payload?.success) {
            navigate("/community");
        }

    }

    //handling page access
    const user = useSelector((state) => state.auth.data);

    const isAccessAllowed = (groupId && !user?.groups?.some(id => id === groupId)) ? false : true;

    useEffect(() => {
        if(!isAccessAllowed) {
            toast.error("You must be a member to post in a group!");
            navigate("/community");
        }
    }, [isAccessAllowed, navigate]);

  return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 to-[#2E2A8C] px-4 py-12">
    <form
      onSubmit={handleSubmit}
      className="
        w-full
        max-w-6xl
        bg-white
        rounded-2xl
        border border-slate-200
        shadow-[0_25px_40px_-10px_rgba(0,0,0,0.4)]
        overflow-hidden
        flex
        flex-col
        md:flex-row
        transition-all duration-200
      "
    >
      {/* ---------- IMAGE PANEL ---------- */}
      <div
        className="
          w-full
          md:w-1/2
          bg-slate-50
          border-b
          md:border-b-0
          md:border-r
          border-slate-200
          flex
          items-center
          justify-center
          relative
          min-h-[260px]
          md:min-h-[520px]
        "
      >
        {!previewImage ? (
          <label className="cursor-pointer flex flex-col items-center text-slate-400 hover:text-indigo-900 transition duration-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 16l4-4a3 3 0 014 0l4 4m0 0l4-4a3 3 0 014 0m-8-8h.01M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>

            <span className="mt-3 text-sm font-medium">
              Upload Image
            </span>

            <input
              type="file"
              accept="image/*"
              hidden
              onChange={onImageChange}
            />
          </label>
        ) : (
          <img
            src={previewImage}
            alt="Post preview"
            className="w-full h-full object-contain"
          />
        )}
      </div>

      {/* ---------- CONTENT PANEL ---------- */}
      <div
        className="
          w-full
          md:w-1/2
          px-6
          sm:px-8
          py-6
          sm:py-8
          flex
          flex-col
        "
      >
        {/* Posting Context */}
        <div className="flex items-center gap-3 mb-6">
          {isGroupPost ? (
            <>
              {groupIcon && (
                <img
                  src={groupIcon}
                  alt={groupName}
                  className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                />
              )}
              <span className="text-sm text-slate-600">
                Posting to{" "}
                <span className="font-semibold text-slate-900">
                  {groupName}
                </span>
              </span>
            </>
          ) : (
            <span className="text-sm text-slate-500">
              Posting individually
            </span>
          )}
        </div>

        {/* Content Input */}
        <textarea
          value={content}
          onChange={onContentChange}
          placeholder="What do you want to share?"
          className="
            flex-1
            resize-none
            rounded-lg
            border border-slate-200
            bg-white
            px-4
            py-3
            text-sm
            text-slate-800
            placeholder-slate-400
            focus:outline-none
            focus:ring-2
            focus:ring-indigo-900
            focus:border-indigo-900
            transition duration-200
          "
        />

        {/* Footer */}
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            disabled={!content.trim() && !image}
            className="
              px-8
              py-2.5
              text-sm
              font-medium
              rounded-lg
              bg-indigo-900
              text-white
              hover:bg-indigo-800
              transition duration-200
              disabled:opacity-50
              disabled:cursor-not-allowed
              shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1)]
            "
          >
            Post
          </button>
        </div>
      </div>
    </form>
  </div>
);



}

export default CreatePostPage;