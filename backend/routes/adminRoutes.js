const express = require("express");

const {
    getAdminOverview,
    getAdminUsers,
    getRecentAdminActivities
} = require("../controllers/adminController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// All routes below require a valid token and ADMIN role.
router.use(authMiddleware);
router.use(adminMiddleware);

// Admin dashboard overview
router.get("/overview", getAdminOverview);

// List registered users
router.get("/users", getAdminUsers);

// View recent activities
router.get("/activities", getRecentAdminActivities);

module.exports = router;