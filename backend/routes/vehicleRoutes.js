const express = require("express");
const {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  setAvailability,
} = require("../controllers/vehicleController");
const { protect, admin } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

router.get("/", getVehicles);
router.get("/:id", getVehicleById);

// Admin-only routes
router.post("/", protect, admin, upload.array("images", 5), createVehicle);
router.put("/:id", protect, admin, upload.array("images", 5), updateVehicle);
router.delete("/:id", protect, admin, deleteVehicle);
router.patch("/:id/availability", protect, admin, setAvailability);

module.exports = router;
