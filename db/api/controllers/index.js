const { selectCategories } = require("../models/index");
exports.getCategories = (req, res, next) => {
  selectCategories()
    .then((categories) => {
      res.send({ categories: categories });
    })
    .catch((err) => {
      next(err);
    });
};
