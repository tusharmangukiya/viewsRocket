const router = require('express').Router();

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
const { swageerOptions } = require("../config");
/**
 * ROUTES
 */

 // Admin routes
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swageerOptions));


// APIs routes
router.use('/', require('./apis/auth'));

module.exports = router;
