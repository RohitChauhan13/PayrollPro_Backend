const express = require("express");
const router = express.Router();

const {
  calculateSalary,
  getSalaryByUserId,
  getSalaryBetweenDates,
  getSalaryByDate,
  getThisWeekSalary,
  getAllSalariesByDate,
} = require("../controller/salary_controller.js");


router.post("/salary-calculate", calculateSalary);
router.get("/salary/user/:employee_id", getSalaryByUserId);
router.post("/salary/between-dates", getSalaryBetweenDates);
router.post("/salary/by-date", getSalaryByDate);
router.get("/salary/this-week/:employee_id", getThisWeekSalary);
router.post('/salary/all-by-date', getAllSalariesByDate);

module.exports = router;