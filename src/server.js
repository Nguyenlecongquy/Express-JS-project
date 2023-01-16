import express from "express";
import configViewEngine from "./configs/viewEngine";
import initWebRoute from "./route/web";
import initAPIRoute from "./route/api";
require("dotenv").config();
import morgan from "morgan";

const app = express();
const port = process.env.PORT || 3107;

//middleware to parse JSON data from request
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//logging middleware
app.use(morgan("dev"));

//configure view engine
configViewEngine(app);

//init web route
initWebRoute(app);

//init api route
initAPIRoute(app);

//handle 404 not found
app.use((req, res, next) => {
  return res.send("404 not found!");
});

app.listen(port, () => {
  console.log(
    `ExpressJS Users Management app listening at http://localhost:${port}`
  );
});
