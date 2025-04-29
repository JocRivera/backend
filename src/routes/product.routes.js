import { Router } from "express";
import { ProductController } from "../controllers/product.controller.js";

const productRoutes = Router();
const productController = new ProductController();

productRoutes.post("/create", productController.createProduct);
productRoutes.get("/", productController.getProducts);
productRoutes.get("/:id", productController.getProductById);
productRoutes.put("/:id", productController.updateProduct);
productRoutes.delete("/:id", productController.deleteProduct);

export default productRoutes;