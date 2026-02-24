const express = require('express');
const router = express.Router();

const {
    addAttendance,
    getAttendance,
    updateAttendance,
} = require('../controller/attendance_controller.js');

router.post('/add-attendance', addAttendance);
router.post('/get-attendance', getAttendance);
router.put('/update-attendance', updateAttendance);

module.exports = router;