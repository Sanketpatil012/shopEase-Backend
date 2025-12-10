const express = require("express");
const moongose = require("mongoose");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
const categoryRoutes = require("./routes/category");
const brandRoutes = require("./routes/brand");
const productRoute = require("./routes/product");
const customerRoute = require("./routes/coustumer");
const authRoute = require("./routes/auth");
const {verifyToken , isAdmin } = require("./middleware/auth-middleware")

app.use(
  cors({
    origin: "http://localhost:4200",
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

const mongoose = require("mongoose");

async function connectDb() {
  await mongoose.connect("mongodb+srv://sanket_db_user:R1CyhSl0ega85uMu@cluster0.cofl5cs.mongodb.net/e-commerce-db?retryWrites=true&w=majority");
  console.log("MongoDB connected");
}

connectDb().catch((err) => {
  console.log(err);
});

app.listen(port, () => {
  console.log("Server running on the port", port);
});
