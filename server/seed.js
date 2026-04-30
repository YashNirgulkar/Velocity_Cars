require("dotenv").config();

const { connectDatabase, repositories, getDatabaseMode } = require("./services/database");

const cars = [
  {
    name: "Veloce Aeterna GT",
    category: "Sports",
    price: 284000,
    hp: 720,
    topSpeed: 338,
    zeroToHundred: "2.9s",
    image: "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1400&q=85",
    accent: "#d63f31",
    description: "A carbon-bodied grand tourer built for brutal acceleration and long-distance composure.",
    specs: { drivetrain: "AWD", range: "540 km", torque: "820 Nm", transmission: "8-speed dual-clutch" }
  },
  {
    name: "Veloce Nero V12",
    category: "Sports",
    price: 412000,
    hp: 830,
    topSpeed: 352,
    zeroToHundred: "2.7s",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=85",
    accent: "#c59b4b",
    description: "A naturally aspirated flagship with theatre, precision, and a hand-built twelve-cylinder heart.",
    specs: { drivetrain: "RWD", range: "480 km", torque: "760 Nm", transmission: "7-speed ISR" }
  },
  {
    name: "Veloce Maranello S",
    category: "Sedan",
    price: 158000,
    hp: 560,
    topSpeed: 306,
    zeroToHundred: "3.5s",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1400&q=85",
    accent: "#b91c1c",
    description: "Executive calm meets track-bred engineering in a sedan designed for velocity without effort.",
    specs: { drivetrain: "AWD", range: "690 km", torque: "710 Nm", transmission: "9-speed automatic" }
  },
  {
    name: "Veloce Imperia",
    category: "Sedan",
    price: 192000,
    hp: 610,
    topSpeed: 318,
    zeroToHundred: "3.3s",
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1400&q=85",
    accent: "#d6a64f",
    description: "A long-wheelbase limousine with molten-metal torque delivery and couture-level cabin craft.",
    specs: { drivetrain: "AWD", range: "760 km", torque: "880 Nm", transmission: "8-speed silk shift" }
  },
  {
    name: "Veloce Terra XR",
    category: "SUV",
    price: 176000,
    hp: 640,
    topSpeed: 292,
    zeroToHundred: "3.6s",
    image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1400&q=85",
    accent: "#a67c2d",
    description: "A high-riding performance flagship with adaptive air suspension and forged all-terrain poise.",
    specs: { drivetrain: "AWD", range: "705 km", torque: "920 Nm", transmission: "8-speed terrain adaptive" }
  },
  {
    name: "Veloce Atlas Q",
    category: "SUV",
    price: 149000,
    hp: 520,
    topSpeed: 268,
    zeroToHundred: "4.1s",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1400&q=85",
    accent: "#e23b2f",
    description: "A sculpted luxury SUV with quiet authority, limousine seating, and relentless traction.",
    specs: { drivetrain: "AWD", range: "740 km", torque: "780 Nm", transmission: "9-speed automatic" }
  },
  {
    name: "Veloce Eon R",
    category: "Electric",
    price: 218000,
    hp: 760,
    topSpeed: 322,
    zeroToHundred: "2.8s",
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1400&q=85",
    accent: "#d6a64f",
    description: "A tri-motor electric coupe with instant torque, active aero, and silent violence.",
    specs: { drivetrain: "Tri-motor AWD", range: "830 km", torque: "1040 Nm", transmission: "Single-speed" }
  },
  {
    name: "Veloce Volta Luxe",
    category: "Electric",
    price: 168000,
    hp: 590,
    topSpeed: 286,
    zeroToHundred: "3.7s",
    image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=1400&q=85",
    accent: "#e5b657",
    description: "A silent executive EV with lounge-grade comfort and a 900-volt charging architecture.",
    specs: { drivetrain: "Dual-motor AWD", range: "910 km", torque: "840 Nm", transmission: "Single-speed" }
  }
];

async function seed() {
  await connectDatabase();
  await repositories.cars.clear();
  await repositories.orders.clear();
  await repositories.contacts.clear();
  await repositories.users.clear();

  for (const car of cars) {
    await repositories.cars.create(car);
  }

  await repositories.users.create({
    name: "Veloce Administrator",
    email: "admin@veloce.com",
    password: "admin123",
    role: "admin"
  });

  console.log(`Seeded ${cars.length} cars and 1 admin user using ${getDatabaseMode()} datastore.`);
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
