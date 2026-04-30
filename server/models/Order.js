const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true }
    },
    model: { type: String, required: true },
    modelId: { type: String },
    color: { type: String, required: true },
    wheels: { type: String, required: true },
    interior: { type: String, required: true },
    packages: [{ type: String }],
    totalPrice: { type: Number, required: true },
    status: { type: String, default: "Pending" }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

module.exports = mongoose.model("Order", orderSchema);
