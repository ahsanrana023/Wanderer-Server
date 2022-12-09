const express = require("express");
const router = express.Router();
const Product = require("../models/products");
router.get("/getallproducts", async (req, res) => {
  try {
    const products = await Product.find({});
    res.send(products);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.post("/getproductsbyid", async (req, res) => {
  try {
    const productid = req.body.priductid;
    const product = await Product.findOne({ _id: productid });
    res.send(product);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.post("/getallproducts", async (req, res) => {
  try {
    const products = await Product.find();
    res.send(products);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
});

router.delete("/:id", async (req, res) => {
  console.log(req.params.id);
  const data = await dbconnect();
  const result = data.deleteOne({ _id: new mongodb.ObjectId(req.params.name) });

  res.send(result);
});

router.post("/addproduct", async (req, res) => {
  const { name, price, dicription } = req.body;
  try {
    const newproduct = new Product({
      name,
      price,
      dicription,
    });

    const product = await newproduct.save();
  } catch (err) {
    return res.status(400).json({ message: "Something went wrong" + error });
  }
});

module.exports = router;
