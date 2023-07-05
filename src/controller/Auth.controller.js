import Users from "../model/Auth.model.js";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Token from "../config/database.js";
export const usercreate = async (req, res) => {
  const errors = validationResult(req);

  console.log("errors===============", errors.array());

  let obj = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password,12),
    usertype: req.body.usertype,
  };
 
  try {
    if (!errors.isEmpty()) {
      return res.json({
        message: errors.array()[0].msg,
      });
    } 
    if(obj.password.length<6){
        return res.status(400).send({ message: "your password to short ,Password length min 7 " });
    }
    else {
      const result = await Users.create(obj);
      res
        .status(200)
        .json({
          message: "Your Profile Created Success Full",
          YourData: result,
        });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "internal error" });
  }
};


export const loginpage = async (req, res) => {
    const finduser = await Users.findOne({ email: req.body.email });
    const errors = validationResult(req);
    try {
      if (!errors.isEmpty()) {
        return res.json({
          message: errors.array()[0].msg,
        });
      }
      if (!finduser) {
        return res.status(404).send({ message: "email Not Founded" });
      }
      const validpassword = bcrypt.compareSync(
        req.body.password,
        finduser.password
      );
     
      console.log("userdata===", finduser.password);
      if (!validpassword) {
        res.status(400).send({ msg: "password is wrong" });
        return;
      }
      const token = jwt.sign({ id: finduser._id }, Token.TokenData);
      return res.send({
        id: finduser._id,
        firstname: finduser.firstname,
        email: finduser.email,
        acesstoken: token,
      });
    } catch (error) {
      if (error.name === "ValidationError") {
        const errors = Object.values(error.errors).map((err) => err.message);
        return res.status(400).json({ errors });
      }
    }
  };