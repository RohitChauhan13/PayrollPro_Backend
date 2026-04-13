const express = require('express');
const router = express.Router();

const {
    addAttendance,
    getAttendance,
    updateAttendance,
    getAttendanceByDateRange,
    getThisWeekAttendance
} = require('../controller/attendance_controller.js');

router.post('/add-attendance', addAttendance);
router.post('/get-attendance', getAttendance);
router.put('/update-attendance', updateAttendance);
router.get("/attendance-range", getAttendanceByDateRange);
router.get("/attendance-this-week", getThisWeekAttendance);

module.exports = router;