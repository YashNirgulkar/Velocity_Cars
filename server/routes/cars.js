const express = require("express");
const { repositories } = require("../services/database");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const cars = await repositories.cars.find({ category: req.query.category });
    res.json(cars);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const car = await repositories.cars.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });
    return res.json(car);
  } catch (error) {
    next(error);
  }
});

router.post("/", protect, adminOnly, async (req, res, next) => {
  try {
    const car = await repositories.cars.create(req.body);
    res.status(201).json(car);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", protect, adminOnly, async (req, res, next) => {
  try {
    const car = await repositories.cars.update(req.params.id, req.body);
    if (!car) return res.status(404).json({ message: "Car not found" });
    return res.json(car);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", protect, adminOnly, async (req, res, next) => {
  try {
    const car = await repositories.cars.delete(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });
    return res.json({ message: "Car deleted", car });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
