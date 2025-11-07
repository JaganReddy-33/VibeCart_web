import { useState } from "react";
import { User } from "lucide-react"; // User icon
import toast from "react-hot-toast";

// Helper to show relative time
const timeAgo = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return interval + (interval === 1 ? " year ago" : " years ago");

  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return interval + (interval === 1 ? " month ago" : " months ago");

  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return interval + (interval === 1 ? " day ago" : " days ago");

  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return interval + (interval === 1 ? " hour ago" : " hours ago");

  interval = Math.floor(seconds / 60);
  if (interval >= 1) return interval + (interval === 1 ? " minute ago" : " minutes ago");

  return "Just now";
};

const Reviews = ({ reviews, onAddReview }) => {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !comment || rating === 0) {
      toast.error("Please fill all fields and select a star rating");
      return;
    }
    const newReview = { name, comment, rating, date: new Date().toISOString() };
    onAddReview(newReview);
    setName("");
    setComment("");
    setRating(0);
    setHoverRating(0);
    toast.success("Review added successfully!");
  };

  return (
    <div className="space-y-6 w-full max-w-3xl mx-auto">
      {/* Existing Reviews */}
      <div className="space-y-4">
        {reviews.length === 0 && (
          <p className="text-gray-500 text-center">No reviews yet.</p>
        )}
        {reviews.map((r, i) => (
          <div
            key={i}
            className="border rounded-lg p-4 shadow-sm hover:shadow-lg transition-shadow duration-300 bg-white"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="bg-blue-500 rounded-full p-1.5 flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
                <div>
                  <span className="font-semibold text-gray-800">{r.name}</span>
                  <p className="text-gray-400 text-xs">{timeAgo(r.date)}</p>
                </div>
              </div>
              <div className="flex space-x-1">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <svg
                    key={idx}
                    className={`w-5 h-5 transition-colors duration-300 ${
                      idx < r.rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 15l-5.878 3.09L5.82 12 .94 7.91l6.09-.88L10 2l2.97 5.03 6.09.88-4.88 4.09 1.698 5.09z" />
                  </svg>
                ))}
              </div>
            </div>
            <p className="text-gray-700">{r.comment}</p>
          </div>
        ))}
      </div>

      {/* Add Review Form */}
      <form
        onSubmit={handleSubmit}
        className="border p-6 rounded-lg shadow-md bg-gray-50 space-y-4 transition-all duration-300 hover:shadow-lg"
      >
        <h3 className="font-bold text-xl text-gray-800">Add a Review</h3>

        {/* Star Rating */}
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, idx) => {
            const fill = idx < (hoverRating || rating) ? "text-yellow-400" : "text-gray-300";
            return (
              <button
                type="button"
                key={idx}
                onClick={() => setRating(idx + 1)}
                onMouseEnter={() => setHoverRating(idx + 1)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none transform transition-transform duration-200 hover:scale-110"
              >
                <svg className={`w-7 h-7 ${fill}`} viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 15l-5.878 3.09L5.82 12 .94 7.91l6.09-.88L10 2l2.97 5.03 6.09.88-4.88 4.09 1.698 5.09z" />
                </svg>
              </button>
            );
          })}
        </div>

        {/* Name Input */}
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-300"
          required
        />

        {/* Comment Input */}
        <textarea
          placeholder="Your Review"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-300 resize-none h-28"
          required
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg w-full"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default Reviews;
