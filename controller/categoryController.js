import Category from "../model/category.js";
import { isUserNull, isAdmin, isUser } from "./userController.js";

export async function addCategory(req, res) {
    try {
        if (isUserNull(req) || !isAdmin(req)) {
            res.status(401).json({
                message: "You are not authorized to perform this task"
            });
            return;
        }
        if (isAdmin(req)) {
            const categoryData = req.body;
            const category = new Category(categoryData);
            await category.save();
            res.json({
                message: "Category add success"
            });
            return;
        }
    } catch (e) {
        res.status(500).json({
            message: "Category couldn't add"
        });
    }
}


export async function getCategories(req, res) {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (e) {
        res.status(500).json({
            message: "Categories couldn't fetch"
        });
    }   
}


export async function deleteCategory(req, res) {
    try {
        if (isUserNull(req) || !isAdmin(req)) {
            res.status(401).json({
                message: "You are not authorized to perform this task"
            });
            return;
        }

        if (isAdmin(req)) {
            const deleteId = req.params.name;
            await Category.deleteOne({
                name: deleteId
            });
            res.json({
                message: "Category delete success"
            });
        }
    } catch (e) {
        res.status(500).json({
            message: "Category delete failed" + e.message
        });
    }
}   