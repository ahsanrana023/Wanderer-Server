const express = require("express");
const moment = require("moment");
const stripe = require("stripe")(
  "sk_test_51M2qZEJdqzfSzjlZSYueQsk8wh39ALTsqc3TOmKPoPXHdRSw4p0vCorFbPqaHBo1bU0NsUdBgTxiDBmjORxtoQ6E00spOYJZ4Z"
); //
const { v4: uuidv4 } = require("uuid"); //https://www.npmjs.com/package/uuid

const router = express.Router();

const Buy = require("../models/buyproduct");
const Product = require("../models/products");

router.post("/getallbuys", async (req, res) => {
  try {
    const productbuys = await Buy.find();
    res.send(productbuys);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
});

router.post("/cancelbuy", async (req, res) => {
  const { buyid, productid } = req.body;
  try {
    const buy = await Buy.findOne({ _id: buyid });

    buy.status = "cancelled";
    await buy.save();
    const product = await Product.findOne({ _id: productid });
    const productbuys = product.currentbuys;
    const temp = buys.filter((x) => x.buyid.toString() !== buyid);
    product.currentbuys = temp;
    await product.save();

    res.send("Your order cancelled successfully");
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
});

router.post("/getbuybyuserid", async (req, res) => {
  const { userid } = req.body;
  try {
    const productbuys = await Buy.find({ userid: userid });

    res.send(productbuys);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
});

router.post("/reserve", async (req, res) => {
  try {
    const { product, userid, price, token } = req.body;

    try {
      //create customer
      const customer = await stripe.customers.create({
        email: token.email,
        source: token.id,
      });

      //charge payment
      const payment = await stripe.charges.create(
        {
          amount: totalAmount * 100,
          customer: customer.id,
          currency: "USD",
          receipt_email: token.email,
        },
        {
          idempotencyKey: uuidv4(),
        }
      );

      //Payment Success
      if (payment) {
        try {
          const newBuy = new Buy({
            product: product.name,
            productid: product._id,
            userid,

            price: price,

            transactionid: uuidv4(),
          });

          const buy = await newBuy.save();

          const productTmp = await Product.findOne({ _id: product._id });
          productTmp.currentbuys.push({
            buyid: buy._id,

            userid: userid,
            status: buy.status,
          });

          await productTmp.save();
          res.send("Payment Successful, Your Product is booked");
        } catch (error) {
          return res.status(400).json({ message: error });
        }
      }
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

module.exports = router;
