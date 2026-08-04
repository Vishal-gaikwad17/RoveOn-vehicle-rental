const asyncHandler = require("express-async-handler");
const Review = require("../models/Review");
const Booking = require("../models/Booking");
const Vehicle = require("../models/Vehicle");

// Recalculate and store a vehicle's average rating
const refreshVehicleRating = async (vehicleId) => {
  const stats = await Review.aggregate([
    { $match: { vehicleId } },
    { $group: { _id: "$vehicleId", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);

  await Vehicle.findByIdAndUpdate(vehicleId, {
    ratingsAverage: stats[0]?.avgRating || 0,
    ratingsCount: stats[0]?.count || 0,
  });
};

// @desc    Create a review for a completed booking
// @route   POST /api/reviews
// @access  Private
const createReview = asyncHandler(async (req, res) => {
  const { bookingId, rating, comment } = req.body;

  if (!bookingId || !rating) {
    res.status(400);
    throw new Error("bookingId and rating are required");
  }

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  if (booking.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to review this booking");
  }

  if (booking.status !== "completed") {
    res.status(400);
    throw new Error("You can only review a completed rental");
  }

  const existing = await Review.findOne({ bookingId });
  if (existing) {
    res.status(400);
    throw new Error("You have already reviewed this booking");
  }

  const review = await Review.create({
    userId: req.user._id,
    vehicleId: booking.vehicleId,
    bookingId,
    rating,
    comment,
  });

  await refreshVehicleRating(booking.vehicleId);

  res.status(201).json({ success: true, data: review });
});

// @desc    Get all reviews for a vehicle
// @route   GET /api/reviews/vehicle/:vehicleId
// @access  Public
const getVehicleReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ vehicleId: req.params.vehicleId })
    .populate("userId", "name")
    .sort({ createdAt: -1 });

  res.json({ success: true, count: reviews.length, data: reviews });
});

module.exports = { createReview, getVehicleReviews };
