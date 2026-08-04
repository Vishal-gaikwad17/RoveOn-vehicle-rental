// Run with: npm run seed
// Creates one admin user and a handful of sample vehicles for local testing.
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");
const Vehicle = require("../models/Vehicle");

const run = async () => {
  await connectDB();

  const adminEmail = "admin@vehiclerental.com";
  const existingAdmin = await User.findOne({ email: adminEmail });

  if (!existingAdmin) {
    await User.create({
      name: "Admin",
      email: adminEmail,
      password: "admin123", // change in production
      role: "admin",
    });
    console.log(`Admin created -> email: ${adminEmail} / password: admin123`);
  } else {
    console.log("Admin already exists, skipping.");
  }

  const sampleVehicles = [
    {
      name: "Honda City",
      type: "car",
      brand: "Honda",
      description: "Comfortable sedan, great for city drives and highway trips.",
      pricePerDay: 1800,
      pricePerMonth: 32000,
      seats: 5,
      fuelType: "petrol",
      location: { city: "Pune" },
      images: [],
    },
    {
      name: "Royal Enfield Classic 350",
      type: "bike",
      brand: "Royal Enfield",
      description: "Classic cruiser bike, ideal for weekend rides.",
      pricePerDay: 700,
      pricePerMonth: 12000,
      fuelType: "petrol",
      location: { city: "Pune" },
      images: [],
    },
    {
      name: "Ather 450X",
      type: "scooter",
      brand: "Ather",
      description: "Electric scooter with fast charging and smart dashboard.",
      pricePerDay: 400,
      pricePerMonth: 7000,
      fuelType: "electric",
      batteryStatus: 92,
      location: { city: "Pune" },
      images: [],
    },
  ];

  for (const v of sampleVehicles) {
    const exists = await Vehicle.findOne({ name: v.name });
    if (!exists) {
      await Vehicle.create(v);
      console.log(`Created vehicle: ${v.name}`);
    }
  }

  console.log("Seeding complete.");
  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
