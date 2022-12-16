const express = require("express");
const {
  handle500,
  handleCustomErrors,
  handleBadPaths,
} = require("./controllers/handleErrors");
const {
  getReviews,
  getReviewId,
  getReviewIdComments,
  postComment,
  patchReviewVote,
} = require("./controllers/reviews");
const { getCategories } = require("./controllers/categories");
const app = express();
app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewId);
app.get("/api/reviews/:review_id/comments", getReviewIdComments);

app.post("/api/reviews/:review_id/comments", postComment);

app.patch("/api/reviews/:review_id", patchReviewVote);

app.use(handleBadPaths);
app.use(handleCustomErrors);
app.use(handle500);

module.exports = { app: app };
