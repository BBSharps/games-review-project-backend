const { response } = require("express");
const db = require("../../db/connection");

exports.selectCategories = () => {
  return db.query(`SELECT * FROM categories`).then((response) => {
    return response.rows;
  });
};

exports.selectReviews = () => {
  return db
    .query(
      `SELECT 
  title,
  designer,
  owner,
  reviews.review_id,
  review_img_url ,
  category,
  reviews.created_at,
  reviews.votes,
 (SELECT COUNT(comment_id) 
  FROM comments
  WHERE review_id = reviews.review_id) AS comment_count FROM reviews
  LEFT JOIN comments ON reviews.review_id = comments.review_id
  GROUP BY reviews.review_id
  ORDER BY reviews.created_at DESC`
    )
    .then((reviews) => {
      return reviews.rows;
    });
};
exports.selectReviewId = (review_id) => {
  return db
    .query(
      `SELECT 
  title,
  designer,
  owner,
  reviews.review_id,
  review_img_url ,
  category,
  reviews.created_at,
  reviews.votes,review_body
  FROM reviews 
  WHERE review_id = $1 `,
      [review_id]
    )
    .then((review) => {
      return review.rows;
    });
};

exports.selectReviewComments = (review_id) => {
  return db
    .query(
      `SELECT comment_id,comments.votes,comments.created_at,author,body, comments.review_id FROM comments
    WHERE review_id = $1
  ORDER BY created_at DESC
 `,
      [review_id]
    )
    .then((comments) => {
      return comments.rows;
    });
};
