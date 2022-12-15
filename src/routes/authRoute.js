import express from "express";
import { User } from "../services/mongoDB/models/User";
import { body, validationResult } from "express-validator";
import { verifyPassword } from "../uitls/password";
import { createJWT } from "../uitls/jwt";
import isAuthenticated from "../middlewares/isAuthenticated";
const router1 = express.Router();

let message = {
  success: false,
  data: null,
  message: "",
};

router1.post(
  "/signup",
  body("userName").isLength({ min: 5 }).withMessage("userName is too short"),
  body("firstName").isLength({ min: 3 }).withMessage("firstName is too short"),
  body("lastName").isLength({ min: 3 }).withMessage("lastName is too short"),
  body("email").isEmail(),
  body("password").isLength({ min: 8 }),
  body("confirmPassword")
    .custom((val, { req }) => {
      if (req.body.password === val) {
        return true;
      }
      return false;
    })
    .withMessage("Password is incorrect"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      message = {
        success: false,
        data: null,
        message: errors.array(),
      };
      return res.json(message);
    }
    try {
      const { userName, firstName, lastName, email, password } = req.body;
      const oldUser = await User.findOne({ email: email });
      if (oldUser) {
        message = {
          success: false,
          data: null,
          message: "User already exists",
        };
        res.json(message);
      }
      const newUser = new User({
        userName,
        firstName,
        lastName,
        email: email.toLowerCase(),
        password,
      });
      await newUser.save();
      message = {
        success: true,
        data: newUser,
        message: "User Created 😊",
      };
      return res.json(message);
    } catch (error) {
      message = {
        success: false,
        data: null,
        message: error.message,
      };
      res.json(message);
    }
  }
);

router1.post(
  "/login",
  body("email").isEmail(),
  body("password").isLength({ min: 8 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      message = {
        success: false,
        data: null,
        message: errors.array(),
      };
    }
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email: email });
      if (user) {
        const validPassword = verifyPassword(user.password, password);
        console.log(validPassword);
        if (validPassword) {
          const token = createJWT({ id: user._id, email: user.email });
          message = {
            success: true,
            data: { accessToken: token, user: user },
            message: "Welcome! You have successfully signed😊",
          };
          res.send(message);
        } else {
          message = {
            success: false,
            data: null,
            message: "Password Does Not Matched😶",
          };
          res.send(message);
        }
      } else {
        message = {
          success: false,
          data: null,
          message: "User does not exist😟",
        };
        res.send(message);
      }
    } catch (error) {
      message = {
        success: false,
        data: null,
        message: error.message,
      };
      res.send(message);
    }
  }
);

router1.get('/data',isAuthenticated,(req,res)=>{
    res.send("Welcome Chief")
})
export default router1;
