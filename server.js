const express = require('express');
require('dotenv').config();

const testRoutes = require('./routes/test_route.js');
const employeeRoutes = require('./routes/employee_route.js');
const workRoutes = require('./routes/work_route.js');
const rateRoutes = require('./routes/rate_route.js');
const attendanceRoutes = require('./routes/attendance_route.js');
const salaryRoutes = require('./routes/salary_route.js');
const commissionRoutes = require('./routes/commission_route.js');

const app = express();

app.use(express.json());

app.use('/api', testRoutes);
app.use('/api', employeeRoutes);
app.use('/api', workRoutes);
app.use('/api', rateRoutes);
app.use('/api', attendanceRoutes);
app.use('/api', salaryRoutes);
app.use('/api', commissionRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});