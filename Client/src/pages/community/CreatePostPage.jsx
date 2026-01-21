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
  <div className="min-h-screen backdrop-blur-sm flex justify-center px-3 sm:px-4 pt-6 sm:pt-12">
    <form
      onSubmit={handleSubmit}
      className="
        w-full
        max-w-6xl
        bg-white
        rounded-2xl
        shadow-lg
        overflow-hidden
        flex
        flex-col
        md:flex-row
        md:min-h-[75vh]
      "
    >
      {/* ---------- IMAGE UPLOAD ---------- */}
      <div
        className="
          w-full
          md:w-1/2
          h-56
          sm:h-72
          md:h-auto
          bg-gray-50
          flex
          items-center
          justify-center
          relative
        "
      >
        {!previewImage ? (
          <label className="cursor-pointer flex flex-col items-center text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 sm:h-12 sm:w-12"
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
            <span className="mt-2 text-sm">Upload image</span>
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
            className="
              w-full
              h-full
              object-contain
              md:object-contain
            "
          />
        )}
      </div>

      {/* ---------- CONTENT ---------- */}
      <div
        className="
          w-full
          md:w-1/2
          p-4
          sm:p-6
          md:p-8
          flex
          flex-col
        "
      >
        {/* Posting context */}
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          {isGroupPost ? (
            <>
              {groupIcon && (
                <img
                  src={groupIcon}
                  alt={groupName}
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-md object-cover"
                />
              )}
              <span className="text-sm text-gray-600">
                Posting to <span className="font-medium">{groupName}</span>
              </span>
            </>
          ) : (
            <span className="text-sm text-gray-500">
              Posting individually
            </span>
          )}
        </div>

        {/* Content input */}
        <textarea
          value={content}
          onChange={onContentChange}
          placeholder="What do you want to share?"
          className="
            flex-1
            resize-none
            border
            rounded-lg
            p-3
            sm:p-4
            text-sm
            sm:text-base
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
          "
        />

        {/* Submit button */}
        <div className="flex justify-end mt-4 sm:mt-6">
          <button
            type="submit"
            disabled={!content.trim() && !image}
            className="
              px-6
              sm:px-8
              py-2
              sm:py-2.5
              bg-blue-600
              text-white
              rounded-lg
              hover:bg-blue-700
              transition
              disabled:opacity-50
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