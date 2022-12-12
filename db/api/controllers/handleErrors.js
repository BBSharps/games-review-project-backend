exports.handle404 = (req, res, next) => {
  console.log("in 404");
  res.status(404).send({ msg: "Path not found" });
};

exports.handle500 = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "server error" });
};
