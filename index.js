require("dotenv").config();
const express = require("express");
const dbConnect = require("./config/DB");
const xssClean = require("xss-clean");
const cookieParser = require("cookie-parser");
const customerRoute = require("./Routes/customer");
const adminRoute = require("./Routes/admin");
const productRoute = require("./Routes/productRoute");
const subCategoryRoute = require("./Routes/subCategoryRoute");
const categoryRoute = require("./Routes/categoryRoute");
const favoriteRoute = require("./Routes/favoriteRoute");
const cartRoute = require("./Routes/cartRoute");
const OrderRoute = require("./Routes/OrderRoute");
const mainPageRoute = require("./Routes/mainPageRoute");
const searchRoute = require("./Routes/search");
const { NotFound, errorHandler } = require("./Middlewares/errorHandler");
const { corsOptions } = require("./config/corsOptions");
const cors = require("cors");
const credentials = require("./Middlewares/credentials");
const app = express();
const querystring = require("querystring");

// Middlewares
app.use(cors(corsOptions));
app.use(credentials);
app.options("*", cors(corsOptions));
app.use((req, res, next) => {
  console.log("Request headers", req.headers);
  next();
});
dbConnect();
app.use(express.json());
app.use(cookieParser());
app.use(
  express.urlencoded({
    extended: true,
    parameterLimit: 10000,
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
    qs: (options) => {
      return querystring.parse(options);
    },
  })
);
app.use((req, res, next) => {
  // Exclude specific routes or parameters from XSS cleaning
  if (req.path === "/search" && req.query && req.query.price) {
    // Do not apply XSS cleaning for the 'price' parameter in the '/search' route
    return next();
  }

  // Apply XSS cleaning for all other routes and parameters
  xssClean()(req, res, next);
});
// Routes
app.use("/user", customerRoute);
app.use("/admin", adminRoute);
app.use("/product", productRoute);
app.use("/search", searchRoute);
app.use("/mainPage", mainPageRoute);
app.use("/subCategory", subCategoryRoute);
app.use("/category", categoryRoute);
app.use("/favorite", favoriteRoute);
app.use("/cart", cartRoute);
app.use("/order", OrderRoute);
app.use("/", (req, res) => {
  res.send("<h1>Welcome To E-Shop Api</h1>");
});
// Error Handling Middleware
app.use(NotFound);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Connected to port ${process.env.PORT}`);
});
module.exports = app;
