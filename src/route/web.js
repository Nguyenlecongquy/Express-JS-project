import express from "express";
import homeController from "../controller/homeController";

let router = express.Router();

const initWebRoute = (app) => {
  router.get("/", homeController.getHomePage);
  router.get("/detail/users/:id", homeController.getDetailPage);
  router.post("/create-new-user", homeController.createNewUser);

  return app.use("/", router);
};

export default initWebRoute;
