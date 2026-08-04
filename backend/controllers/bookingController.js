const asyncHandler = require("express-async-handler");
const Booking = require("../models/Booking");
const Vehicle = require("../models/Vehicle");
const calculatePrice = require("../utils/calculatePrice");
const sendEmail = require("../utils/sendEmail");
const { bookingNotificationTemplate } = require("../utils/emailTemplates");

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = asyncHandler(async (req, res) => {
  const { vehicleId, rentalType, startDate, endDate } = req.body;

  if (!vehicleId || !rentalType || !startDate || !endDate) {
    res.status(400);
    throw new Error("vehicleId, rentalType, startDate and endDate are required");
  }

  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle) {
    res.status(404);
    throw new Error("Vehicle not found");
  }

  if (!vehicle.available) {
    res.status(400);
    throw new Error("This vehicle is currently unavailable for booking");
  }

  // Prevent overlapping bookings for the same vehicle
  const overlap = await Booking.findOne({
    vehicleId,
    status: { $in: ["pending", "confirmed", "ongoing"] },
    startDate: { $lte: new Date(endDate) },
    endDate: { $gte: new Date(startDate) },
  });

  if (overlap) {
    res.status(400);
    throw new Error("Vehicle is already booked for the selected dates");
  }

  const { totalPrice } = calculatePrice(vehicle, startDate, endDate, rentalType);

  const booking = await Booking.create({
    userId: req.user._id,
    vehicleId,
    rentalType,
    startDate,
    endDate,
    totalPrice,
    status: "pending",
  });

  const populated = await booking.populate("vehicleId", "name type images pricePerDay pricePerMonth");

  // Notify the admin by email. This runs after the response-worthy work is
  // done and never blocks or fails the booking itself if email is misconfigured.
  if (process.env.ADMIN_EMAIL) {
    const { subject, text, html } = bookingNotificationTemplate({
      booking,
      vehicle,
      user: req.user,
    });
    sendEmail({ to: process.env.ADMIN_EMAIL, subject, text, html });
  }

  res.status(201).json({ success: true, data: populated });
});

// @desc    Get bookings for the logged-in user
// @route   GET /api/bookings/my
// @access  Private
const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ userId: req.user._id })
    .populate("vehicleId", "name type images pricePerDay pricePerMonth")
    .sort({ createdAt: -1 });

  res.json({ success: true, count: bookings.length, data: bookings });
});

// @desc    Get a single booking by id (owner or admin only)
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("vehicleId")
    .populate("userId", "name email");

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  const isOwner = booking.userId._id.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to view this booking");
  }

  res.json({ success: true, data: booking });
});

// @desc    Get all bookings (admin)
// @route   GET /api/bookings
// @access  Private/Admin
const getAllBookings = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const query = {};
  if (status) query.status = status;

  const bookings = await Booking.find(query)
    .populate("vehicleId", "name type images")
    .populate("userId", "name email")
    .sort({ createdAt: -1 });

  res.json({ success: true, count: bookings.length, data: bookings });
});

// @desc    Update booking status (confirm, cancel, complete)
// @route   PATCH /api/bookings/:id/status
// @access  Private/Admin
const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ["pending", "confirmed", "ongoing", "completed", "cancelled"];

  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error("Invalid booking status");
  }

  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  booking.status = status;
  await booking.save();

  res.json({ success: true, data: booking });
});

// @desc    Cancel own booking
// @route   PATCH /api/bookings/:id/cancel
// @access  Private
const cancelMyBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  if (booking.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to cancel this booking");
  }

  if (["completed", "cancelled"].includes(booking.status)) {
    res.status(400);
    throw new Error(`Booking is already ${booking.status}`);
  }

  booking.status = "cancelled";
  await booking.save();

  res.json({ success: true, data: booking });
});

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  getAllBookings,
  updateBookingStatus,
  cancelMyBooking,
};
