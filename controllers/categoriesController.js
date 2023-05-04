const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

// models
const Category = require('../models/category');
const Product = require('../models/product');

// GET categories list
exports.index = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 }).exec();
  res.render('categories_list', { title: 'Categories', categories: categories });
});

// GET category detail
exports.category_detail = asyncHandler(async (req, res) => {
  const [category, categoryProducts] = await Promise.all([
    await Category.findById(req.params.id).exec(),
    await Product.find({ category: req.params.id }, "name price").sort({ name: 1 }).exec()
  ]);
  res.render('category_detail', { title: category.name, products: categoryProducts, category: category });
});

// GET category form
exports.category_form_get = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id).exec();
  res.render('category_form', { title: 'Update Category', category: category });
});

// POST category form
exports.category_form_post = [
  // Validate and sanitize fields
  body('name', 'Category name required').trim().isLength({ min: 1, max: 100 }).escape(),

  // Process request
  asyncHandler(async (req, res, next) => {
    // Extract validation errors from request
    const errors = validationResult(req);

    // Create category object with escaped and trimmed data
    const category = new Category({ name: req.body.name, _id: req.params.id });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages
      res.render('category_form', { title: 'Update Category', category: category, errors: errors.array() });
      return;
    } else {
      // Data from form is valid. Update the record and redirect to the category detail page
      const updatedCategory = await Category.findByIdAndUpdate(req.params.id, category, { new: true }).exec();
      res.redirect(updatedCategory.url);
    }
  }),
];

// GET add product to category form
exports.category_add_product_get = asyncHandler(async (req, res) => {
  const [category, categories] = await Promise.all([
    await Category.findById(req.params.id).exec(),
    await Category.find().sort({ name: 1 }).exec()
  ]);
  res.render('product_form', { title: 'Create New Product', category: category, categories: categories });
});