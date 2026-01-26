import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    productKey: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    categories: [{ type: String, required: true }],
    productType: { type: String, required: true },
    stock: { type: Number, required: true },
    image: { type: String, required: true , default: "https://i.ibb.co/Y4Pj570p/shopping.webp"},
    availability: { type: Boolean, default: true },
});

const Product = mongoose.model("product", productSchema);

export default Product;
