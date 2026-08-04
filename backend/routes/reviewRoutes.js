const express = require("express");
const { createReview, getVehicleReviews } = require("../controllers/reviewController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/", protect, createReview);
router.get("/vehicle/:vehicleId", getVehicleReviews);

module.exports = router;
