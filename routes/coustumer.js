const express = require("express");
const router = express.Router();
const Category= require("../db/category")
const {
  getNewProduct,
  getFeaturedProduct,
  
} = require("./../handlers/product-handler");





router.get("/categories" , async(req, res)=>{
   try {
    const result = await Category.find();

    const finalResult = result.map((c) => c.toObject());

    res.json(finalResult);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something Went Wrong " });
  }
})

router.get("/home/new-product", async (req, res) => {
  try {
    const products = await getNewProduct();
    res.send(products);
  } catch (error) {
    console.error("Error fetching new products:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

router.get("/home/featured-products", async (req, res) => {
  try {
    const products = await getFeaturedProduct();
    res.send(products);
  } catch (error) {
    console.error("Error fetching featured products:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

module.exports = router;
