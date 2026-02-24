const express = require("express");
const router = express.Router();

const { 
    addCommission,
    getCommissionByDate,
    getCommissionInRange,
} = require("../controller/commission_controller.js");

router.post("/add-commission", addCommission);
router.get("/get-commission-by-date/:date", getCommissionByDate);
router.get("/get-commission-in-range", getCommissionInRange);

module.exports = router;