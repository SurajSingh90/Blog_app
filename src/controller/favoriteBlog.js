import Favorite from "../model/favorite";
import Blog from "../model/blog.model.js";
import mongoose from "mongoose";
import { validationResult } from "express-validator";

export const createfavorite = async (req, res) => {
  const errors = validationResult(req);

  console.log("errors===============", errors.array());

  let favobj = {
    blogId: req.body.blogId,
    userId: req.id,
  };
  console.log("favobjIIIdddddd", favobj.blogId);

  try {
    if (!errors.isEmpty()) {
      return res.json({
        message: errors.array()[0].msg,
      });
    }

    const isValidObjectId = mongoose.Types.ObjectId.isValid(
      favobj.blogId
    );

    if (!isValidObjectId) {
      return res.status(404).json({ msg: "Invalid category ID" });
    }

    let blog = await Blog.findOne({ _id: favobj.blogId });
    console.log("blogIDDDDDDDDDDD", blog);

    if (!blog) {
      return res.status(404).send({ message: "Blog Not Found " });
    }

    if (blog.userId !== favobj.userId) {
      return res.status(403).send({
        message: "you are Unauthorized for adding Favorite",
      });
    }

    const favorite = await Favorite.findOne({
      blogId: favobj.blogId,
      userId: favobj.userId,
    });

    if (favorite) {
      await Favorite.findByIdAndDelete(favorite._id);  
      return res.status(200).json({ message: "Post has been unfavorited." });
    } else {
      await Favorite.create(favobj);
      return res.status(200).json({ message: "Post has been favorited." });
    }
  } catch (err) {
    console.log("Error:", err);
    return res.status(500).json({ message: "Internal error" });
  }
};

// export const unfavorites = async (req, res) => {
//   try {
//     const id = req.params.id;

//     const result = await Favorite.findByIdAndDelete(id);
//     if (!result) {
//       return res.status(404).json({ message: `Favorite  ID ${id} not found.` });
//     }
//     return res.status(404).json({ message: "Unfavorite Sccessfull" });
//   } catch (err) {
//     console.log("Error:", err);
//     return res
//       .status(500)
//       .json({ message: "Internal Server Error", error: err });
//   }
// };
