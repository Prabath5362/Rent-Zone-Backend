import express from "express";
import { addCategory, deleteCategory, getCategories } from "../controller/categoryController.js";
import authMiddleware from "../middleware/authMiddleware.js";


const categoryRouter = express.Router();

// Authenticated routes
categoryRouter.post("/add",authMiddleware, addCategory);
categoryRouter.get("/get",authMiddleware, getCategories);
categoryRouter.delete("/delete/:name",authMiddleware, deleteCategory);

export default categoryRouter;