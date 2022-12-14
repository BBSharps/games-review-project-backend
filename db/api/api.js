const express = require("express");
const {
  handle500,
  handleCustomErrors,
  handleBadPaths,
} = require("../api/controllers/handleErrors");
const { getCategories, getReviews } = require("./controllers/index");
const app = express();

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviews);

app.use(handleBadPaths);
app.use(handleCustomErrors);
app.use(handle500);

module.exports = { app: app };
