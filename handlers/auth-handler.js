const User = require("../db/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function registerDetail(model) {
  try {
    const hashedPassword = await bcrypt.hash(model.password, 10);

    const user = new User({
      name: model.name,
      password: hashedPassword,
      email: model.email,
      isAdmin: model.isAdmin || false,
    });

    await user.save();
    return user.toObject();
  } catch (err) {
    throw err;
  }
}
async function loginDetail(model) {
  try {
    const user = await User.findOne({ email: model.email });
    if (!user) {
      return null;
    }
    const isMatched = await bcrypt.compare(model.password, user.password);

    if (isMatched) {
      const token = jwt.sign(
        {
          id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
        },
        "Secret",
        { expiresIn: "1h" },
      );
      const userObject = user.toObject();
      delete userObject.password;
      return { token, userObject };
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
}
module.exports = { registerDetail, loginDetail };
