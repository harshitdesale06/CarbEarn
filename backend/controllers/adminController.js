const pool = require("../config/db");

const getAdminOverview = async (req, res) => {
    try {
        const [userCount] = await pool.query(
            "SELECT COUNT(*) AS totalUsers FROM users"
        );

        const [activityCount] = await pool.query(
            "SELECT COUNT(*) AS totalActivities FROM user_activities"
        );

        const [carbonStats] = await pool.query(
            `SELECT
                COALESCE(SUM(co2_saved), 0) AS totalCO2Saved,
                COUNT(DISTINCT user_id) AS activeUsers
             FROM user_activities`
        );

        res.json({
            totalUsers: userCount[0].totalUsers,
            totalActivities: activityCount[0].totalActivities,
            totalCO2Saved: carbonStats[0].totalCO2Saved,
            activeUsers: carbonStats[0].activeUsers
        });

    } catch (error) {
        console.error("Admin overview error:", error.message);

        res.status(500).json({
            message: "Failed to load admin overview."
        });
    }
};


const getAdminUsers = async (req, res) => {
    try {
        const [users] = await pool.query(
            `SELECT
                id,
                name,
                email,
                college,
                role,
                created_at
             FROM users
             ORDER BY id DESC`
        );

        res.json(users);

    } catch (error) {
        console.error("Admin users error:", error.message);

        res.status(500).json({
            message: "Failed to load users."
        });
    }
};


const getRecentAdminActivities = async (req, res) => {
    try {
        const [activities] = await pool.query(
            `SELECT
                ua.id,
                u.name AS user_name,
                a.name AS activity_name,
                ua.quantity,
                a.unit,
                ua.co2_saved,
                ua.points,
                ua.impact,
                ua.activity_date,
                ua.created_at
             FROM user_activities ua
             JOIN users u ON ua.user_id = u.id
             JOIN activities a ON ua.activity_id = a.id
             ORDER BY ua.created_at DESC
             LIMIT 10`
        );

        res.json(activities);

    } catch (error) {
        console.error("Admin activities error:", error.message);

        res.status(500).json({
            message: "Failed to load recent activities."
        });
    }
};


module.exports = {
    getAdminOverview,
    getAdminUsers,
    getRecentAdminActivities
};