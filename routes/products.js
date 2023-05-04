const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');

// product routes

// GET products list
router.get('/', productsController.index);

// GET product form
router.get('/add-product', productsController.product_add_product_get);

// GET product detail
router.get('/:id', productsController.product_detail);

// GET product update form
router.get('/:id/update', productsController.product_update_get);

// POST new product
router.post('/', productsController.product_create_post);

// POST product update
router.post('/:id/update', productsController.product_update_post);

// GET product delete
router.get('/:id/delete', productsController.product_delete_get);


module.exports = router;