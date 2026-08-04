const express = require("express");
const { getUsers, deleteUser } = require("../controllers/userController");
const { protect, admin } = require("../middleware/auth");

const router = express.Router();

router.get("/", protect, admin, getUsers);
router.delete("/:id", protect, admin, deleteUser);

module.exports = router;
