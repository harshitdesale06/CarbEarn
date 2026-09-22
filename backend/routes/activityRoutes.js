const express = require("express");

const {
    getActivities,
    addUserActivity,
    getUserActivityHistory
} = require("../controllers/activityController");

const router = express.Router();


// Get all available activities
router.get("/", getActivities);


// Add activity
router.post("/add", addUserActivity);


// Get user's activity history
router.get("/user/:userId", getUserActivityHistory);


module.exports = router;