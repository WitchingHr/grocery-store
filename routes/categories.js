const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categoriesController');

// category routes

// GET categories list
router.get('/', categoriesController.index);

// GET single category
router.get('/:id', categoriesController.category_detail);

// GET category form
router.get('/:id/update', categoriesController.category_form_get);

// POST category form
router.post('/:id/update', categoriesController.category_form_post);

// GET add product to category form
router.get('/:id/add-product', categoriesController.category_add_product_get);

module.exports = router;
