exports.handle404 = (req, res, next) => {
  res.status(404).send({ msg: "Path not found" });
};

exports.handle500 = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "server error" });
};

exports.handle400 = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "not a valid request" });
  } else {
    next(err);
  }
};
