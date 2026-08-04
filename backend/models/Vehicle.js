const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Vehicle name is required"],
      trim: true,
    },
    type: {
      type: String,
      required: [true, "Vehicle type is required"],
      enum: ["car", "bike", "scooter"], // scooter = electric scooter
    },
    brand: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    pricePerDay: {
      type: Number,
      required: [true, "Price per day is required"],
      min: 0,
    },
    pricePerMonth: {
      type: Number,
      required: [true, "Price per month is required"],
      min: 0,
    },
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String }, // used if Cloudinary is enabled
      },
    ],
    available: {
      type: Boolean,
      default: true,
    },
    location: {
      city: { type: String, trim: true },
      lat: { type: Number },
      lng: { type: Number },
    },
    // Bonus: electric scooter battery status (only relevant when type === "scooter")
    batteryStatus: {
      type: Number, // percentage 0-100
      min: 0,
      max: 100,
      default: undefined,
    },
    seats: { type: Number }, // relevant for cars
    fuelType: {
      type: String,
      enum: ["petrol", "diesel", "electric", "hybrid", "none"],
      default: "none",
    },
    ratingsAverage: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    ratingsCount: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

vehicleSchema.index({ type: 1, available: 1 });
vehicleSchema.index({ pricePerDay: 1 });
vehicleSchema.index({ "location.city": 1 });

module.exports = mongoose.model("Vehicle", vehicleSchema);
