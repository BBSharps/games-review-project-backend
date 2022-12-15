const { app } = require("./api/api");
const { PORT = 1000 } = process.env;

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
