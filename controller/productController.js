import Product from "../model/product.js";
import { isAdmin, isUser, isUserNull } from "./userController.js";

export async function addProducts(req, res) {
    try {

        if (isUserNull(req)) {
            res.status(400).json({
                message: "Please login to perform this task",
                error: true
            });
            return
        }

        if (!isAdmin(req)) {
            res.status(400).json({
                message: "You are not authorized to perform this task",
                error: true
            });
            return
        }

        if (isAdmin(req)) {
            const productData = req.body;

            if (productData.categories) {

            if (Array.isArray(productData.categories)) {
                // already array, ok
            } else if (typeof productData.categories === "string") {
                productData.categories = [productData.categories];
            } else {
                return res.status(400).json({ message: "Invalid categories format",error: true });
            }
            } else {
            return res.status(400).json({ message: "categories field is required",error: true });
            }

            const product = new Product(productData);
            await product.save();
            res.json({
                message: "Product add success",
                error: false
            });
            return;
        }
    } catch (e) {
        res.status(500).json({
            message: "Product couldn't add" + e.message,
            error: true
        });
    }
}


export async function getProducts(req, res) {
    try {
        if (isUserNull(req) || !isAdmin(req)) {
            const products = await Product.find({
                availability: true
            });
            res.json({
                products : products,
                error : false
            });
            return;
        }


        if (isAdmin(req)) {
            const products = await Product.find();
            res.json( {
                products: products,
                error: false
            });
            return;
        }


    } catch (e) {
        res.status(500).json({
            message: "Product couldn't fetch" + e.message,
            error: true
        });
    }
}


export async function deleteProduct(req, res) {
    try {
        if (isUserNull(req) || !isAdmin(req)) {
            res.status(400).json({
                message: "You are not authorized to perform this task",
                error: true
            })

            return;
        }

        if (isAdmin(req)) {
            const deleteId = req.params.productKey;
            await Product.deleteOne({
                productKey: deleteId
            });
            res.json({
                message: "Product delete success",
                error: false
            });
        }
    } catch (e) {
        res.status(500).json({
            message: "Product delete failed",
            error: true
        });
    }

}


export async function updateProduct(req, res) {
    try {
        if (isUserNull(req) || !isAdmin(req)) {
            res.status(401).json({
                message: "You are not authorized to perform this task"
            });
            return
        }

        if (isAdmin(req)) {
            const updateData = req.body;
            const updateId = req.params.productKey;

            if (updateData.categories) {
                if (Array.isArray(updateData.categories)) {
                    // ok
                } else if (typeof updateData.categories === "string") {
                    updateData.categories = [updateData.categories];
                } else {
                    return res.status(400).json({
                    message: "Invalid categories format",
                    });
                }
            }

            await Product.updateOne({
                productKey: updateId
            },
                updateData
            );
            res.json({
                message: "Product update success"
            })
        }
    } catch (e) {
        res.status(500).json({
            message: "Product update failed"
        })
    }
}





