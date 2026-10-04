const pool = require("../config/db");


const getRecommendation = async (req, res) => {

    try {

        const { userId } = req.params;


        if (!userId) {

            return res.status(400).json({
                message: "User ID is required"
            });

        }


        // Get user's recent activities
        const [activities] = await pool.query(
            `SELECT
                a.name AS activity_name,
                ua.quantity,
                ua.frequency,
                ua.co2_saved,
                ua.impact,
                ua.ml_prediction

             FROM user_activities ua

             JOIN activities a
                ON ua.activity_id = a.id

             WHERE ua.user_id = ?

             ORDER BY
                ua.activity_date DESC,
                ua.created_at DESC

             LIMIT 10`,
            [userId]
        );


        // No activities yet
        if (activities.length === 0) {

            return res.json({

                recommendation:
                    "Start by recording a green activity such as walking, cycling or using public transport.",

                reason:
                    "No activity history is available yet."

            });

        }


        // Count activity types
        const activityCounts = {};


        activities.forEach(
            function (activity) {

                const name =
                    activity.activity_name;


                if (!activityCounts[name]) {

                    activityCounts[name] = 0;

                }


                activityCounts[name]++;

            }
        );


        // Find most frequently recorded activity
        let mostFrequentActivity =
            activities[0].activity_name;


        let highestCount = 0;


        Object.keys(activityCounts).forEach(
            function (activityName) {

                if (
                    activityCounts[activityName]
                    > highestCount
                ) {

                    highestCount =
                        activityCounts[activityName];

                    mostFrequentActivity =
                        activityName;

                }

            }
        );


        let recommendation =
            "Continue your current green activities and try adding another sustainable activity to your routine.";


        let reason =
            "Maintaining a variety of eco-friendly activities can increase your overall environmental contribution.";


        // Rule 1: Cycling
        if (
            mostFrequentActivity ===
            "Cycling"
        ) {

            recommendation =
                "Try combining cycling with public transport for longer journeys.";

            reason =
                "You frequently record cycling activities. Combining different sustainable transport options can make your routine more flexible.";

        }


        // Rule 2: Walking
        else if (
            mostFrequentActivity ===
            "Walking"
        ) {

            recommendation =
                "Consider increasing your walking distance for short trips instead of using motor vehicles.";

            reason =
                "Walking is one of the recorded activities in your recent activity history.";

        }


        // Rule 3: Public Transport
        else if (
            mostFrequentActivity ===
            "Public Transport"
        ) {

            recommendation =
                "Try replacing some private vehicle trips with public transport.";

            reason =
                "You frequently use public transport as part of your sustainable activity pattern.";

        }


        // Rule 4: Carpooling
        else if (
            mostFrequentActivity ===
            "Carpooling"
        ) {

            recommendation =
                "Continue carpooling and consider using public transport for suitable journeys.";

            reason =
                "Carpooling reduces the environmental impact of individual vehicle travel.";

        }


        // Rule 5: Tree Planting
        else if (
            mostFrequentActivity ===
            "Tree Planting"
        ) {

            recommendation =
                "Continue planting trees and combine it with sustainable daily activities such as cycling or walking.";

            reason =
                "Your activity history shows regular participation in tree planting.";

        }


        // Rule 6: LED Usage
        else if (
            mostFrequentActivity ===
            "LED Usage"
        ) {

            recommendation =
                "Continue using LED lighting and try reducing unnecessary electricity usage.";

            reason =
                "Your recent activities show a focus on energy-efficient lighting.";

        }


        // Rule 7: Electricity Saving
        else if (
            mostFrequentActivity ===
            "Electricity Saving"
        ) {

            recommendation =
                "Continue saving electricity and consider using energy-efficient appliances.";

            reason =
                "Your recent activity history shows a focus on reducing electricity consumption.";

        }


        // Rule 8: Reusable Bottle
        else if (
            mostFrequentActivity ===
            "Reusable Bottle"
        ) {

            recommendation =
                "Continue using reusable products and reduce other single-use plastic items.";

            reason =
                "Your activity history shows an effort to reduce single-use plastic consumption.";

        }


        res.json({

            user_id:
                Number(userId),

            based_on_activity:
                mostFrequentActivity,

            recommendation:
                recommendation,

            reason:
                reason

        });


    } catch (error) {

        console.error(
            "Recommendation error:",
            error.message
        );


        res.status(500).json({

            message:
                "Failed to generate recommendation"

        });

    }

};


module.exports = {
    getRecommendation
};