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
        res.status(400).send({ msg: "review_id not found" });
      } else {
        res.send({ reviews: reviews });
      }
    })
    .catch((err) => {
      next(err);
    });
};
