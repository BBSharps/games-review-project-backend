const { apiPaths } = require("../models/apiPaths");
exports.getApi = (req, res, next) => {
  apiPaths
    .then((api) => {
      res.status(200).send({ api: api });
    })
    .catch((err) => {
      next(err);
    });
};
