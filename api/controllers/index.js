const {
  selectCategories,
  selectReviews,
  selectReviewId,
  selectReviewComments,
  newComment,
  increaseVote,
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
  selectReviews()
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
exports.getReviewId = (req, res, next) => {
  const review_id = req.params.review_id;
  selectReviewId(review_id)
    .then((reviewId) => {
      if (reviewId.length === 0) {
        return Promise.reject({ status: 404, msg: "not a valid id" });
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
        return Promise.reject({ status: 404, msg: "not a valid id" });
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
      console.log(err);
      next(err);
    });
};
exports.postReviewVote = (req, res, next) => {
  const votes = req.body.inc_votes;
  const review_id = req.params.review_id;
  increaseVote(review_id, votes)
    .then((reviewVote) => {
      if (reviewVote === undefined)
        return Promise.reject({ status: 404, msg: "not a valid id" });
      res.send({ reviewVote: reviewVote });
    })
    .catch((err) => {
      next(err);
    });
};
