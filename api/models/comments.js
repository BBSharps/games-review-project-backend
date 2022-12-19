const { response } = require("express");
const db = require("../../db/connection");

exports.removeComment = (comment_id) => {
  return db
    .query(
      `DELETE FROM comments 
WHERE comment_id = $1 RETURNING  *`,
      [comment_id]
    )
    .then((response) => {
      return response.rows;
    });
};
