import mongoose from "mongoose";
const Authschema = new mongoose.Schema({
  firstname: {
    type: String,
    
  },
  lastname:{
    type:String
  },
  email:{
    type:String
  },
  password:{
    type:String
  },
 
  usertype:{
    type:String,
    default:"users"
  }

 
});

export default mongoose.model("Users", Authschema);
