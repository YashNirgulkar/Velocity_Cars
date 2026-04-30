require("dotenv").config();

const app = require("./app");
const { connectDatabase, getDatabaseMode } = require("./services/database");

const PORT = process.env.PORT || 5000;

connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`VELOCE API running on http://localhost:${PORT} (${getDatabaseMode()})`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server", error);
    process.exit(1);
  });
