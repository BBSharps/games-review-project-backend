const { response } = require("express");
const db = require("../../connection");

exports.selectCategories = () => {
  return db.query(`SELECT * FROM categories`).then((response) => {
    return response.rows;
  });
};

exports.selectReviews = (review_id) => {
  const select = [];
  let allReviews = `SELECT 
  title,
  designer,
  owner,
  reviews.review_id,
  review_img_url ,
  category,
  reviews.created_at,
  reviews.votes, `;
  let comment_count = ` COALESCE((SELECT COUNT(review_id)
  FROM comments
  WHERE review_id = reviews.review_id),0) AS comment_count FROM reviews
  LEFT JOIN comments ON reviews.review_id = comments.review_id
  GROUP BY reviews.review_id
  ORDER BY reviews.created_at DESC`;
  let selectReviewId = `review_body
  FROM reviews 
   WHERE review_id = $1`;
  if (review_id != undefined) {
    select.push(review_id);
    allReviews += selectReviewId;
  } else {
    allReviews += comment_count;
  }

  return db.query(allReviews, select).then((response) => {
    return response.rows;
  });
};
