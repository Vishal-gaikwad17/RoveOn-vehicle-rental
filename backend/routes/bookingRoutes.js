const express = require("express");
const {
  createBooking,
  getMyBookings,
  getBookingById,
  getAllBookings,
  updateBookingStatus,
  cancelMyBooking,
} = require("../controllers/bookingController");
const { protect, admin } = require("../middleware/auth");

const router = express.Router();

router.post("/", protect, createBooking);
router.get("/my", protect, getMyBookings);
router.get("/", protect, admin, getAllBookings);
router.get("/:id", protect, getBookingById);
router.patch("/:id/status", protect, admin, updateBookingStatus);
router.patch("/:id/cancel", protect, cancelMyBooking);

module.exports = router;
