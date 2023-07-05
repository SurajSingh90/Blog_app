import Users from "../model/Auth.model";
import jsw from "jsonwebtoken";
import Token from "../config/database.js";
// import Category from "../model/category";
import Blog from "../model/blog.model";
// import mongoose from "mongoose";
// import Favorite from "../model/favorite";
export const verfiytoken = async (req, res, next) => {
  let token = req.headers["authorization"];

  try {
    if (!token) {
      return res.status(404).send({ message: "TOken is missing" });
    }
    token = token.split("Bearer ")[1];
    jsw.verify(token, Token.TokenData, (err, decode) => {
      if (err) {
        return res.status(401).send({ message: "Unauthorized!" });
      } else {
        req.id = decode.id;
        next();
      }
    });
  } catch (err) {
    console.log("the Error is ", err);
    return res.status(500).send({ message: " internal error ", err });
  }
};
export const IsAdmin = async (req, res, next) => {
  const Usersfind = await Users.findOne({ _id: req.id });
  if (Usersfind && Usersfind.usertype == "admin") {
    next();
  } else {
    res.status(403).send({
      message: "Require Admin Role!",
    });
  }
};

export const EmailMiddle = async (req, res, next) => {
  const { email } = req.body;

  try {
    const existingemail = await Users.findOne({ email });
    if (existingemail) {
      return res.status(400).send({ message: "email already in use" });
    }

    next();
  } catch (err) {
    console.error("error iss", err);
    return res.status(500).json({ error: "Internal server error", err });
  }
};

export const userBlogid = async (req, res, next) => {
  const userid = req.id;
  console.log("userid", userid);

  try {
    let id = req.params.id;

    let blog = await Blog.findOne({ _id: id });

    if (!blog) {
      return res.status(404).send({ message: "Blog  not found" });
    }

    if (blog.userId !== userid) {
      return res.status(403).send({
        message:
          "Sorry  You  Can't Update this Blog, Because You Are Unauthorized This Blog",
      });
    }

    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error", err });
  }
};
