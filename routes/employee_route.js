const express = require('express');
const router = express.Router();

const { 
    getAllEmployees, 
    addEmployee,
    updateEmployee,
} = require('../controller/employee_controller.js');

router.get('/employees', getAllEmployees);
router.post('/add-employee', addEmployee);
router.put('/update-employee', updateEmployee);

module.exports = router;