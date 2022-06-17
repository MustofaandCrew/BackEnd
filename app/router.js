const express = require("express");
const router = express.Router();
const category  = require("./controller/category");
const product = require("./controller/product");

router.get("/", (req, res) => {
  res.send({
    message: "Server is running",
  });
});

//Kategori
router.get('/categories', category.getListCategories);
router.get('/categories/:id', category.getListCategoriesById);
router.post('/categories/add', category.createCategory);
router.put('/categories/edit/:id', category.updateCategory);
router.delete('/categories/delete/:id', category.deleteCategory);

// Product
router.get('/products', product.getListProducts);
router.get('/products/:id', product.getListProductsById);
router.post('/products/add', product.createProduct);
router.put('/products/edit/:id', product.updateProduct);
router.delete('/products/delete/:id', product.deleteProduct);

module.exports = router;
