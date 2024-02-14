const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://e-shop123.web.app/",
  "https://e-shop-admin1.web.app/",
];
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      callback(null, true);
    } else if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not Allowed by Cors"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
module.exports = {
  allowedOrigins,
  corsOptions,
};
