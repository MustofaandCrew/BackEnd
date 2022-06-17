const express = require("express");
const router = express.Router();
const {categoryController} = require("./controller");
const product = require("./controller/product");

router.get("/", (req, res) => {
  res.send({
    message: "Server is running",
  });
});

//Kategori
router.get('/categories', categoryController.getListCategories);
router.get('/categories/:id', categoryController.getListCategoriesById);
router.post('/categories/create', categoryController.createCategory);
router.put('/categories/update/:id', categoryController.updateCategory);
router.delete('/categories/delete/:id', categoryController.deleteCategory);

// Product
router.get('/products', product.getListProducts);
router.get('/products/:id', product.getListProductsById);
router.post('/products/add', product.createProduct);
router.put('/products/edit/:id', product.updateProduct);
router.delete('/products/delete/:id', product.deleteProduct);

module.exports = router;
