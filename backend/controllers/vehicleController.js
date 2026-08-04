const asyncHandler = require("express-async-handler");
const Vehicle = require("../models/Vehicle");
const { getFileUrl } = require("../middleware/upload");

// @desc    Get all vehicles with optional filters (type, price range, availability, search, city)
// @route   GET /api/vehicles
// @access  Public
const getVehicles = asyncHandler(async (req, res) => {
  const { type, minPrice, maxPrice, available, search, city, sort, page = 1, limit = 12 } = req.query;

  const query = {};

  if (type) query.type = type;
  if (available !== undefined) query.available = available === "true";
  if (city) query["location.city"] = new RegExp(`^${city}$`, "i");

  if (minPrice || maxPrice) {
    query.pricePerDay = {};
    if (minPrice) query.pricePerDay.$gte = Number(minPrice);
    if (maxPrice) query.pricePerDay.$lte = Number(maxPrice);
  }

  if (search) {
    query.$or = [
      { name: new RegExp(search, "i") },
      { brand: new RegExp(search, "i") },
      { description: new RegExp(search, "i") },
    ];
  }

  const sortMap = {
    price_asc: { pricePerDay: 1 },
    price_desc: { pricePerDay: -1 },
    newest: { createdAt: -1 },
    rating: { ratingsAverage: -1 },
  };

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));

  const [vehicles, total] = await Promise.all([
    Vehicle.find(query)
      .sort(sortMap[sort] || { createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Vehicle.countDocuments(query),
  ]);

  res.json({
    success: true,
    count: vehicles.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    data: vehicles,
  });
});

// @desc    Get single vehicle by ID
// @route   GET /api/vehicles/:id
// @access  Public
const getVehicleById = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) {
    res.status(404);
    throw new Error("Vehicle not found");
  }
  res.json({ success: true, data: vehicle });
});

// @desc    Create a new vehicle (with optional image uploads)
// @route   POST /api/vehicles
// @access  Private/Admin
const createVehicle = asyncHandler(async (req, res) => {
  const {
    name,
    type,
    brand,
    description,
    pricePerDay,
    pricePerMonth,
    available,
    seats,
    fuelType,
    batteryStatus,
    city,
    lat,
    lng,
  } = req.body;

  if (!name || !type || !pricePerDay || !pricePerMonth) {
    res.status(400);
    throw new Error("name, type, pricePerDay and pricePerMonth are required");
  }

  const images = (req.files || []).map((file) => ({
    url: getFileUrl(file),
  }));

  const vehicle = await Vehicle.create({
    name,
    type,
    brand,
    description,
    pricePerDay,
    pricePerMonth,
    available: available !== undefined ? available === "true" || available === true : true,
    seats,
    fuelType,
    batteryStatus: type === "scooter" ? batteryStatus : undefined,
    images,
    location: { city, lat, lng },
    createdBy: req.user._id,
  });

  res.status(201).json({ success: true, data: vehicle });
});

// @desc    Update a vehicle (details, pricing, availability, images)
// @route   PUT /api/vehicles/:id
// @access  Private/Admin
const updateVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) {
    res.status(404);
    throw new Error("Vehicle not found");
  }

  const updatableFields = [
    "name",
    "type",
    "brand",
    "description",
    "pricePerDay",
    "pricePerMonth",
    "available",
    "seats",
    "fuelType",
    "batteryStatus",
  ];

  updatableFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      vehicle[field] = req.body[field];
    }
  });

  if (req.body.city || req.body.lat || req.body.lng) {
    vehicle.location = {
      city: req.body.city ?? vehicle.location?.city,
      lat: req.body.lat ?? vehicle.location?.lat,
      lng: req.body.lng ?? vehicle.location?.lng,
    };
  }

  if (req.files && req.files.length > 0) {
    const newImages = req.files.map((file) => ({ url: getFileUrl(file) }));
    vehicle.images = [...vehicle.images, ...newImages];
  }

  const updated = await vehicle.save();
  res.json({ success: true, data: updated });
});

// @desc    Delete a vehicle
// @route   DELETE /api/vehicles/:id
// @access  Private/Admin
const deleteVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) {
    res.status(404);
    throw new Error("Vehicle not found");
  }
  await vehicle.deleteOne();
  res.json({ success: true, message: "Vehicle deleted successfully" });
});

// @desc    Toggle / set vehicle availability
// @route   PATCH /api/vehicles/:id/availability
// @access  Private/Admin
const setAvailability = asyncHandler(async (req, res) => {
  const { available } = req.body;
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) {
    res.status(404);
    throw new Error("Vehicle not found");
  }
  vehicle.available = available;
  await vehicle.save();
  res.json({ success: true, data: vehicle });
});

module.exports = {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  setAvailability,
};
