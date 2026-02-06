import express from 'express';
import { addProducts, deleteProduct, getfeaturedProducts, getProducts, updateProduct } from '../controller/productController.js';
import authMiddleware from '../middleware/authMiddleware.js';


const productRouter = express.Router();

// Authenticated routes
productRouter.post("/add",authMiddleware,addProducts);
productRouter.get("/get",authMiddleware,getProducts);
productRouter.delete("/delete/:productKey",authMiddleware,deleteProduct);
productRouter.put("/update/:productKey",authMiddleware,updateProduct);


productRouter.get("/getFeaturedProducts",getfeaturedProducts);


export default productRouter;