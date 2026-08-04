const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    rentalType: {
      type: String,
      enum: ["daily", "monthly"],
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "ongoing", "completed", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid",
    },
  },
  { timestamps: true }
);

bookingSchema.index({ vehicleId: 1, startDate: 1, endDate: 1 });

// Prevent end date before start date
bookingSchema.pre("validate", function (next) {
  if (this.endDate < this.startDate) {
    return next(new Error("End date cannot be before start date"));
  }
  next();
});

module.exports = mongoose.model("Booking", bookingSchema);
