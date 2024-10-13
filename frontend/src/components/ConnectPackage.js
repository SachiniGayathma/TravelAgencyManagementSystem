import React, { useState } from 'react';
import "./ConnectPackage.css";

const ConnectPackage = () => {

    const [reviews, setReviews] = useState([
        { name: 'John Doe', rating: 5, comment: 'Amazing experience!' },
        { name: 'Jane Smith', rating: 4, comment: 'Great tour, but the hotel could be better.' }
    ]);
    const [newReview, setNewReview] = useState({ name: '', rating: '', comment: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newReview.name && newReview.rating && newReview.comment) {
            setReviews([...reviews, newReview]);
            setNewReview({ name: '', rating: '', comment: '' }); // Reset the form
        } else {
            alert('Please fill out all fields!');
        }
    };

    const handleRatingChange = (rating) => {
        setNewReview({ ...newReview, rating });
    };

    const handleDelete = (index) => {
        const updatedReviews = reviews.filter((_, i) => i !== index);
        setReviews(updatedReviews);
    };

    return (
        <div className="dennycomment-reviews-container">
            <h2>Package Reviews and Ratings</h2>

            {/* Display Reviews */}
            <div className="dennycomment-reviews-list">
                {reviews.map((review, index) => (
                    <div key={index} className="dennycomment-review-item">
                        <h4>{review.name}</h4>
                        <p>Rating: {review.rating} / 5</p>
                        <p>{review.comment}</p>
                        <button onClick={() => handleDelete(index)} className='dennycomment-delete-btn'>Delete</button>
                    </div>
                ))}
            </div>

            {/* Add Review Form */}
            <div className="dennycomment-add-review">
                <h3>Add Your Review</h3>
                <form onSubmit={handleSubmit}>
                    <input
                        className='dennycomment-inptr'
                        type="text"
                        placeholder="Your Name"
                        value={newReview.name}
                        onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                    />
                    <div className="dennycomment-rating">
                        <p>Rating:</p>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span 
                                key={star}
                                className={`dennycomment-star ${newReview.rating >= star ? 'dennycomment-filled' : ''}`}
                                onClick={() => handleRatingChange(star)}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                    <textarea
                        placeholder="Your Comment"
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    />
                    <button type="submit" className='dennycomment-btnr'>Submit Review</button>
                </form>
            </div>
        </div>
    );
};

export default ConnectPackage;
