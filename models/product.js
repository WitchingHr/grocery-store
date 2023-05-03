const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  description: { type: String, required: true, maxLength: 500 },
  price: { type: Number, required: true, min: 0 },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
});

// Virtual for product's URL
ProductSchema.virtual('url').get(function() {
  return '/products/' + this._id;
});

// Export model
module.exports = mongoose.model('Product', ProductSchema);
