var express = require('express');
var router = express.Router();

/**
 * ROUTES
 */
router.use('/', require('./auth'));
router.use('/campaign', require('./campaign'));

module.exports = router;
