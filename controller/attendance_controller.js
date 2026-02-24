const pool = require('../config/connect.js');

const addAttendance = async (req, res) => {
    try {
        const { attendance_date, attendance } = req.body;

        if (!attendance_date || !Array.isArray(attendance) || attendance.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid data"
            });
        }

        const values = attendance.map(item => [
            attendance_date,
            item.employee_id,
            item.employee_name,
            item.status
        ]);

        const sql = `
            INSERT INTO attendance (attendance_date, employee_id,  employee_name, status)
            VALUES ?
        `;

        await pool.query(sql, [values]);

        return res.status(201).json({
            success: true,
            message: "Attendance added successfully"
        });

    } catch (error) {

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                success: false,
                message: "Attendance already exists for this date"
            });
        }

        console.error("Error adding attendance:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const getAttendance = async (req, res) => {
    try {
        const { attendance_date } = req.body;

        if (!attendance_date) {
            return res.status(400).json({
                success: false,
                message: 'Date is required'
            });
        }

        const [result] = await pool.query('SELECT * FROM attendance WHERE attendance_date = ?', [attendance_date]);

        if (result.length > 0) {
            res.status(200).json({
                success: true,
                count: result.length,
                data: result
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'No attendance data found for this date'
            });
        }

    } catch (error) {
        console.error("Error adding attendance:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

const updateAttendance = async (req, res) => {
    try {
        const { attendance_date, attendance } = req.body;

        if (!attendance_date || !Array.isArray(attendance) || attendance.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid data"
            });
        }

        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {

            for (const item of attendance) {

                if (![0, 1].includes(Number(item.status))) {
                    throw new Error("Invalid status value");
                }

                await connection.query(
                    `UPDATE attendance 
                     SET status = ? 
                     WHERE attendance_date = ? 
                     AND employee_id = ?`,
                    [item.status, attendance_date, item.employee_id]
                );
            }

            await connection.commit();
            connection.release();

            return res.status(200).json({
                success: true,
                message: "Attendance updated successfully"
            });

        } catch (err) {
            await connection.rollback();
            connection.release();
            throw err;
        }

    } catch (error) {

        console.error("Update Attendance Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};

module.exports = {
    addAttendance,
    getAttendance,
    updateAttendance
}