const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

// models
const Product = require('../models/product');
const Category = require('../models/category');

// GET products list
exports.index = asyncHandler(async (req, res) => {
  const products = await Product.find({}, "name price").sort({ name: 1 }).exec();
  res.render('products_list', { title: 'All Products', products: products });
});

// GET product detail 
exports.product_detail = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category').exec();
  res.render('product_detail', { title: product.name, product: product });
});

// GET product form
exports.product_add_product_get = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 }).exec();
  res.render('product_form', { title: 'Create New Product', categories: categories });
});

// GET product update form
exports.product_update_get = asyncHandler(async (req, res) => {
  const [product, categories] = await Promise.all([
    Product.findById(req.params.id).populate('category').exec(),
    Category.find().sort({ name: 1 }).exec()
  ]);
  res.render('product_update_form', { title: 'Update Product', product: product, categories: categories });
});

// POST new product
exports.product_create_post = [
  // Validate and sanitize fields
  body('name', 'Product name required').trim().isLength({ min: 1, max: 100 }).escape(),
  body('description', 'Product description required').trim().isLength({ min: 1, max: 500 }).escape(),
  body('price', 'Product price required').trim().isNumeric().isLength({ min: 1, max: 10 }).escape(),
  
  // Process request
  asyncHandler(async (req, res, next) => {
    // Extract validation errors from request
    const errors = validationResult(req);

    // Create product object with escaped and trimmed data
    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      _id: req.params.id
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages
      res.render('product_form', { title: 'Create New Product', product: product, errors: errors.array() });
      return;
    } else {
      // Data from form is valid

      // Check if product with same name already exists
      const exists = await Product.findOne({ 'name': req.body.name }).exec();
      if (exists) {
        // Product exists, redirect to its detail page
        res.redirect(product.url);
        return;
      } else {
        // Save the record and redirect to the product detail page
        const newProduct = await product.save();
        res.redirect(newProduct.url);
      }
    }
  }),
]

// POST product update
exports.product_update_post = [
  // Validate and sanitize fields
  body('name', 'Product name required').trim().isLength({ min: 1, max: 100 }).escape(),
  body('description', 'Product description required').trim().isLength({ min: 1, max: 500 }).escape(),
  body('price', 'Product price required').trim().isNumeric().isLength({ min: 1, max: 10 }).escape(),

  // Process request
  asyncHandler(async (req, res, next) => {

    // Extract validation errors from request
    const errors = validationResult(req);

    // Create product object with escaped and trimmed data
    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      _id: req.params.id
    });

    if (!errors.isEmpty()) {
      res.render('product_update_form', { title: 'Update Product', product: product, errors: errors.array() });
      return;
    } else {
      const updatedProduct = await Product.findByIdAndUpdate(req.params.id, product, { new: true });
      res.redirect(updatedProduct.url);
    }
  }),
];

// POST product delete
exports.product_delete_get = asyncHandler(async (req, res) => {
  console.log(req.params.id);
  await Product.findByIdAndDelete(req.params.id);
  console.log('Product deleted successfully');
  res.redirect('/products');
});