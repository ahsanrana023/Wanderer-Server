const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: { type: String, required: true }, // String is shorthand for {type: String}
  price: { type: Number, required: true },
  dicription: { type: String, required: true },
  imageurls: [],
});

const productsModel = mongoose.model("products", productSchema);
module.exports = productsModel;
