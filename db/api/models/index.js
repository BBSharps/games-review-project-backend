const { response } = require("express");
const db = require("../../connection");

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
  COALESCE((SELECT COUNT(review_id)
FROM comments
WHERE review_id = reviews.review_id),0) AS comment_count
  FROM reviews
  LEFT JOIN comments ON reviews.review_id = comments.review_id
  GROUP BY reviews.review_id
  ORDER BY reviews.created_at DESC`
    )
    .then((response) => {
      return response.rows;
    });
};
