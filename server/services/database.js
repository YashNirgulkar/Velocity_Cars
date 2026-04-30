const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const { randomUUID } = require("crypto");
const bcrypt = require("bcryptjs");
const { DatabaseSync } = require("node:sqlite");

const Car = require("../models/Car");
const Order = require("../models/Order");
const Contact = require("../models/Contact");
const User = require("../models/User");

const dataDir = path.join(__dirname, "..", "data");
const sqliteFile = path.join(dataDir, "veloce.sqlite");
let mode = "memory";
let sqlite = null;

function parseJson(value, fallback) {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch (_error) {
    return fallback;
  }
}

function serialize(value) {
  return JSON.stringify(value || {});
}

function ensureSqlite() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  sqlite = new DatabaseSync(sqliteFile);
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS cars (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price INTEGER NOT NULL,
      hp INTEGER NOT NULL,
      topSpeed INTEGER NOT NULL,
      zeroToHundred TEXT,
      image TEXT NOT NULL,
      description TEXT NOT NULL,
      accent TEXT,
      specs TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      customer TEXT NOT NULL,
      model TEXT NOT NULL,
      modelId TEXT,
      color TEXT NOT NULL,
      wheels TEXT NOT NULL,
      interior TEXT NOT NULL,
      packages TEXT,
      totalPrice INTEGER NOT NULL,
      status TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS contacts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      role TEXT NOT NULL,
      passwordHash TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
  `);
}

function publicUser(user) {
  if (!user) return null;
  const plain = typeof user.toObject === "function" ? user.toObject() : user;
  const { password, passwordHash, __v, ...safeUser } = plain;
  return { ...safeUser, id: safeUser.id || safeUser._id?.toString() };
}

function normalizeRecord(record) {
  if (!record) return null;
  const plain = typeof record.toObject === "function" ? record.toObject() : record;
  return {
    ...plain,
    id: plain.id || plain._id?.toString()
  };
}

function normalizeCar(row) {
  if (!row) return null;
  return { ...row, specs: parseJson(row.specs, {}) };
}

function normalizeOrder(row) {
  if (!row) return null;
  return {
    ...row,
    customer: parseJson(row.customer, {}),
    packages: parseJson(row.packages, [])
  };
}

async function connectDatabase() {
  const mongoUri = process.env.MONGO_URI;
  if (mongoUri) {
    try {
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 3500
      });
      mode = "mongo";
      return;
    } catch (error) {
      console.warn(`MongoDB unavailable, using SQLite fallback: ${error.message}`);
    }
  }
  ensureSqlite();
  mode = "sqlite";
}

function getDatabaseMode() {
  return mode;
}

const repositories = {
  cars: {
    async find(query = {}) {
      if (mode === "mongo") {
        const filter = query.category ? { category: query.category } : {};
        const cars = await Car.find(filter).sort({ createdAt: -1 });
        return cars.map(normalizeRecord);
      }
      const rows = query.category
        ? sqlite.prepare("SELECT * FROM cars WHERE category = ? ORDER BY datetime(createdAt) DESC").all(query.category)
        : sqlite.prepare("SELECT * FROM cars ORDER BY datetime(createdAt) DESC").all();
      return rows.map(normalizeCar);
    },
    async findById(id) {
      if (mode === "mongo") return normalizeRecord(await Car.findById(id));
      return normalizeCar(sqlite.prepare("SELECT * FROM cars WHERE id = ?").get(id));
    },
    async create(payload) {
      if (mode === "mongo") return normalizeRecord(await Car.create(payload));
      const now = new Date().toISOString();
      const car = {
        id: randomUUID(),
        zeroToHundred: "3.4s",
        accent: "#d6a64f",
        specs: {},
        ...payload,
        createdAt: now,
        updatedAt: now
      };
      sqlite
        .prepare(
          "INSERT INTO cars (id,name,category,price,hp,topSpeed,zeroToHundred,image,description,accent,specs,createdAt,updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)"
        )
        .run(car.id, car.name, car.category, car.price, car.hp, car.topSpeed, car.zeroToHundred, car.image, car.description, car.accent, serialize(car.specs), car.createdAt, car.updatedAt);
      return normalizeCar({ ...car, specs: serialize(car.specs) });
    },
    async update(id, payload) {
      if (mode === "mongo") {
        return normalizeRecord(await Car.findByIdAndUpdate(id, payload, { new: true, runValidators: true }));
      }
      const existing = await repositories.cars.findById(id);
      if (!existing) return null;
      const car = { ...existing, ...payload, updatedAt: new Date().toISOString() };
      sqlite
        .prepare(
          "UPDATE cars SET name=?,category=?,price=?,hp=?,topSpeed=?,zeroToHundred=?,image=?,description=?,accent=?,specs=?,updatedAt=? WHERE id=?"
        )
        .run(car.name, car.category, car.price, car.hp, car.topSpeed, car.zeroToHundred, car.image, car.description, car.accent, serialize(car.specs), car.updatedAt, id);
      return car;
    },
    async delete(id) {
      if (mode === "mongo") return normalizeRecord(await Car.findByIdAndDelete(id));
      const existing = await repositories.cars.findById(id);
      if (!existing) return null;
      sqlite.prepare("DELETE FROM cars WHERE id = ?").run(id);
      return existing;
    },
    async clear() {
      if (mode === "mongo") return Car.deleteMany({});
      sqlite.prepare("DELETE FROM cars").run();
    }
  },
  orders: {
    async find() {
      if (mode === "mongo") return (await Order.find({}).sort({ createdAt: -1 })).map(normalizeRecord);
      return sqlite.prepare("SELECT * FROM orders ORDER BY datetime(createdAt) DESC").all().map(normalizeOrder);
    },
    async create(payload) {
      if (mode === "mongo") return normalizeRecord(await Order.create(payload));
      const now = new Date().toISOString();
      const order = { ...payload, id: randomUUID(), status: payload.status || "Pending", createdAt: now, updatedAt: now };
      sqlite
        .prepare("INSERT INTO orders (id,customer,model,modelId,color,wheels,interior,packages,totalPrice,status,createdAt,updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)")
        .run(order.id, serialize(order.customer), order.model, order.modelId || "", order.color, order.wheels, order.interior, JSON.stringify(order.packages || []), order.totalPrice, order.status, order.createdAt, order.updatedAt);
      return normalizeOrder({ ...order, customer: serialize(order.customer), packages: JSON.stringify(order.packages || []) });
    },
    async clear() {
      if (mode === "mongo") return Order.deleteMany({});
      sqlite.prepare("DELETE FROM orders").run();
    }
  },
  contacts: {
    async find() {
      if (mode === "mongo") return (await Contact.find({}).sort({ createdAt: -1 })).map(normalizeRecord);
      return sqlite.prepare("SELECT * FROM contacts ORDER BY datetime(createdAt) DESC").all();
    },
    async create(payload) {
      if (mode === "mongo") return normalizeRecord(await Contact.create(payload));
      const now = new Date().toISOString();
      const contact = { ...payload, id: randomUUID(), createdAt: now, updatedAt: now };
      sqlite
        .prepare("INSERT INTO contacts (id,name,email,subject,message,createdAt,updatedAt) VALUES (?,?,?,?,?,?,?)")
        .run(contact.id, contact.name, contact.email, contact.subject, contact.message, contact.createdAt, contact.updatedAt);
      return contact;
    },
    async clear() {
      if (mode === "mongo") return Contact.deleteMany({});
      sqlite.prepare("DELETE FROM contacts").run();
    }
  },
  users: {
    async findByEmail(email) {
      if (mode === "mongo") return User.findOne({ email });
      return sqlite.prepare("SELECT * FROM users WHERE email = ?").get(email);
    },
    async findById(id) {
      if (mode === "mongo") return publicUser(await User.findById(id));
      return publicUser(sqlite.prepare("SELECT * FROM users WHERE id = ?").get(id));
    },
    async create(payload) {
      const passwordHash = await bcrypt.hash(payload.password, 10);
      if (mode === "mongo") {
        const user = await User.create({ ...payload, passwordHash });
        return publicUser(user);
      }
      const now = new Date().toISOString();
      const user = {
        id: randomUUID(),
        name: payload.name,
        email: payload.email,
        role: payload.role || "admin",
        passwordHash,
        createdAt: now,
        updatedAt: now
      };
      sqlite
        .prepare("INSERT INTO users (id,name,email,role,passwordHash,createdAt,updatedAt) VALUES (?,?,?,?,?,?,?)")
        .run(user.id, user.name, user.email, user.role, user.passwordHash, user.createdAt, user.updatedAt);
      return publicUser(user);
    },
    async clear() {
      if (mode === "mongo") return User.deleteMany({});
      sqlite.prepare("DELETE FROM users").run();
    }
  }
};

module.exports = {
  connectDatabase,
  getDatabaseMode,
  repositories,
  publicUser
};
