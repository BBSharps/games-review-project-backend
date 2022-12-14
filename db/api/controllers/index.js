const { selectCategories, selectReviews } = require("../models/index");
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
        return Promise.reject({ status: 400, msg: "not a valid id" });
      } else {
        res.send({ reviews: reviews });
      }
    })
    .catch((err) => {
      next(err);
    });
};
