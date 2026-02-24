const pool = require('../config/connect.js');

const getLatestPublicRate = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT * 
            FROM rates 
            WHERE rate_type = 'public'
            ORDER BY updated_at DESC 
            LIMIT 1
        `);

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Public rate not available"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Public rate data",
            data: rows[0]  
        });

    } catch (error) {
        console.log("Error getting rates:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const getLatestPrivateRate = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT * 
            FROM rates 
            WHERE rate_type = 'private'
            ORDER BY updated_at DESC 
            LIMIT 1
        `);

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Private rate not available"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Private rate data",
            data: rows[0]  
        });

    } catch (error) {
        console.log("Error getting rates:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const addRate = async (req, res) => {
    try {
        const {
            awak_rate,
            jawak_rate,
            dockawak_rate,
            dockjawak_rate,
            jawakwarning_rate,
            dockjawakwarning_rate,
            checkbox_rate,
            panni_rate,
            potti5_rate,
            potti10_rate,
            solapur_rate,
            rate_type
        } = req.body;

        const fields = [
            awak_rate,
            jawak_rate,
            dockawak_rate,
            dockjawak_rate,
            jawakwarning_rate,
            dockjawakwarning_rate,
            checkbox_rate,
            panni_rate,
            potti5_rate,
            potti10_rate,
            solapur_rate,
            rate_type
        ];

        const hasInvalidField = fields.some(
            field => field === undefined || field === null
        );

        if (hasInvalidField) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const [result] = await pool.query(
            `
            INSERT INTO rates (
                awak_rate,
                jawak_rate,
                dockawak_rate,
                dockjawak_rate,
                jawakwarning_rate,
                dockjawakwarning_rate,
                checkbox_rate,
                panni_rate,
                potti5_rate,
                potti10_rate,
                solapur_rate
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                awak_rate,
                jawak_rate,
                dockawak_rate,
                dockjawak_rate,
                jawakwarning_rate,
                dockjawakwarning_rate,
                checkbox_rate,
                panni_rate,
                potti5_rate,
                potti10_rate,
                solapur_rate
            ]
        );

        return res.status(201).json({
            success: true,
            message: "Rates added successfully",
            insertedId: result.insertId
        });

    } catch (error) {
        console.error("Error adding rate:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

module.exports = {
    addRate,
    getLatestPublicRate,
    getLatestPrivateRate,
};