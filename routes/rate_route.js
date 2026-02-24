const express = require('express');
const router = express.Router();

const {  
    addRate,
    getLatestPublicRate,
    getLatestPrivateRate,
} = require('../controller/rate_controller.js');

router.post('/add-rate', addRate);
router.get('/get-latest-public-rate', getLatestPublicRate);
router.get('/get-latest-private-rate', getLatestPrivateRate);

module.exports = router;