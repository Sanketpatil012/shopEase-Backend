const express = require("express");
const router = express.Router();

const {
  getBrands,
  getBrandById,
  addBrand,
  updateBrand,
  deleteBrand,
} = require("../handlers/brand-handler");

router.get("", async (req, res) => {
  let brands = await getBrands();
  res.send(brands);
});

router.get("/:id", async (req, res) => {
  let id = req.params.id;
  let brand = await getBrandById(id);
  res.send(brand);
});

router.post("/", async (req, res) => {
  try {
    const body = req.body;
    const brand = await addBrand(body);
    res.send(brand);
  } catch (err) {
    console.log("Problem when adding the brand", err);
    res.status(500).send({ error: "Failed to add brnad" });
  }
});
router.put("/:id", async (req, res) => {
  try {
    const body = req.body;
    const id = req.params.id;
    const brand = await updateBrand(id, body);
    

    if (!brand) {
      return res.status(404).send({ error: "Brand not found" });
    }

    res.send(brand);
  } catch (err) {
    console.error("Problem when updating the brand:", err);
    res.status(500).send({ error: "Failed to update brand" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const brand = await deleteBrand(id);
    if (!brand) {
      res.status(404).send({ error: "Brand Not found" });
    }
    res.send(brand);
  } catch (err) {
    console.error("Problem when deleting the brand:", err);
    res.status(500).send({ error: "Failed to delete  brand" });
  }
});

module.exports = router;
