// Router Instance
const router = require('express').Router();
const Joi = require('@hapi/joi');
const { getSuccessResponse, getErrorResponse, isValidId, authCheck, removeFields } = require('../utils/helper');

// Models Import
const FEEDBACK = require('../models/feedback');

/**
 * To get all feedbacks
 */
router.get('/', authCheck, (req, res, next) => {
	FEEDBACK
        .find()
        .populate('user', 'name')
		.then(data => res.json(getSuccessResponse(data)))
		.catch(err => res.status(500).json(getErrorResponse("Something went wrong while fetching feedbacks")));
});

/**
 * APi for add new feedback
 */
router.post('/', authCheck, (req, res, next) => {
    const validationSchema = Joi.object(
    {
        feedbackType: Joi.string().required(),
        message: Joi.string().required()
    });
    var validation = validationSchema.validate(req.body);
    if (validation.error)
        return res.status(422).json(getErrorResponse(validation.error.details[0].message));
    var payload = validation.value;
    payload.user = req.user._id;
    var feedback = new FEEDBACK(payload);
    feedback
        .save()
        .then(data => res.json(getSuccessResponse(data)))
        .catch(err => res.status(500).json(getErrorResponse(err.message ? err.message : "Something went wrong while inserting new transaction")));
});

module.exports = router;