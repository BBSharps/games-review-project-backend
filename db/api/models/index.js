const { response } = require("express");
const db = require("../../connection");

exports.selectCategories = () => {
  return db.query(`SELECT * FROM categories`).then((response) => {
    return response.rows;
  });
};

exports.selectReviews = () => {
  return db.query(`SELECT * FROM reviews`).then((response) => {
    return response.rows;
  });
};
