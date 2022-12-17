const { removeComment } = require("../models/comments");

exports.deleteComment = (req, res, next) => {
  const comment_id = req.params.comment_id;
  removeComment(comment_id)
    .then((response) => {
      if (response.length === 1) {
        res.status(204).send({});
      } else {
        return Promise.reject({ status: 404, msg: "id not found" });
      }
    })
    .catch((err) => {
      next(err);
    });
};
