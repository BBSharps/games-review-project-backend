const {
  selectCategories,
  selectReviews,
  selectReviewComments,
} = require("../models/index");
exports.getCategories = (req, res, next) => {
  selectCategories()
    .then((categories) => {
      res.send({ categories: categories });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviews = (req, res, next) => {
  const review_id = req.params.review_id;
  selectReviews(review_id)
    .then((reviews) => {
      if (reviews.length === 0) {
        return Promise.reject({ status: 404, msg: "not a valid id" });
      } else {
        res.send({ reviews: reviews });
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviewIdComments = (req, res, next) => {
  const review_id = req.params.review_id;
  Promise.all([selectReviews(review_id), selectReviewComments(review_id)])
    .then((results) => {
      if (results[0].length === 0)
        return Promise.reject({ status: 404, msg: "not a valid id" });
      const validComments = results[1].filter((comment) => {
        if (comment.comment_id !== null) return comment;
      });
      res.send({ comments: validComments });
    })
    .catch((err) => {
      next(err);
    });
};
