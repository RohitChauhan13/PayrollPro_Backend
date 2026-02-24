const express = require('express');
const router = express.Router();

const { 
    keepAlive 
} = require('../controller/test_controller.js');

router.get('/keep-alive', keepAlive);

module.exports = router;