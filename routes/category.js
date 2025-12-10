 const express = require("express");
 const router = express.Router();
 const Category = require("./../db/category");
 const {createCategory ,updateCategory , deleteCategory , getCategory , getCategoryById } = require("./../handlers/category-handler") 

 router.post("",  createCategory);

 router.get(""  , getCategory)

 router.get("/:id"  , getCategoryById)     


 router.put("/:id", updateCategory );

 router.delete("/:id" , deleteCategory);

 module.exports = router;

