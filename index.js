require("dotenv").config();
require("express-async-errors");
//library
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
const app = express();

//import middleware
const err = require("./middlewares/error-handler");

//import route
const authRouter = require("./routes/userRoute");
const recipeRouter = require("./routes/recipeRoute");
const likeSavedRouter = require("./routes/likeSavedRoute");
const PORT = 5000;

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

//router
app.use("/auth", authRouter);
app.use("/recipe", recipeRouter);
app.use("/likeSaved", likeSavedRouter);
app.use(err);

app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});
