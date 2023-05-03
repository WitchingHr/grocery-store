const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// category routes
router.get('/', categoryController.index);

module.exports = router;
