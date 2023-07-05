import express from "express";
import * as CategoryCtrl from "../../controller/category.controller";
import { constants as VALIDATION } from "../../constant/validation.js";
import { uservalidation } from "../../validation/users.validation.js";
import * as MiidlewareUser from "../../middleware/Auth";
const routes = express.Router();

const PATH = {
  CATEGOREY: "/create",
  Getcategorey: "/getcategorey",
  UpdateCategorey: "/update/:id",
  Blogcount: "/blogcount",
  Delete: "/d/:id",
};
routes.post(
  PATH.CATEGOREY,
  MiidlewareUser.verfiytoken,
  MiidlewareUser.IsAdmin,
  uservalidation(VALIDATION.CATEGORY),
  CategoryCtrl.Categorycreate
);
// routes.get(
//   PATH.Getcategorey,
//   MiidlewareUser.verfiytoken,
//   MiidlewareUser.IsAdmin,
//   CategoryCtrl.getcategries
// );
routes.put(
  PATH.UpdateCategorey,
  MiidlewareUser.verfiytoken,
  MiidlewareUser.IsAdmin,
  uservalidation(VALIDATION.CATEGORY),
  CategoryCtrl.updateCategories
);

routes.get(
  PATH.Blogcount,
  MiidlewareUser.verfiytoken,
  MiidlewareUser.IsAdmin,
  CategoryCtrl.addblogcount
);
routes.delete(
  PATH.Delete,
  MiidlewareUser.verfiytoken,
  MiidlewareUser.IsAdmin,
  CategoryCtrl.categoryDeleteAggregation
);

export default routes;
