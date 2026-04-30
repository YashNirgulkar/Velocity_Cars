const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { repositories, publicUser } = require("../services/database");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

function signToken(user) {
  return jwt.sign({ id: user.id || user._id?.toString(), role: user.role }, process.env.JWT_SECRET || "veloce-dev-secret", {
    expiresIn: "7d"
  });
}

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await repositories.users.findByEmail(email);
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

    const safeUser = publicUser({ ...(typeof user.toObject === "function" ? user.toObject() : user), id: user.id || user._id?.toString() });
    res.json({ token: signToken(safeUser), user: safeUser });
  } catch (error) {
    next(error);
  }
});

router.get("/me", protect, async (req, res) => {
  res.json(req.user);
});

module.exports = router;
