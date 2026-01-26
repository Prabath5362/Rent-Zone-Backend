import express from "express"
import { deleteUser, getAllUsers, getUserDetails, loginUser, registerUser, updateUser } from "../controller/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const userRouter = express.Router();


userRouter.post("/register",registerUser);
userRouter.post("/login",loginUser);

// Authenticated routes
userRouter.get("/getUserDetails",authMiddleware,getUserDetails);
userRouter.put("/updateUser",authMiddleware,updateUser);
userRouter.get("/getAllUsers",authMiddleware,getAllUsers);
userRouter.delete("/deleteUser/:email",authMiddleware,deleteUser);

export default userRouter;