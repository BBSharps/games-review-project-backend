exports.handleBadPaths = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "bad request" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "not a valid input" });
  } else if (err.code === "23502") {
    res.status(400).send({ msg: "missing information in POST request" });
  } else if (err.code === "42703") {
    res.status(400).send({ msg: "not a valid input" });
  } else {
    next(err);
  }
};
exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handle500 = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "server error" });
};
