require("dotenv").config();

const app = require("../server/app");
const { connectDatabase } = require("../server/services/database");

let ready = null;

module.exports = async (req, res) => {
  if (!ready) ready = connectDatabase();
  await ready;
  return app(req, res);
};
