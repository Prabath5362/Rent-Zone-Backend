import express from 'express';
import { addProducts, deleteProduct, getProducts, updateProduct, updateProductStock, updateStockByCancellOrder } from '../controller/productController.js';
import authMiddleware from '../middleware/authMiddleware.js';


const productRouter = express.Router();

// Authenticated routes
productRouter.post("/add",authMiddleware,addProducts);
productRouter.get("/get",authMiddleware,getProducts);
productRouter.delete("/delete/:productKey",authMiddleware,deleteProduct);
productRouter.put("/update/:productKey",authMiddleware,updateProduct);
productRouter.put("/updateProductStock",authMiddleware,updateProductStock);
productRouter.put("/updateStockByCancellOrder",authMiddleware,updateStockByCancellOrder)


export default productRouter;