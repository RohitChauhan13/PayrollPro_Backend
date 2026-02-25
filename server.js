const express = require('express');
require('dotenv').config({ quiet: true });
const authMiddleware = require('./middlewares/authMiddleware.js');

const testRoutes = require('./routes/test_route.js');
const employeeRoutes = require('./routes/employee_route.js');
const workRoutes = require('./routes/work_route.js');
const rateRoutes = require('./routes/rate_route.js');
const attendanceRoutes = require('./routes/attendance_route.js');
const salaryRoutes = require('./routes/salary_route.js');
const commissionRoutes = require('./routes/commission_route.js');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    const start = Date.now();

    res.on("finish", () => {
        const duration = Date.now() - start;
        const now = new Date();

        // const time = now.toLocaleString("en-IN", {
        //     timeZone: "Asia/Kolkata",
        // });

        console.log(
            `${req.method} ${req.originalUrl} [${res.statusCode}] - ${duration}ms`
        );
        console.log();
    });

    next();
});

app.use('/api', testRoutes);
app.use('/api', authMiddleware, employeeRoutes);
app.use('/api', authMiddleware, workRoutes);
app.use('/api', authMiddleware, rateRoutes);
app.use('/api', authMiddleware, attendanceRoutes);
app.use('/api', authMiddleware, salaryRoutes);
app.use('/api', authMiddleware, commissionRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log();
    console.log('----------------------------------------------');
    console.log(`Server running fine...`);
    console.log();
});