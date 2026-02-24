const pool = require("../config/connect.js");

const calculateSalary = async (req, res) => {
    const { date } = req.body;

    if (!date) {
        return res.status(400).json({
            status: false,
            message: "Date required",
        });
    }

    try {

        const [salaryCheck] = await pool.query(
            `SELECT COUNT(*) as count 
       FROM salary 
       WHERE salary_date = ?`,
            [date]
        );

        if (salaryCheck[0].count > 0) {
            return res.status(200).json({
                status: false,
                message: "Salary already calculated for this date",
            });
        }

        const [attendanceCheck] = await pool.query(
            `SELECT COUNT(*) as count 
       FROM attendance 
       WHERE attendance_date = ?`,
            [date]
        );

        if (attendanceCheck[0].count === 0) {
            return res.status(400).json({
                status: false,
                message: "Attendance not available for this date",
            });
        }

        const [workRows] = await pool.query(
            `SELECT * FROM work WHERE work_date = ?`,
            [date]
        );

        if (workRows.length === 0) {
            return res.status(400).json({
                status: false,
                message: "No work found for this date",
            });
        }

        const work = workRows[0];

        const [attendanceRows] = await pool.query(
            `SELECT employee_id, status 
       FROM attendance 
       WHERE attendance_date = ?`,
            [date]
        );

        const presentEmployees = attendanceRows.filter(
            (emp) => emp.status === 1
        );

        const presentCount = presentEmployees.length;

        if (presentCount === 0) {
            return res.status(400).json({
                status: false,
                message: "All employees are absent",
            });
        }

        const [rateRows] = await pool.query(
            `SELECT * FROM rates 
       WHERE rate_type = 'public' 
       ORDER BY id DESC LIMIT 1`
        );

        if (rateRows.length === 0) {
            return res.status(400).json({
                status: false,
                message: "No rate found",
            });
        }

        const rate = rateRows[0];

        const totalSalary =
            work.awak * rate.awak_rate +
            work.jawak * rate.jawak_rate +
            work.dockawak * rate.dockawak_rate +
            work.dockjawak * rate.dockjawak_rate +
            work.jawakwarning * rate.jawakwarning_rate +
            work.dockjawakwarning * rate.dockjawakwarning_rate +
            work.checkbox * rate.checkbox_rate +
            work.panni * rate.panni_rate +
            work.potti5 * rate.potti5_rate +
            work.potti10 * rate.potti10_rate +
            work.solapur * rate.solapur_rate +
            work.other * work.other_rate;

        const perEmployeeSalary = Math.floor(totalSalary / presentCount);

        const salaryValues = attendanceRows.map((emp) => [
            emp.employee_id,
            date,
            emp.status === 1 ? perEmployeeSalary : 0,
        ]);

        await pool.query(
            `INSERT INTO salary (employee_id, salary_date, salary_amount)
       VALUES ?`,
            [salaryValues]
        );

        return res.json({
            status: true,
            message: "Salary calculated successfully",
            total_salary: Number(totalSalary.toFixed(2)),
            per_employee_salary: Number(perEmployeeSalary.toFixed(2)),
            present_count: presentCount,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            message: "Server error",
            error: error.message,
        });
    }
};

const getSalaryByUserId = async (req, res) => {
    try {
        const { employee_id } = req.params;

        const [rows] = await pool.query(
            `SELECT 
          s.id,
          s.salary_date,
          s.salary_amount,
          e.id AS employee_id,
          e.name AS employee_name
       FROM salary s
       INNER JOIN employees e ON s.employee_id = e.id
       WHERE s.employee_id = ?
       ORDER BY s.salary_date DESC`,
            [employee_id]
        );

        const totalSalary = rows.reduce(
            (sum, row) => sum + Number(row.salary_amount),
            0
        );

        res.json({
            success: true,
            employee: rows.length > 0
                ? {
                    id: rows[0].employee_id,
                    name: rows[0].employee_name,
                }
                : null,
            totalSalary,
            records: rows.length,
            data: rows,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

const getSalaryBetweenDates = async (req, res) => {
    try {
        const { employee_id, start_date, end_date } = req.body;

        const [rows] = await pool.query(
            `SELECT 
          s.id,
          s.salary_date,
          s.salary_amount,
          e.id AS employee_id,
          e.name AS employee_name
       FROM salary s
       INNER JOIN employees e ON s.employee_id = e.id
       WHERE s.employee_id = ?
       AND s.salary_date BETWEEN ? AND ?
       ORDER BY s.salary_date ASC`,
            [employee_id, start_date, end_date]
        );

        const totalSalary = rows.reduce(
            (sum, row) => sum + Number(row.salary_amount),
            0
        );

        res.json({
            success: true,
            employee: rows.length > 0
                ? {
                    id: rows[0].employee_id,
                    name: rows[0].employee_name,
                }
                : null,
            totalSalary,
            records: rows.length,
            data: rows,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
};

const getSalaryByDate = async (req, res) => {
    try {
        const { employee_id, date } = req.body;

        const [rows] = await pool.query(
                `SELECT 
                    s.id,
                    s.salary_date,
                    s.salary_amount,
                    e.id AS employee_id,
                    e.name AS employee_name
                FROM salary s
                INNER JOIN employees e ON s.employee_id = e.id
                WHERE s.employee_id = ?
                AND s.salary_date = ?`,
            [employee_id, date]
        );

        res.json({
            success: true,
            data: rows,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
};

const getAllSalariesByDate = async (req, res) => {
  try {
    const { date } = req.body;
    
    const [rows] = await pool.query(`
      SELECT 
        e.id AS employee_id,
        e.name AS employee_name,
        COALESCE(s.salary_date, ?) AS salary_date,
        COALESCE(s.salary_amount, 0) AS salary_amount
      FROM employees e
      LEFT JOIN salary s ON e.id = s.employee_id AND s.salary_date = ?
    `, [date, date]);
    
    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};


const getThisWeekSalary = async (req, res) => {
    try {
        const { employee_id } = req.params;

        const today = new Date();
        const day = today.getDay(); 

        const startDate = new Date(today);
        startDate.setDate(today.getDate() - day); 
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);

        const format = (d) =>
            `${d.getFullYear()}-${(d.getMonth() + 1)
                .toString()
                .padStart(2, "0")}-${d
                    .getDate()
                    .toString()
                    .padStart(2, "0")}`;

        const start = format(startDate);
        const end = format(endDate);

        const [rows] = await pool.query(
            `SELECT 
                s.id,
                s.salary_date,
                s.salary_amount,
                e.id AS employee_id,
                e.name AS employee_name
            FROM salary s
            INNER JOIN employees e ON s.employee_id = e.id
            WHERE s.employee_id = ?
            AND s.salary_date BETWEEN ? AND ?
            ORDER BY s.salary_date ASC`,
            [employee_id, start, end]
        );

        const totalSalary = rows.reduce(
            (sum, row) => sum + Number(row.salary_amount),
            0
        );

        res.json({
            success: true,
            weekStart: start,
            weekEnd: end,
            totalSalary,
            records: rows.length,
            data: rows,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
};

module.exports = {
    calculateSalary,
    getSalaryByUserId,
    getSalaryBetweenDates,
    getSalaryByDate,
    getThisWeekSalary,
    getAllSalariesByDate,
};