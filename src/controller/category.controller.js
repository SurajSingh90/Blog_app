import Category from "../model/category";
import { validationResult } from "express-validator";
// import { Types as mongooseTypes } from "mongoose";
import mongoose from "mongoose";


export const Categorycreate = async (req, res) => {
  const errors = validationResult(req);

  console.log("errors===============", errors.array());

  let obj = {
    categoryName: req.body.categoryName,
    userId: req.id,
  };

  try {
    if (!errors.isEmpty()) {
      return res.json({
        message: errors.array()[0].msg,
      });
    } else {
      const find = await Category.findOne({categoryName:obj.categoryName})
      if(find){
        return res.status(403).json({message:"Category Name already exist"})
      }
      const result = await Category.create(obj);
      res.status(200).json({
        message: "Your Category Created Success Full",
        Category_id: result._id,
        Category_name: result.categoryName,
        userId: result.userId,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "internal error" });
  }
};

// export const getcategries = async (req, res) => {
//   try {
//     let userId = req.id;
//     const getcat = await Category.find({ userId: userId });
//     if (!getcat) {
//       return res.status(404).json({ message: "You Have not Categries" });
//     }
//     return res.status(200).json({ message: "Your all data", getcat });
//   } catch (error) {
//     console.log("erooooooo", error);
//     return res.status(500).send({ message: "Internal Error", error: error });
//   }
// };

export const updateCategories = async (req, res) => {
  const errors = validationResult(req);

  console.log("errors===============", errors.array());
    
  let id = req.params.id;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(404).json({ message: "Id not found" });
  }

  try {
    if (!errors.isEmpty()) {
      return res.json({
        message: errors.array()[0].msg,
      });
    }
    const finddata = await Category.findById(id);

    if (!finddata) {
      return res.status(404).json({ message: "Category Id not found" });
    }
    if (req.id != finddata.userId) {
      return res
        .status(401)
        .json({ message: "you are Unauthorized!, You Can not Updates " });
    }
    finddata.categoryName = req.body.categoryName
      ? req.body.categoryName
      : finddata.categoryName;

    const updateCategoriesData = await finddata.save();
    res.status(200).send({
      msg: "updates sceessfull",
      CategoriesUpdate: updateCategoriesData,
    });
  } catch (err) {
    console.log("erooooooo", err);
    return res.status(500).json({ message: "Internal Error", error: err });
  }
};

export const addblogcount = async (req, res) => {
  try {
    const countblog = await Category.aggregate([
      {
        $lookup: {
          from: "blogs",
          localField: "_id",
          foreignField: "categoryId",
          as: "posts",
        },
      },
      {
        $addFields: {
          postCount: { $size: "$posts" },
        },
      },
    ]);
    res.send(countblog);
  } catch (err) {
    console.log("erooooooo", err);
    return res.status(500).json({ message: "Internal Error", error: err });
  }
};

export const categoryDeleteAggregation = async (req, res) => {
  try {
    const categoryIds = req.params.id;

    Category.aggregate([
      {
        $lookup: {
          from: "blogs",
          localField: "_id",
          foreignField: "categoryId",
          as: "posts",
        },
      },
      {
        $addFields: {
          postCount: { $size: "$posts" },
        },
      },
    ])
      .then((categories) => {
        const category = categories.find(
          (categoryId) => categoryId._id.toString() === categoryIds
        );
        
        if (category && category.postCount === 0) {
          Category.deleteOne({ _id: categoryIds })
            .then(() => {
              return res
                .status(200)
                .send( {message: `Deleted category with ID ${categoryIds} and zero blog posts.`} 
                 
                );
            })
            .catch((err) => {
              console.error(err);
              return res
                .status(500)
                .json({ message: "Internal Server Error", error: err });
            });
        } else if (category) {
          return res
            .status(400)
            .send({message: `Category with ID ${categoryIds} has ${category.postCount} blog posts and cannot be deleted.`}
             
            );
        } else {
          return res
            .status(404)
            .send({mesaage:`Category with ID ${categoryIds} not found.`});
        }
      })
      .catch((err) => {
        console.error(err);
        return res
          .status(500)
          .json({ message: "Internal Server Error", error: err });
      });
  } catch (err) {
    console.log("Error:", err);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: err });
  }
};
