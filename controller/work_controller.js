const pool = require('../config/connect.js');

const getAllWork = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                id,
                work_date,
                awak,
                jawak,
                dockawak,
                dockjawak,
                jawakwarning,
                dockjawakwarning,
                checkbox,
                panni,
                potti5,
                potti10,
                solapur,
                other,
                other_rate
            FROM work
            ORDER BY work_date DESC
        `);

        res.status(200).json({
            success: true,
            count: rows.length,
            data: rows
        });

    } catch (error) {
        console.error("Error fetching work:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const getWorkByDate = async (req, res) => {
    try {
        const { work_date } = req.params;

        const [rows] = await pool.query(`
            SELECT 
                id,
                work_date,
                awak,
                jawak,
                dockawak,
                dockjawak,
                jawakwarning,
                dockjawakwarning,
                checkbox,
                panni,
                potti5,
                potti10,
                solapur,
                other,
                other_rate
            FROM work
            where work_date = ?
        `, [work_date]);

        res.status(200).json({
            success: true,
            count: rows.length,
            data: rows
        });

    } catch (error) {
        console.error("Error fetching work:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const getWorkByDateRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const [rows] = await pool.query(`
            SELECT 
                id,
                work_date,
                awak,
                jawak,
                dockawak,
                dockjawak,
                jawakwarning,
                dockjawakwarning,
                checkbox,
                panni,
                potti5,
                potti10,
                solapur,
                other,
                other_rate
            FROM work
            WHERE work_date BETWEEN ? AND ?
            ORDER BY work_date DESC
        `, [startDate, endDate]);

        res.status(200).json({
            success: true,
            count: rows.length,
            data: rows
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const createWork = async (req, res) => {
    try {
        const {
            work_date,
            awak,
            jawak,
            dockawak,
            dockjawak,
            jawakwarning,
            dockjawakwarning,
            checkbox,
            panni,
            potti5,
            potti10,
            solapur,
            other,
            other_rate
        } = req.body;

        const [result] = await pool.query(
            `INSERT INTO work (
                work_date, awak, jawak, dockawak, dockjawak,
                jawakwarning, dockjawakwarning, checkbox,
                panni, potti5, potti10, solapur, other, other_rate
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                work_date,
                awak || 0,
                jawak || 0,
                dockawak || 0,
                dockjawak || 0,
                jawakwarning || 0,
                dockjawakwarning || 0,
                checkbox || 0,
                panni || 0,
                potti5 || 0,
                potti10 || 0,
                solapur || 0,
                other || 0,
                other_rate || 0,
            ]
        );

        res.status(201).json({
            success: true,
            message: "Work record created",
            insertId: result.insertId
        });

    } catch (error) {

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                success: false,
                message: "Work already exists for this date"
            });
        }

        console.error("Error creating work:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const updateWork = async (req, res) => {
    try {
        const { work_date } = req.params;

        const {
            awak,
            jawak,
            dockawak,
            dockjawak,
            jawakwarning,
            dockjawakwarning,
            checkbox,
            panni,
            potti5,
            potti10,
            solapur,
            other,
            other_rate
        } = req.body;

        const [result] = await pool.query(
            `UPDATE work SET
                awak = ?,
                jawak = ?,
                dockawak = ?,
                dockjawak = ?,
                jawakwarning = ?,
                dockjawakwarning = ?,
                checkbox = ?,
                panni = ?,
                potti5 = ?,
                potti10 = ?,
                solapur = ?,
                other = ?,
                other_rate = ?
            WHERE work_date = ?`,
            [
                awak,
                jawak,
                dockawak,
                dockjawak,
                jawakwarning,
                dockjawakwarning,
                checkbox,
                panni,
                potti5,
                potti10,
                solapur,
                other,
                other_rate,
                work_date
            ]
        );

        res.status(200).json({
            success: true,
            message: "Work updated"
        });

    } catch (error) {
        console.error("Error updating work:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

module.exports = {
    getAllWork,
    getWorkByDate,
    getWorkByDateRange,
    createWork,
    updateWork,
};