const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello server!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App listening on PORT : ${PORT}`));
