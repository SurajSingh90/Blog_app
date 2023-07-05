import mongoose from "mongoose";
const Blogschema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  userId: {
    type: String,
  },
  image: {
    type: String,
  },
  tags: [
    {
      type: String,
    },
  ],
  categoryId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CategoryId",
      trim: true,
    },
  ],
  
});

export default mongoose.model("Blog", Blogschema);
