import { body } from "express-validator";
import { constants as VALIDATOR } from "../constant/validation";

export const uservalidation = (method) => {
  let error = [];
  switch (method) {
    case VALIDATOR.SINGUP: {
      error = [
        body("firstname", "Please enter your first name").not().isEmpty(),
        body("lastname", "Please enter your last name").not().isEmpty(),
        body("password", "Please enter your passwords").not().isEmpty(),

        body("email", "Please enter your email").isEmail().not().isEmpty(),
      ];
      break;
    }
    case VALIDATOR.LOGIN_USER: {
      error = [
        body("password", "Please Enter Passwords").trim().notEmpty(),
        body("email", "Please enter email").isEmail(),
      ];
      break;
    }
    case VALIDATOR.CATEGORY: {
      error = [
        body("categoryName", "Please Enter category Name ").trim().notEmpty(),
      ];
      break;
    }
    case VALIDATOR.Fav: {
      error = [
        body("blogId", "Please Enter blogId ").trim().notEmpty(),
      ];
      break;
    }
    case VALIDATOR.BLOG: {
      error = [
        body("title", "Please enter your title").not().isEmpty(),
        body("description", "Please enter your description").not().isEmpty(),
        body("tags", "Please enter your tags").not().isEmpty(),
        body("categoryId", "Please enter category").not().isEmpty(),
        body("image").custom((value, { req }) => {
          if (!req.file) {
            throw new Error("No file uploaded");
          }
          if (!req.file.mimetype.startsWith("image/")) {
            throw new Error("File must be an image");
          }
          return true;
        }),
      ];
      break;
    }
  }
  return error;
};
