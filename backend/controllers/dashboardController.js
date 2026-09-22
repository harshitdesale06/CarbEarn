const pool = require("../config/db");


const getDashboardSummary = async (req, res) => {
    try {
        const { userId } = req.params;


        if (!userId) {
            return res.status(400).json({
                message: "User ID is required"
            });
        }


        // Check whether user exists
        const [users] = await pool.query(
            `SELECT id, name, email, college
             FROM users
             WHERE id = ?`,
            [userId]
        );


        if (users.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }


        const user = users[0];


        // Get overall statistics
        const [summary] = await pool.query(
            `SELECT
                COUNT(*) AS total_activities,
                COALESCE(SUM(co2_saved), 0) AS total_co2_saved,
                COALESCE(SUM(points), 0) AS total_points,
                SUM(CASE WHEN impact = 'Low' THEN 1 ELSE 0 END) AS low_impact,
                SUM(CASE WHEN impact = 'Medium' THEN 1 ELSE 0 END) AS medium_impact,
                SUM(CASE WHEN impact = 'High' THEN 1 ELSE 0 END) AS high_impact
             FROM user_activities
             WHERE user_id = ?`,
            [userId]
        );


        const data = summary[0];


        const totalCO2 = Number(data.total_co2_saved);
        const totalPoints = Number(data.total_points);
        const totalActivities = Number(data.total_activities);


        // Determine overall impact
        let overallImpact = "Low";


        if (totalCO2 >= 20) {
            overallImpact = "High";
        } else if (totalCO2 >= 5) {
            overallImpact = "Medium";
        }


        res.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                college: user.college
            },

            summary: {
                total_activities: totalActivities,
                total_co2_saved: Number(totalCO2.toFixed(2)),
                total_points: totalPoints,
                overall_impact: overallImpact
            },

            impact_breakdown: {
                low: Number(data.low_impact),
                medium: Number(data.medium_impact),
                high: Number(data.high_impact)
            }
        });


    } catch (error) {
        console.error("Dashboard error:", error.message);

        res.status(500).json({
            message: "Failed to fetch dashboard data"
        });
    }
};


module.exports = {
    getDashboardSummary
};