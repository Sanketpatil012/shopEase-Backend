const Category = require("./../db/category");


// CREATE category
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const category = new Category({ name });
    await category.save();

    res.status(201).json(category.toObject());
  } catch (err) {
    console.log("There is an error", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    const update = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!update) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "ok", data: update });
  } catch (err) {
    console.log("Error updating category", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deleteByID = await Category.findByIdAndDelete(id);

    if (!deleteByID) {
      return res.status(404).json({ message: "The Product doesnt contain" });
    }

    res.json({ message: "Category Deleted Successfully", data: deleteByID });
  } catch (err) {
    console.log("Error is Error:", err);
  }
};

const getCategory = async (req, res) => {
  try {
    const result = await Category.find();

    const finalResult = result.map((c) => c.toObject());

    res.json(finalResult);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something Went Wrong " });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const reqID = req.params.id;
    const category = await Category.findById(reqID);

    if (!category) {
      return res.status(404).json({ message: "category not found" });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};



module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getCategoryById,
};
