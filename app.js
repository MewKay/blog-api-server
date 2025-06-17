const express = require("express");
const app = express();

// General Setup
app.use(express.json());

// Passport Setup
require("./config/passport");

const routes = require("./routes");
app.use("/api", routes.auth);
app.use("/api/posts", routes.post);
app.use("/api/authors", routes.author);
app.use("/api/users", routes.user);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App listening on PORT : ${PORT}`));
