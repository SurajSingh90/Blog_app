import mongoose from "mongoose";
// const { Schema } = mongoose;
// const mySchema = new Schema({
//   blogId:[
//     {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "BlogId",
//     },
// ],
//   userId:{
//     type:String
//   },
  
// })
// const MyModel = mongoose.model("favorites", mySchema);

// export default MyModel;


const Favoriteschema = new mongoose.Schema({
  blogId:[
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BlogId",
    },
],
  userId:{
    type:String
  },
  unfavorites:{
    type:String
  }
});

export default mongoose.model("favorites", Favoriteschema);
