const pool = require('../config/connect.js');

const getAllEmployees = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                id,
                name,
                DATE_FORMAT(dob, '%d-%m-%Y') AS dob,
                mobile,
                address,
                status,
                created_at,
                updated_at
            FROM employees
            ORDER BY id DESC
        `);

        res.status(200).json({
            success: true,
            count: rows.length,
            data: rows
        });

    } catch (error) {
        console.error("Error fetching employees:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const getEmployeeById = async (req, res) => {
    const { employee_id } = req.params;

    if (!employee_id || isNaN(employee_id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid employee ID"
        });
    }

    try {
        const [rows] = await pool.query(
            `SELECT 
                id,
                name,
                DATE_FORMAT(dob, '%d-%m-%Y') AS dob,
                mobile,
                address,
                status,
                created_at,
                updated_at
             FROM employees
             WHERE id = ?`,
            [employee_id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: rows[0]   
        });

    } catch (error) {
        console.error("Error fetching employee:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const addEmployee = async (req, res) => {
    try {
        const {
            name,
            mobile,
            address,
            dob,
        } = req.body;

        if (!name || !mobile || !address || !dob) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const [result] = await pool.query(
            `INSERT INTO employees (name,dob,mobile,address) VALUES 
            (?, ?, ?, ?)
            `,
            [name, dob, mobile, address]
        )

        return res.status(201).json({
            success: true,
            message: 'Employee added successfully!',
            insertId: result.insertId
        })

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                success: false,
                message: "Employee already exists with this mobile number"
            });
        }

        console.log("Error in addEmployee: ", error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

const updateEmployee = async (req, res) => {
    try {
        const { id, address, status } = req.body;

        if (!id || !address) {
            return res.status(400).json({
                message: "All fields required",
            });
        }

        await pool.query(
            `UPDATE employees 
             SET address = ?, status = ?
             WHERE id = ?`,
            [address, status, id]
        );

        res.json({ message: "Employee updated successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    getAllEmployees,
    addEmployee,
    updateEmployee,
    getEmployeeById
};