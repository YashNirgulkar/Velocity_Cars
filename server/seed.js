require("dotenv").config();

const { connectDatabase, repositories, getDatabaseMode } = require("./services/database");
const { cars, admin } = require("./seedData");

async function seed() {
  await connectDatabase();
  await repositories.cars.clear();
  await repositories.orders.clear();
  await repositories.contacts.clear();
  await repositories.users.clear();

  for (const car of cars) {
    await repositories.cars.create(car);
  }

  await repositories.users.create(admin);

  console.log(`Seeded ${cars.length} cars and 1 admin user using ${getDatabaseMode()} datastore.`);
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
