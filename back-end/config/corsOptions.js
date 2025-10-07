// config/corsOptions.js
const cors = require("cors");

const allowedOrigins = [
  "https://vodaphone.netlify.app",
  /\.netlify\.app$/,
  "http://localhost:3000",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // autorise Postman ou Render pings
    const isAllowed = allowedOrigins.some((o) =>
      typeof o === "string" ? o === origin : o.test(origin)
    );
    callback(null, isAllowed);
  },
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

module.exports = cors(corsOptions);
