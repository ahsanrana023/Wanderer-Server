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
  try {
    const newProduct = req.body;
    console.log(req.body);
    const product = new Product();
    product.name = newProduct.name;
    product.price = newProduct.price;
    product.dicription = newProduct.dicription;
    if (newProduct.imageurl1 && newProduct.imageurl1.length > 0) {
      product.imageurls.push(newProduct.imageurl1);
    }
    if (newProduct.imageurl2 && newProduct.imageurl2.length > 0) {
      product.imageurls.push(newProduct.imageurl2);
    }
    if (newProduct.imageurl3 && newProduct.imageurl3.length > 0) {
      product.imageurls.push(newProduct.imageurl3);
    }

    const result = await product.save();
    res.send(result);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
});

module.exports = router;
