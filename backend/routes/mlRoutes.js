const express = require("express");
const axios = require("axios");

const router = express.Router();


router.post("/predict", async (req, res) => {

    try {

        const {
            activity_type,
            quantity,
            frequency
        } = req.body;


        if (
            !activity_type ||
            quantity === undefined ||
            frequency === undefined
        ) {

            return res.status(400).json({
                message:
                    "Activity type, quantity and frequency are required"
            });

        }


        const response = await axios.post(
            "http://127.0.0.1:5001/predict",
            {
                activity_type: activity_type,
                quantity: quantity,
                frequency: frequency
            }
        );


        res.json({
            message: "ML prediction successful",
            prediction: response.data
        });


    } catch (error) {

        console.error(
            "ML prediction error:",
            error.message
        );


        res.status(500).json({
            message:
                "ML prediction service is unavailable"
        });

    }

});


module.exports = router;