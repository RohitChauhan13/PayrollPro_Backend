const express = require('express');
const router = express.Router();

const {
    getAllWork,
    getWorkByDate,
    getWorkByDateRange,
    createWork,
    updateWork,
} = require('../controller/work_controller.js');

router.get('/all-work', getAllWork);
router.get("/get-work/:work_date", getWorkByDate);
router.get("/work-range", getWorkByDateRange);
router.post('/add-work', createWork);
router.put('/update-work/:work_date', updateWork);

module.exports = router;