import express from "express";
import * as FavoriteCtrl from "../../controller/favoriteBlog";
import { constants as VALIDATION } from "../../constant/validation.js";
import { uservalidation } from "../../validation/users.validation.js";
import * as MiidlewareUser from "../../middleware/Auth";
const routes = express.Router();

const PATH = {
  Favorite: "/create",
  unfavorite:'/unfavorite/blog/:id'
};

routes.post(
  PATH.Favorite,
  uservalidation(VALIDATION.Fav),
  MiidlewareUser.verfiytoken,
  FavoriteCtrl.createfavorite
);
// routes.get(PATH.unfavorite, MiidlewareUser.verfiytoken,FavoriteCtrl.unfavorites)
export default routes;
