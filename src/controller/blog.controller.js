import Blog from "../model/blog.model";
import mongoose from "mongoose";
import { validationResult } from "express-validator";
import cloudinary from "cloudinary";
import Category from "../model/category";
cloudinary.config({
  cloud_name: "dzidawevj",
  api_key: "745231798445212",
  api_secret: "RU_ekzheCagO1QErVCps5P2C038",
});

export const createblog = async (req, res) => {
  const errors = validationResult(req);

  console.log("errors===============", errors.array());
  if (!errors.isEmpty()) {
    return res.json({
      message: errors.array()[0].msg,
    });
  }
  let blogobj = {
    title: req.body.title,
    description: req.body.description,
    userId: req.id,
    image: req.file.path,
    tags: req.body.tags,
    categoryId: req.body.categoryId,
  };
  try {
     
      let imageUrl = await cloudinary.v2.uploader.upload(blogobj.image);
      blogobj.image = imageUrl.secure_url;

      const titlefinde = await Blog.findOne({ title: blogobj.title });
      if (titlefinde) {
        return res.status(403).json({ msg: "Title Allready use" });
      }
      const isValidObjectId = mongoose.Types.ObjectId.isValid(
        blogobj.categoryId
      );

      if (!isValidObjectId) {
        return res.status(404).json({ msg: "Invalid category ID" });
      }

      const categoryIdFind = await Category.findOne({
        _id: blogobj.categoryId,
      });

      if (!categoryIdFind) {
        return res.status(404).json({ msg: "Category not found" });
      }

      const result = await Blog.create(blogobj);
      res.send(result);
    
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "internal error", err });
  }
};

export const updateBlog = async (req, res) => {
  const errors = validationResult(req);

  console.log("errors===============", errors.array());
  let id = req.params.id;
  console.log("iddddddddddd", id);
  try {
    const isValidBlogId = mongoose.Types.ObjectId.isValid(id);

    if (!isValidBlogId) {
      return res.status(404).json({ msg: "Invalid Blog ID" });
    }

    const blogData = await Blog.findOne({
      _id: id,
    });

    if (!blogData) {
      return res.status(404).json({ msg: "Blog not found" });
    }

    if (!errors.isEmpty()) {
      return res.json({
        message: errors.array()[0].msg,
      });
    }

    blogData.title = req.body.title ? req.body.title : blogData.title;
    blogData.description = req.body.description
      ? req.body.description
      : blogData.description;
    blogData.tags = req.body.tags ? req.body.tags : blogData.tags;
    blogData.categoryId = req.body.categoryId
      ? req.body.categoryId
      : blogData.categoryId;
    blogData.image = req.body.image ? req.body.image : blogData.image;

    if (req.file.path) {
      const uploadResult = await cloudinary.v2.uploader.upload(req.file.path);
      blogData.image = uploadResult.secure_url;
    }
    // const isValidObjectId = mongoose.Types.ObjectId.isValid(
    //   blogData.categoryId
    // );

    // if (!isValidObjectId) {
    //   return res.status(404).json({ msg: "Invalid category ID" });
    // }
    let catid = blogData.categoryId;
    const categoryIdFind = await Category.findOne({
      _id: catid,
    });
    console.log("catiddddddddddd", categoryIdFind);
    if (!categoryIdFind) {
      return res.status(404).json({ msg: "Category not found" });
    }
    const updateBlogsData = await blogData.save();
    res.status(200).send({
      msg: "Profile updates sceessfull",
      BlogsUpdate: updateBlogsData,
    });
  } catch (error) {
    // console.log("erooooooo", error);
    return res.status(500).send({ message: "Categorey Id not found" });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    let id = req.params.id;
    const blogDeletes = await Blog.findOne({ _id: id });
    console.log("bloffffff",blogDeletes);
    if (!blogDeletes) {
      return res.status(404).json({ message: "Blog Id Not Found" });
    }
    await Blog.findByIdAndDelete(id)
    return res
      .status(200)
      .json({ message: `Blog deleted successfully with id ${id}` });
  } catch (err) {
    return res.status(404).json({ message: "Blog Id Not Found" });
  }
};

export const getblog = async (req, res) => {
  try {
    let userId = req.id;
    const getblog = await Blog.find({ userId: userId });
    if (!getblog) {
      return res.status(404).json({ message: "You Have not Blogs" });
    }
    return res.status(200).json({ message: "Your all data", getblog });
  } catch (error) {
    console.log("erooooooo", error);
    return res.status(500).send({ message: "Internal Error", error: error });
  }
};

export const addFavblogcount = async (req, res) => {
  try {
    const Favblog = await Blog.aggregate([
      {
        $lookup: {
          from: "favorites",
          localField: "_id",
          foreignField: "blogId",
          as: "Favorites",
        },
      },
      {
        $addFields: {
          BlogCount: { $size: "$Favorites" },
        },
      },
    ]);
    res.status(200).json({ FavoriteBlog: Favblog });
  } catch (err) {
    console.log("erooooooo", err);
    return res.status(500).json({ message: "Internal Error", error: err });
  }
};
