const pool = require("../config/connect");

const keepAlive = async (req, res) => {
    try {
        await pool.query("SELECT 1");

        res.status(200).json({
            success: true,
            message: "Database service is alive",
            timestamp: new Date()
        });

    } catch (error) {
        console.error("KeepAlive Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Database unreachable or powered off",
            error: error.message
        });
    }
};

module.exports = { keepAlive };