const express = require("express");
const router = express.Router();

const {
  addProduct,
  updateProduct,
  getProduct,
  getProductId,
  deleteProduct,
} = require("../handlers/product-handler");

router.get("", async (req, res) => {
  let product = await getProduct();
  res.send(product);
});
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const product = await getProductId(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.send(product);
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).send({ error: "Failed to fetch product" });
  }
});

router.post("/", async (req, res) => {
  try {
    const body = req.body;
    let product = await addProduct(body);
    res.send(product);
  } catch (err) {
    res.errored("unable to add the product", err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const model = req.body;
    const id = req.params.id;
    await updateProduct(id, model);

    const updatedProduct = await getProductId(id);

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.send(updatedProduct);
  } catch (err) {
    console.error("Problem when updating the product:", err);
    res.status(500).send({ error: "Failed to update product" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const product = await getProductId(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    await deleteProduct(id);
    res.send({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Problem when deleting the product:", err);
    res.status(500).send({ error: "Failed to delete product" });
  }
});

module.exports = router;
