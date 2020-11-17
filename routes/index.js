var express = require('express');
var router = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
const { swageerOptions } = require("../config");

/**
 * ROUTES
 */
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swageerOptions));
router.use('/', require('./auth'));
router.use('/campaign', require('./campaign'));
router.use('/transaction', require('./transactions'));
router.use('/feedback', require('./feedbacks'));

module.exports = router;
