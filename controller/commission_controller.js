const pool = require("../config/connect"); 

const addCommission = async (req, res) => {
  const { commission_date } = req.body;

  if (!commission_date) {
    return res.status(400).json({ message: "Commission date is required" });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1️⃣ Get work data for that date
    const [workRows] = await connection.query(
      "SELECT * FROM work WHERE work_date = ?",
      [commission_date]
    );

    if (workRows.length === 0) {
      throw new Error("No work found for this date");
    }

    const work = workRows[0];

    // 2️⃣ Get latest private rate
    const [rateRows] = await connection.query(
      "SELECT * FROM rates WHERE rate_type = 'private' ORDER BY id DESC LIMIT 1"
    );

    if (rateRows.length === 0) {
      throw new Error("Private rates not found");
    }

    const rate = rateRows[0];

    // 3️⃣ Get total salary paid that day
    const [salaryRows] = await connection.query(
      "SELECT IFNULL(SUM(salary_amount),0) AS totalSalary FROM salary WHERE salary_date = ?",
      [commission_date]
    );

    const payableSalary = salaryRows[0].totalSalary;

    // 4️⃣ Calculate total salary from work * rate
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

    // 5️⃣ Commission calculation
    const commissionAmount = totalSalary - payableSalary;

    // 6️⃣ Insert commission
    await connection.query(
      "INSERT INTO commission (commission_date, commission_amount) VALUES (?, ?)",
      [commission_date, commissionAmount]
    );

    await connection.commit();

    res.status(201).json({
      message: "Commission added successfully",
      data: {
        totalSalary,
        payableSalary,
        commissionAmount,
      },
    });
  } catch (error) {
    await connection.rollback();

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        message: "Commission already exists for this date",
      });
    }

    res.status(500).json({
      message: error.message,
    });
  } finally {
    connection.release();
  }
};

const getCommissionByDate = async (req, res) => {
  const { date } = req.params;

  if (!date) {
    return res.status(400).json({ message: "Date is required" });
  }

  try {
    const [rows] = await pool.query(
      "SELECT * FROM commission WHERE commission_date = ?",
      [date]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "No commission found for this date",
      });
    }

    res.status(200).json({
      data: rows[0],
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getCommissionInRange = async (req, res) => {
  const { from, to } = req.query;

  if (!from || !to) {
    return res.status(400).json({
      message: "Both from and to dates are required",
    });
  }

  if (from > to) {
    return res.status(400).json({
      message: "From date cannot be greater than To date",
    });
  }

  try {
    const [rows] = await pool.query(
      `SELECT *
       FROM commission
       WHERE commission_date BETWEEN ? AND ?
       ORDER BY commission_date ASC`,
      [from, to]
    );

    res.status(200).json({
      count: rows.length,
      totalCommission: rows.reduce(
        (sum, item) => sum + Number(item.commission_amount),
        0
      ),
      data: rows,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


module.exports = {
  addCommission,
  getCommissionByDate,
  getCommissionInRange,
};