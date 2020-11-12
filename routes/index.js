var express = require('express');
var router = express.Router();

/**
 * ROUTES
 */
router.use('/', require('./auth'));
router.use('/campaign', require('./campaign'));
router.use('/transaction', require('./transactions'));
router.use('/feedback', require('./feedbacks'));

module.exports = router;
