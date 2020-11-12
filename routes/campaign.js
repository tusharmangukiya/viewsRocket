// Router Instance
const router = require('express').Router();

const passport = require('passport');
const jwt = require('jsonwebtoken');
const Joi = require('@hapi/joi');
const { getSuccessResponse, getErrorResponse, isValidId, authCheck, removeFields } = require('../utils/helper');
const { secretKeys } = require('../config');
const { validIdPattern, youTubeURLPattern } = require("../common");

// Models Import
const CAMPAIGN = require('../models/campaign');
const USER = require('../models/users');

/**
 * To get all active campaign
 */
router.get('/active', authCheck, (req, res, next) => {
	CAMPAIGN
		.find({status: true})
		.then(data => res.json(getSuccessResponse(data)))
		.catch(err => res.status(500).json(getErrorResponse("Something went wrong while get campaigns")));
});

/**
 * To get all InActive campaign
 */
router.get('/inactive', authCheck, (req, res, next) => {
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
		.findById(campaignId)
		.then(data => res.json(getSuccessResponse(data)))
		.catch(err => res.status(500).json(getErrorResponse("Something went wrong while users campaign")));
});

/**
 * Api for add new campaign
 */
router.post('/', authCheck,  async (req, res, next) => {
  const validationSchema = Joi.object(
    {
      videoURL: Joi.string().pattern(new RegExp(youTubeURLPattern)).required(),
      videoId: Joi.string().required(),
      desiredViewcount: Joi.number().required(), 
      desiredViewduration: Joi.number().required(),
      cost: Joi.number().equal(req.body.desiredViewcount*req.body.desiredViewduration).required()
  });
  var validation = validationSchema.validate(req.body);
  if (validation.error)
    return res.status(422).json(getErrorResponse(validation.error.details[0].message));

    // Check whether the URL is validated or not (create separate table to mantain URL validation recoord)
    // If everything goes well then only create new campaign otherwise return error

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

/**
 * Api for stop campaign
 */
router.put('/:campaignId', authCheck, async (req, res, next) => {
  var campaignId =  req.params.campaignId;
	if(!isValidId(campaignId)){
		return res.status(404).json(getErrorResponse("Invalid Campaign ID"));
  }
  
  var campaign = await CAMPAIGN.findOne({_id: campaignId, isCompleted: false, status: true}).populate('user');
  if(campaign){
    if(campaign.user._id.toString() == req.user._id) {
      return res.status(400).json(getErrorResponse("You cannot load your own video"));
    }
    if(campaign.actualViewcount >= campaign.desiredViewcount) {
      return res.status(400).json(getErrorResponse("Campaign is completed"));
    } else {
      campaign.actualViewcount += 1;
      campaign.pointSpent += campaign.desiredViewduration;
      var host = campaign.user;
      host.pointsSpent += campaign.desiredViewduration;
      host.viewsGained += 1;
      host.save();
      campaign.save(async (err, data) => {
        if(err) {
          console.log("ERROR OCCURED :\n",err);
          return res.status(500).json(getErrorResponse("Something went wrong while updating campaign"));
        }
        var viewer = await USER.findOne({_id: req.user._id, isDeleted: false});
        if(viewer) {
          viewer.FuelPoints += data.desiredViewduration;
          viewer.pointsEarned += data.desiredViewduration;
          viewer.save();
        }
        return res.json(getSuccessResponse("Campaign updated successfully"))
      });
    }
  } else {
    return res.status(404).json(getErrorResponse("No record where found by this id"));
  }
});
module.exports = router;