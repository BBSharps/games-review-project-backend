const { response } = require("express");
const db = require("../../db/connection");

exports.selectReviews = (category, sort_by, order) => {
  const querys = [];
  if (sort_by !== undefined) {
    if (["title", "designer", "owner", "category", "votes"].includes(sort_by)) {
      sort_by = sort_by;
    }
  } else {
    sort_by = `reviews.created_at`;
  }
  let reviews = `SELECT 
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
  `;
  let orderByText = `GROUP BY reviews.review_id 
  ORDER BY ${sort_by}`;
  if (category !== undefined) {
    reviews += ` WHERE category = $1`;
    querys.push(category);
  }
  if (order === "asc") {
    reviews += orderByText += ` ASC`;
  } else {
    reviews += orderByText += ` DESC`;
  }

  return db.query(reviews, querys).then((reviews) => {
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
exports.newComment = (review_id, author, body) => {
  let date = new Date();
  return db
    .query(
      `INSERT INTO comments (body,votes,author,review_id,created_at)
        VALUES
        ($3,0,$2,$1,$4) RETURNING *`,
      [review_id, author, body, date]
    )
    .then((res) => {
      return res.rows[0];
    });
};
exports.increaseVote = (review_id, votes) => {
  return db
    .query(
      `UPDATE reviews
        SET votes = votes + $2
        WHERE review_id = $1
        RETURNING *`,
      [review_id, votes]
    )
    .then((res) => {
      return res.rows[0];
    });
};
