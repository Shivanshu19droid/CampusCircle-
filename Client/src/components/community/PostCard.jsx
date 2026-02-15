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
  <>
    {/* ================= MOBILE ================= */}
    <div
      className="lg:hidden bg-white rounded-[24px] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] active:scale-[0.99] transition-transform duration-150 cursor-pointer"
      onClick={() => navigateToPost(post._id)}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <img
          src={avatarUrl}
          alt={authorName}
          className="w-10 h-10 rounded-full object-cover"
        />

        <div className="min-w-0">
          <span className="font-semibold text-sm text-gray-800 truncate block">
            {authorName}
          </span>

          <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5">
            {groupName && (
              <>
                <span className="text-[#064E3B] font-medium truncate">
                  {groupName}
                </span>
                <span className="text-gray-300">•</span>
              </>
            )}
            <span>{timeAgo}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      {content && (
        <p className="mt-3 text-sm text-gray-700 whitespace-pre-line leading-relaxed">
          {content}
        </p>
      )}

      {/* Image */}
      {imageUrl && (
        <div className="mt-3 overflow-hidden rounded-[18px]">
          <img
            src={imageUrl}
            alt="Post"
            className="w-full max-h-[400px] object-cover"
          />
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
        <div
          className="flex items-center gap-2 py-2"
          onClick={(e) => {
            e.stopPropagation();
            onLike(post._id);
          }}
        >
          {isLiked ? (
            <Heart
              size={20}
              className="text-[#FF6B35] fill-[#FF6B35]"
            />
          ) : (
            <Heart size={20} className="text-gray-500" />
          )}
          <span>{post.likes?.length || 0}</span>
        </div>

        <div
          className="flex items-center gap-2 py-2"
          onClick={(e) => {
            e.stopPropagation();
            navigateToComments(post._id);
          }}
        >
          <MessageCircle size={20} className="text-gray-500" />
          <span>{post.comments?.length || 0}</span>
        </div>
      </div>
    </div>

    {/* ================= DESKTOP ================= */}
    <div
      className="hidden lg:block bg-white rounded-[24px] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:scale-[1.01] transition-transform duration-200 cursor-pointer"
      onClick={() => navigateToPost(post._id)}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <img
          src={avatarUrl}
          alt={authorName}
          className="w-11 h-11 rounded-full object-cover"
        />

        <div>
          <span className="font-semibold text-gray-800">
            {authorName}
          </span>

          <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
            {groupName && (
              <>
                <span className="text-[#064E3B] font-medium">
                  {groupName}
                </span>
                <span className="text-gray-300">•</span>
              </>
            )}
            <span>{timeAgo}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      {content && (
        <p className="mt-4 text-gray-700 whitespace-pre-line leading-relaxed">
          {content}
        </p>
      )}

      {/* Image */}
      {imageUrl && (
        <div className="mt-4 overflow-hidden rounded-[20px]">
          <img
            src={imageUrl}
            alt="Post"
            className="w-full max-h-[500px] object-cover"
          />
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-5 text-sm text-gray-600">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onLike(post._id);
          }}
        >
          {isLiked ? (
            <Heart
              size={20}
              className="text-[#FF6B35] fill-[#FF6B35] hover:scale-110 transition-transform"
            />
          ) : (
            <Heart
              size={20}
              className="text-gray-500 hover:scale-110 transition-transform"
            />
          )}
          <span>{post.likes?.length || 0}</span>
        </div>

        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            navigateToComments(post._id);
          }}
        >
          <MessageCircle
            size={20}
            className="text-gray-500 hover:scale-110 transition-transform"
          />
          <span>{post.comments?.length || 0}</span>
        </div>
      </div>
    </div>
  </>
);


}


export default PostCard;