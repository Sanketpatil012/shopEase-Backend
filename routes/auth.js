const express = require("express");
const router = express.Router();
const { registerDetail, loginDetail } = require("../handlers/auth-handler");
const {verifyToken , isAdmin } = require("../middleware/auth-middleware")
router.post("/register", async (req, res) => {
  try {
    const model = req.body;

    if (!model.name || !model.password || !model.email) {
      return res.status(400).json({
        message: "Please fill the name, password and email correctly",
      });
    }

    const result = await registerDetail(model);
    res.status(201).json({ msg: "User Registered Successfully", user: result });
  } catch (error) {
    console.log("Registration error:", error);
    if (error.message.includes("already exists")) {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const model = req.body;

    if (!model.password || !model.email) {
      return res
        .status(400)
        .json({ msg: "Enter Email and password Correctly" });
    }

    const result = await loginDetail(model);

    if (!result) {
      return res.status(401).json({ msg: "Incorrect Password or Email" });
    }

    res.status(200).json({
      msg: "User login Successfuly",
      token: result.token,
      user: result.userObject,
    });
  } catch (error) {
    console.log("Login error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
