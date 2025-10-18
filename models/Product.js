import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  title:        String,
  description:  String,
  image:        String,
  price:        Number,
  status: {
    type:     String,
    enum:     ["instock", "outofstock"],
    default:  "outofstock"
  },

});


export default mongoose.models.Product || mongoose.model("Product", ProductSchema);