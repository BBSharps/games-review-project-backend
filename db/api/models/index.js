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
  review_id,
  review_img_url ,
  category,
  created_at,
  votes, 
  COALESCE((SELECT COUNT(review_id)
FROM comments
WHERE review_id = reviews.review_id),0) AS comment_count
  FROM reviews
  ORDER BY created_at DESC`
    )
    .then((response) => {
      return response.rows;
    });
};
