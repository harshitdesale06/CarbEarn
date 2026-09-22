const pool = require("../config/db");


// Get all available activities
const getActivities = async (req, res) => {

    try {

        const [activities] = await pool.query(
            `SELECT
                id,
                name,
                unit,
                emission_factor,
                description
             FROM activities
             ORDER BY id`
        );

        res.json({
            activities: activities
        });

    } catch (error) {

        console.error(
            "Get activities error:",
            error.message
        );

        res.status(500).json({
            message: "Failed to fetch activities"
        });
    }
};



// Add activity performed by a user
const addUserActivity = async (req, res) => {

    try {

        const {
            user_id,
            activity_id,
            quantity,
            frequency,
            activity_date,
            ml_prediction
        } = req.body;


        if (
            !user_id ||
            !activity_id ||
            !quantity ||
            !frequency ||
            !activity_date
        ) {

            return res.status(400).json({
                message:
                    "User ID, activity ID, quantity, frequency and date are required"
            });

        }


        const [activities] = await pool.query(
            `SELECT
                id,
                name,
                unit,
                emission_factor
             FROM activities
             WHERE id = ?`,
            [activity_id]
        );


        if (activities.length === 0) {

            return res.status(404).json({
                message: "Activity not found"
            });

        }


        const activity =
            activities[0];


        const co2Saved =
            Number(quantity) *
            Number(activity.emission_factor);


        const points =
            Math.round(co2Saved * 10);


        let impact;


        if (co2Saved < 1) {

            impact = "Low";

        } else if (co2Saved <= 5) {

            impact = "Medium";

        } else {

            impact = "High";

        }


        const [result] = await pool.query(

            `INSERT INTO user_activities
            (
                user_id,
                activity_id,
                quantity,
                frequency,
                co2_saved,
                points,
                impact,
                ml_prediction,
                activity_date
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            
            [
                user_id,
                activity_id,
                quantity,
                frequency,
                co2Saved,
                points,
                impact,
                ml_prediction || null,
                activity_date
            ]

        );


        res.status(201).json({

            message:
                "Activity added successfully",

            activity: {

                id:
                    result.insertId,

                user_id:
                    user_id,

                activity_id:
                    activity_id,

                activity_name:
                    activity.name,

                unit:
                    activity.unit,

                quantity:
                    Number(quantity),

                frequency:
                    Number(frequency),

                co2_saved:
                    Number(
                        co2Saved.toFixed(2)
                    ),

                points:
                    points,

                impact:
                    impact,

                ml_prediction:
                    ml_prediction || null,

                activity_date:
                    activity_date

            }

        });


    } catch (error) {

        console.error(
            "Add activity error:",
            error.message
        );

        res.status(500).json({
            message:
                "Failed to add activity"
        });

    }
};



// Get activity history for a user
const getUserActivityHistory = async (req, res) => {

    try {

        const {
            userId
        } = req.params;


        if (!userId) {

            return res.status(400).json({
                message:
                    "User ID is required"
            });

        }


        const [activities] =
            await pool.query(

                `SELECT
                    ua.id,
                    ua.user_id,
                    a.id AS activity_id,
                    a.name AS activity_name,
                    a.unit,
                    ua.quantity,
                    ua.frequency,
                    ua.co2_saved,
                    ua.points,
                    ua.impact,
                    ua.ml_prediction,
                    ua.activity_date,
                    ua.created_at

                 FROM user_activities ua

                 JOIN activities a
                    ON ua.activity_id = a.id

                 WHERE ua.user_id = ?

                 ORDER BY
                    ua.activity_date DESC,
                    ua.created_at DESC`,

                [userId]

            );


        res.json({

            user_id:
                Number(userId),

            total_activities:
                activities.length,

            activities:
                activities

        });


    } catch (error) {

        console.error(
            "Get activity history error:",
            error.message
        );

        res.status(500).json({

            message:
                "Failed to fetch activity history"

        });

    }
};



module.exports = {

    getActivities,

    addUserActivity,

    getUserActivityHistory

};