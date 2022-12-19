const categories = require("../../db/data/test-data/categories");
const { selectCategories } = require("../models/categories");
const {
  selectReviews,
  selectReviewId,
  selectReviewComments,
  newComment,
  increaseVote,
} = require("../models/reviews");

exports.getReviews = (req, res, next) => {
  const category = req.query.category;
  const sort_by = req.query.sorted_by;
  const order = req.query.order;
  Promise.all([selectCategories(), selectReviews(category, sort_by, order)])
    .then((reviews) => {
      const categoriesCheck = reviews[0].filter((categoryCheck) => {
        return categoryCheck.slug === category;
      });
      if (categoriesCheck.length === 0 && category !== undefined) {
        return Promise.reject({ status: 400, msg: "bad request" });
      }
      res.send({ reviews: reviews[1] });
    })
    .catch((err) => {
      next(err);
    });
};
exports.getReviewId = (req, res, next) => {
  const review_id = req.params.review_id;
  selectReviewId(review_id)
    .then((reviewId) => {
      if (reviewId.length === 0) {
        return Promise.reject({ status: 404, msg: "id not found" });
      } else {
        res.send({ reviewId: reviewId[0] });
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviewIdComments = (req, res, next) => {
  const review_id = req.params.review_id;
  Promise.all([selectReviewId(review_id), selectReviewComments(review_id)])
    .then((results) => {
      if (results[0].length === 0)
        return Promise.reject({ status: 404, msg: "id not found" });
      res.send({ comments: results[1] });
    })
    .catch((err) => {
      next(err);
    });
};
exports.postComment = (req, res, next) => {
  const author = req.body.userName;
  const body = req.body.body;
  const review_id = req.params.review_id;
  newComment(review_id, author, body)
    .then((results) => {
      res.status(201).send({ comment: results });
    })
    .catch((err) => {
      next(err);
    });
};
exports.patchReviewVote = (req, res, next) => {
  const votes = req.body.inc_votes;
  const review_id = req.params.review_id;
  increaseVote(review_id, votes)
    .then((reviewVote) => {
      if (reviewVote === undefined)
        return Promise.reject({ status: 404, msg: "id not found" });
      res.send({ reviewVote: reviewVote });
    })
    .catch((err) => {
      next(err);
    });
};
