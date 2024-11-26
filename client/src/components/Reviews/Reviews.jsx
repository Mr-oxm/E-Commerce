import { useState, useContext } from 'react';
import { FaStar, FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import routes from '../../constants/routes';
import { AuthContext } from '../../context/AuthContext';

const Reviews = ({ product, onReviewUpdate }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [editingReview, setEditingReview] = useState(null);
  const { user } = useContext(AuthContext);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingReview) {
        await axios.put(routes.review.update(editingReview._id), {
          rating,
          comment
        });
      } else {
        await axios.post(routes.review.create, {
          productId: product._id,
          rating,
          comment
        });
      }
      setRating(5);
      setComment('');
      setEditingReview(null);
      onReviewUpdate();
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setRating(review.rating);
    setComment(review.comment);
  };

  const handleDelete = async (reviewId) => {
    try {
      await axios.delete(routes.review.delete(reviewId));
      onReviewUpdate();
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  return (
    <div className="mt-8 ">
      <h2 className="text-2xl font-bold mb-4">Product Reviews</h2>
      
      {/* Review Form */}
      {user && (
        <form onSubmit={handleSubmit} className="card bg-base-100 p-6 mb-8 !z-10">
        <div className="mb-4">
          <label className="label">
            <span className="label-text">Rating</span>
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="btn btn-ghost btn-sm p-1"
              >
                <FaStar 
                  className={`text-xl ${star <= rating ? 'text-warning' : 'text-base-300'}`} 
                />
              </button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="label">
            <span className="label-text">Comment</span>
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="3"
            required
          />
        </div>
        <div className="flex gap-2">
          <button type="submit" className="btn btn-primary">
            {editingReview ? 'Update Review' : 'Submit Review'}
          </button>
          {editingReview && (
            <button
              type="button"
              onClick={() => {
                setEditingReview(null);
                setRating(5);
                setComment('');
              }}
              className="btn btn-ghost"
            >
              Cancel
            </button>
          )}
          </div>
        </form>
      )}

      {/* Reviews List */}
      {product.ratings.length > 0 ? (
        <div className="space-y-4">
          {product.ratings.map((review) => (
            <div key={review._id} className="card bg-base-100 ">
              <div className="card-body">
                <div className="flex justify-between items-center">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, index) => (
                      <FaStar
                        key={index}
                        className={`${
                          index < review.rating ? 'text-warning' : 'text-base-300'
                        }`}
                      />
                    ))}
                  </div>
                  {user && review.user === user._id && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(review)}
                        className="btn btn-ghost btn-sm"
                        title="Edit review"
                      >
                        <FaEdit className="text-primary" />
                      </button>
                      <button
                        onClick={() => handleDelete(review._id)}
                        className="btn btn-ghost btn-sm"
                        title="Delete review"
                      >
                        <FaTrash className="text-error" />
                      </button>
                    </div>
                  )}
                </div>
                <p className="mt-2">{review.comment}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card bg-base-100 p-6 text-center">
          <p className="text-base-content/70">No reviews yet.</p>
        </div>
      )}
    </div>
  );
};

export default Reviews; 