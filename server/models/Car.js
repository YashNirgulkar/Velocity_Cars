const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, enum: ["SUV", "Sedan", "Sports", "Electric"], required: true },
    price: { type: Number, required: true },
    hp: { type: Number, required: true },
    topSpeed: { type: Number, required: true },
    zeroToHundred: { type: String, default: "3.4s" },
    image: { type: String, required: true },
    description: { type: String, required: true },
    accent: { type: String, default: "#d6a64f" },
    specs: {
      drivetrain: { type: String, default: "AWD" },
      range: { type: String, default: "620 km" },
      torque: { type: String, default: "780 Nm" },
      transmission: { type: String, default: "8-speed performance automatic" }
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

module.exports = mongoose.model("Car", carSchema);
