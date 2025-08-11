const express = require("express");
const app = express();

// General Setup
const corsConfig = require("./config/cors");
app.use(corsConfig);
app.use(express.json());

// Passport Setup
require("./config/passport");

const routes = require("./routes");
const notFoundRoute = require("./middlewares/not-found-route");
const errorHandler = require("./middlewares/error-handler");
app.use("/api", routes.auth);
app.use("/api/posts", routes.post);
app.use("/api/authors", routes.author);

app.use(notFoundRoute);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App listening on PORT : ${PORT}`));
