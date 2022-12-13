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
      `SELECT  title,
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
  FROM reviews`
    )
    .then((response) => {
      return response.rows;
    });
};
