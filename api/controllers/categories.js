const { selectCategories } = require("../models/categories");
exports.getCategories = (req, res, next) => {
  selectCategories()
    .then((categories) => {
      res.send({ categories: categories });
    })
    .catch((err) => {
      next(err);
    });
};
