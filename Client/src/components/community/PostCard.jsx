import { Heart, MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useSelector } from "react-redux";

function PostCard({ post, onLike, navigateToPost, navigateToComments }) {
  //these functions are passed as props and will be defined inside the parent component

  const authorName = post?.author?.fullName;
  const avatarUrl = post?.author?.avatar?.secure_url;
  const groupName = post?.group?.name;
  const imageUrl = post?.image?.secure_url;
  const content = post?.content;

  const user_id = useSelector((state) => state?.auth?.data?._id);

  const timeAgo = post?.createdAt
    ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
    : "";

  const isLiked = post.likes?.includes(user_id);

  return (
    <div
      className="border rounded-xl bg-white p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
      onClick={() => navigateToPost(post._id)} // MAIN CARD CLICK
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <img
          src={avatarUrl}
          alt={authorName}
          className="w-10 h-10 rounded-full object-cover"
        />

        <div>
          <span className="font-semibold text-gray-800">{authorName}</span>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            {groupName && (
              <>
                <span>{groupName}</span>
                <span className="text-gray-400">•</span>
              </>
            )}
            <span>{timeAgo}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      {content && (
        <p className="mt-3 text-gray-700 whitespace-pre-line leading-relaxed">
          {content}
        </p>
      )}

      {/* Image */}
      {imageUrl && (
        <div className="mt-3">
          <img
            src={imageUrl}
            alt="Post"
            className="rounded-lg w-full max-h-[500px] object-cover border"
          />
        </div>
      )}

      {/* Footer (Like / Comment) */}
      <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
        {/* ❤️ LIKE BUTTON */}
        <div
          className="flex items-center gap-1 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation(); // prevents navigation
            onLike(post._id); // triggers like toggle
          }}
        >
          {isLiked ? (
            <Heart
              size={20}
              className="text-red-500 fill-red-500 transition-transform hover:scale-110"
            />
          ) : (
            <Heart
              size={20}
              className="text-gray-600 hover:scale-110 transition-transform"
            />
          )}
          <span>{post.likes?.length || 0}</span>
        </div>

        {/* 💬 COMMENT BUTTON */}
        <div
          className="flex items-center gap-1 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation(); // don’t open full card
            navigateToComments(post._id); // go directly to comment section
          }}
        >
          <MessageCircle
            size={20}
            className="text-gray-600 hover:scale-110 transition-transform"
          />
          <span>{post.comments?.length || 0}</span>
        </div>
      </div>
    </div>
  );
}


export default PostCard;