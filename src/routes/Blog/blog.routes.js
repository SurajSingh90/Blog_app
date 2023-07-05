import express from "express";
import * as BlogCtrl from "../../controller/blog.controller";
import { constants as VALIDATION } from "../../constant/validation.js";
import { uservalidation } from "../../validation/users.validation.js";
import * as MiidlewareUser from "../../middleware/Auth";
import multer from "multer";
const routes = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const uploads = multer({
  storage: storage,
}).single("image");
const PATH = {
  BLOG: "/create",
  update: "/updates/:id",
  delete:'/delete/:id',
  getblog:'/getblog',
  favblog:"/favblogcount"
};

routes.post(
  PATH.BLOG,
  multer({
    storage: storage,
    // limits: { fileSize: 1000000 * 5 },
  }).single("image"),
 
  uservalidation(VALIDATION.BLOG),
  MiidlewareUser.verfiytoken,
  BlogCtrl.createblog
);

routes.put(
  PATH.update,
  uploads,
  uservalidation(VALIDATION.BLOG),
  MiidlewareUser.verfiytoken,
  // MiidlewareUser.userBlogid,
  BlogCtrl.updateBlog
);

routes.delete(PATH.delete,MiidlewareUser.verfiytoken,BlogCtrl.deleteBlog)
routes.get(PATH.getblog,MiidlewareUser.verfiytoken,BlogCtrl.getblog)
routes.get(PATH.favblog,MiidlewareUser.verfiytoken, BlogCtrl.addFavblogcount)
export default routes;
