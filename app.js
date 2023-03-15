require("dotenv").config();
const express = require("express");
const app = express();
require("express-async-errors");
const connectDB = require("./db/connection");
const products = require("./routes/product");
const notFound = require("./middlewares/not-found");
const errorHandlerMiddleware = require("./middlewares/errorHandler");

const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
//route
app.use("/api/v1/products", products);
app.use(notFound);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`server start on port: ${PORT}`);
    });
  } catch (error) {}
};
start();
