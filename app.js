const express = require("express");
const app = express();

// General Setup
app.use(express.json());

const routes = require("./routes");
app.use("/api/posts", routes.post);
app.use("/api/authors", routes.author);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App listening on PORT : ${PORT}`));
