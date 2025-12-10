const mongoose = require("mongoose");
const { Schema } = mongoose;
               
const productSchema = new Schema({
  name: String,
  shortDescription: String,
  description: String,
  price: Number,
  discount: Number,
  image: [String], 
  categoryId: { type: Schema.Types.ObjectId, ref: 'categories' },
  brandId: { type: Schema.Types.ObjectId, ref: 'brands' },
  isFeatured:Boolean, 
  isNewProduct:Boolean
});
const Product = mongoose.model('products', productSchema);
module.exports = Product;





