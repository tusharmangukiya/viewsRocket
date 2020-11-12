// Router Instance
const router = require('express').Router();
const Joi = require('@hapi/joi');
const { getSuccessResponse, getErrorResponse, isValidId, authCheck, removeFields } = require('../utils/helper');

// Models Import
const TRANSACTION = require('../models/transactions');
const USER = require('../models/users');

/**
 * To get all transactions
 */
router.get('/', authCheck, (req, res, next) => {
	TRANSACTION
        .find({user: req.user._id})
        .populate('user', 'name')
		.then(data => res.json(getSuccessResponse(data)))
		.catch(err => res.status(500).json(getErrorResponse("Something went wrong while fetching transactions")));
});

/**
 * APi for add new transaction
 */
router.post('/', authCheck, (req, res, next) => {
    const validationSchema = Joi.object(
    {
        fpPurchase: Joi.number().required(),
        transactionID: Joi.string().required()
    });
    var validation = validationSchema.validate(req.body);
    if (validation.error)
        return res.status(422).json(getErrorResponse(validation.error.details[0].message));
    var payload = validation.value;
    payload.user = req.user._id;
    var transaction = new TRANSACTION(payload);
    transaction
        .save()
        .then(data => {
            USER.findOne({_id: req.user._id, isDeleted: false}).then(user => {
                user.FuelPoints += data.fpPurchase;
                user.save((err, data) => {
                    if(err) {
                        console.log("ERROR OCCURED :\n",err);
                        return res.status(500).json(getErrorResponse("Something went wrong while updating users fuel points"));
                      }
                    res.json(getSuccessResponse("Fuel Points added successfully"))
                })
            })
            .catch(err => res.status(500).json(getErrorResponse(err.message ? err.message : "Something went wrong while updating users fuel points")));
        })
        .catch(err => res.status(500).json(getErrorResponse(err.message ? err.message : "Something went wrong while inserting new transaction")));
});

module.exports = router;