const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
const categoryRoutes = require("./routes/category");
const brandRoutes = require("./routes/brand");
const productRoute = require("./routes/product");
const customerRoute = require("./routes/coustumer");
const authRoute = require("./routes/auth");
const {verifyToken , isAdmin } = require("./middleware/auth-middleware")
const dotenv= require('dotenv') 
const orderRoutes = require('./routes/order');





dotenv.config({quiet: true })
app.use(
  cors({
    origin: ["http://localhost:4200","https://shop-ease-ecom.vercel.app"],
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hellow World");
});

app.use("/category",verifyToken , isAdmin ,  categoryRoutes);
app.use("/brand", verifyToken , isAdmin , brandRoutes);
app.use("/product", verifyToken  , productRoute);
app.use("/customer"  , verifyToken,  customerRoute);
app.use("/auth", authRoute); 
app.use('/api/orders', orderRoutes);



async function connectDb() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");
}

connectDb().catch((err) => {
  console.log(err);
});

app.listen(port, () => {
  console.log("Server running on the port", port);
});
