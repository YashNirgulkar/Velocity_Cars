const express = require("express");
const { repositories } = require("../services/database");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, adminOnly, async (_req, res, next) => {
  try {
    res.json(await repositories.contacts.find());
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const contact = await repositories.contacts.create(req.body);
    res.status(201).json({ message: "Message received", contact });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
