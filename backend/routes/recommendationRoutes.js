const express = require("express");

const {
    getRecommendation
} = require("../controllers/recommendationController");

const router = express.Router();


router.get(
    "/:userId",
    getRecommendation
);


module.exports = router;