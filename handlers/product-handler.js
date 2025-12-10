const Product = require("../db/product");
async function addProduct(model) {
  const product = new Product({
    ...model,
  });
  await product.save();
  return product.toObject();
}

async function updateProduct(id, model) {
  await Product.findByIdAndUpdate(id, model);
}
async function deleteProduct(id) {
  await Product.findByIdAndDelete(id);
}
async function getProduct() {
  const product = await Product.find();
  return product.map((x) => x.toObject());
}

async function getProductId(id) {
  const product = await Product.findById(id);
  if (!product) {
    return null;
  }
  return product.toObject();
}

async function getNewProduct() {
  try {
    const newProducts = await Product.find({
         isNewProduct: true,
      })
      .exec();

    if (!newProducts || newProducts.length === 0) {
      return [];
    }
    return newProducts.map((x) => x.toObject());
  } catch (error) {
    console.log("Error in fetching the NewProduct", error);
    throw error;
  }
}
async function getFeaturedProduct() {
  try {
    const featureProduct = await Product.find({ 
      isFeatured: true,
    }).exec();

    if (!featureProduct || featureProduct.length === 0) {
      return [];
    }
    return featureProduct.map((x) => x.toObject());
  } catch (error) {
    console.log("Error in fetching the Featured Product", error);
    throw error;
  }
}

module.exports = {
  addProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  getProductId,
  getNewProduct,
  getFeaturedProduct,
};
