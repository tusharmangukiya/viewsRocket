// Router Instance
const router = require('express').Router();

const passport = require('passport');
const jwt = require('jsonwebtoken');
const Joi = require('@hapi/joi');
const { getSuccessResponse, getErrorResponse, isValidId, authCheck, removeFields } = require('../utils/helper');
const { secretKeys } = require('../config');
const { validIdPattern } = require("../common");

// Models Import
const CAMPAIGN = require('../models/campaign');

/**
 * To get all active campaign
 */
router.get('/', authCheck, (req, res, next) => {
	CAMPAIGN
		.find({status: true})
		.then(data => res.json(getSuccessResponse(data)))
		.catch(err => res.status(500).json(getErrorResponse("Something went wrong while get campaigns")));
});

/**
 * To get all InActive campaign
 */
router.get('/', authCheck, (req, res, next) => {
	CAMPAIGN
		.find({status: false})
		.then(data => res.json(getSuccessResponse(data)))
		.catch(err => res.status(500).json(getErrorResponse("Something went wrong while get campaigns")));
});

/**
 * To get particular campaign
 */
router.get('/:campaignId', authCheck, (req, res, next) => {
	var campaignId =  req.params.campaignId;
	if(!isValidId(req.params.campaignId)){
		return res.status(404).json(getErrorResponse("No record where found by this id"));
	}
	CAMPAIGN
		.find({ _id: campaignId, status: false})
		.then(data => res.json(getSuccessResponse(data)))
		.catch(err => res.status(500).json(getErrorResponse("Something went wrong while users campaign")));
});

/**
 * Api for add new campaign
 */
router.post('/', authCheck,  async (req, res, next) => {
  const validationSchema = Joi.object(
    {
      videoURL: Joi.string().optional().allow("").allow(null),
      videoId: Joi.string().optional().allow("").allow(null),
      desiredViewcount: Joi.number().optional().allow("").allow(null), 
      desiredViewduration: Joi.number().optional().allow("").allow(null),
      cost: Joi.number().optional().allow("").allow(null),
  });
  var validation = validationSchema.validate(req.body);
  if (validation.error)
    return res.status(422).json(getErrorResponse(validation.error.details[0].message));

  var payload = validation.value;
  payload.user = req.user._id;
  var campaign = new CAMPAIGN(payload);
  campaign
      .save()
      .then(data => {
        return res.json(getSuccessResponse(data))
      })
      .catch(err => res.status(500).json(getErrorResponse(err.message ? err.message : "Something went wrong while inserting new campaign")));
});

/**
 * Api for stop campaign
 */
router.post('/stopCampaign', authCheck,  async (req, res, next) => {
    var campaignId = req.body.campaignId;
	if (!isValidId(campaignId)) return res.status(422).json(getErrorResponse("Invalid campaign id given"));

	CAMPAIGN.updateOne({ _id: campaignId }, { status: false })
    .then(data => res.json(getSuccessResponse("campaign stoped successfully")) )
    .catch(err => res.status(500).json(getErrorResponse("Something went wrong while stop campaign")));
});

module.exports = router;