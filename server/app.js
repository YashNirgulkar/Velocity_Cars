const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const { getDatabaseMode } = require("./services/database");
const carRoutes = require("./routes/cars");
const orderRoutes = require("./routes/orders");
const contactRoutes = require("./routes/contact");
const authRoutes = require("./routes/auth");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || true,
    credentials: true
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "tiny" : "dev"));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, mode: getDatabaseMode(), brand: "VELOCE MOTORS" });
});

app.use("/api/cars", carRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/auth", authRoutes);

if (process.env.NODE_ENV === "production" && !process.env.VERCEL) {
  const clientDist = path.join(__dirname, "..", "client", "dist");
  app.use(express.static(clientDist));
  app.get("*", (_req, res) => res.sendFile(path.join(clientDist, "index.html")));
}

app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

module.exports = app;
