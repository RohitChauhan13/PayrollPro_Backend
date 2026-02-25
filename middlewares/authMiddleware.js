const authMiddleware = (req, res, next) => {
    try {
        const appKey = req.headers['x-payroll-key'];

        if (!appKey || appKey !== process.env.APPLICATION_KEY) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }
};

module.exports = authMiddleware;