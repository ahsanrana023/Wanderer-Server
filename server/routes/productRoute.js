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
    const productid = req.body.productid;
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

// router.post("/buyproduct", async (req, res) => {
//   try {
//     const { product, userid, price, token } = req.body;

//     try {
//       //create customer
//       const customer = await stripe.customers.create({
//         email: token.email,
//         source: token.id,
//       });

//       //charge payment
//       const payment = await stripe.charges.create(
//         {
//           customer: customer.id,
//           currency: "USD",
//           receipt_email: token.email,
//         },
//         {
//           idempotencyKey: uuidv4(),
//         }
//       );

//       //Payment Success
//       if (payment) {
//         try {
//           const newBuy = new Buy({
//             product: product.name,
//             productid: product._id,
//             userid,

//             price: price,

//             transactionid: uuidv4(),
//           });

//           const Buy = await newBuy.save();

//           const productTmp = await Product.findOne({ _id: product._id });
//           productTmp.currentbuys.push({
//             buyid: Buy._id,

//             userid: userid,
//             status: Buy.status,
//           });

//           await productTmp.save();
//           res.send("Payment Successful, Your Product is booked");
//         } catch (error) {
//           return res.status(400).json({ message: error });
//         }
//       }
//     } catch (error) {
//       return res.status(400).json({ message: error });
//     }
//   } catch (error) {
//     return res.status(400).json({ message: error });
//   }
// });
router.post("/bookproduct", async (req, res) => {
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
          price: price * 100,
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
          const newBooking = new Booking({
            product: product.name,
            tourid: product._id,
            userid,
            price: price,
            transactionid: uuidv4(),
          });

          const Booking = await newBooking.save();

          const productTmp = await Product.findOne({ _id: product._id });
          productTmp.currentbookings.push({
            bookingid: Booking._id,

            userid: userid,
            status: Booking.status,
          });

          await productTmp.save();
          res.send("Payment Successful, Your product is booked");
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
