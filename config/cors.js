const cors = require("cors");
require("dotenv").config();

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");

const corsConfig = cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

module.exports = corsConfig;
