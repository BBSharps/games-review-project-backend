const express = require("express");
const { handle500, handle404 } = require("../api/controllers/handleErrors");
const { getCategories } = require("./controllers/index");
const app = express();

app.get("/api/categories", getCategories);

app.all("*", handle404);
app.use(handle500);
module.exports = { app: app };
