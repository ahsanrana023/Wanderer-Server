const mongoose = require("mongoose");

const buyproductSchema = mongoose.Schema(
  {
    product: { type: String, required: true },
    status: { type: String, required: true, default: "purchased" },
    transactionid: { type: String, required: true },
    productid: { type: String, required: true },
    userid: { type: String, required: true },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const buyproductModel = mongoose.model("buyproducts", buyproductSchema);

module.exports = buyproductModel;
