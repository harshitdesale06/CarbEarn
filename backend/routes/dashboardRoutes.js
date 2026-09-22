const express = require("express");

const {
    getDashboardSummary
} = require("../controllers/dashboardController");

const router = express.Router();


router.get("/:userId", getDashboardSummary);


module.exports = router;