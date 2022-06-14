const express = require("express");
const router = express.Router();
const category  = require("./controller/category");

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

module.exports = router;
