const Brand = require("../db/brands");

async function getBrands() {
  const brands = await Brand.find();
  return brands.map((x) => x.toObject());
}

async function getBrandById(id) {
  const brand = await Brand.findById(id);
  if (!brand) {
    return null;
  }
  return brand.toObject();
}

async function addBrand(model) {
  const brand = new Brand({
    name: model.name
  });
  await brand.save();
  return brand.toObject();
}

async function updateBrand(id, model) {
  const updated = await Brand.findByIdAndUpdate(id, model, { new: true });
  return updated ? updated.toObject() : null;
}

async function deleteBrand(id) {
  const deleted = await Brand.findByIdAndDelete(id);
  return deleted ? deleted.toObject() : null;
}

module.exports = {
  getBrands,
  getBrandById,
  addBrand,
  updateBrand,
  deleteBrand, 
};






