// Router Instance
const router = require('express').Router();

const passport = require('passport');
const jwt = require('jsonwebtoken');
const Joi = require('@hapi/joi');
const { getSuccessResponse, getErrorResponse, authCheck, removeFields } = require('../utils/helper');
const { secretKeys } = require('../config');
const common = require("../common");

// Models Import
const USER = require('../models/users');

router.get('/', function (req, res, next) {
  console.log("==========docs");
  return res.send("OK")
});

/**
 * google login
 */
router.post('/login', async (req, res, next) => {
  const validationSchema = Joi.object(
    {
      email: Joi.string().optional().allow("").allow(null),
      phone: Joi.string().optional().allow("").allow(null),
      name: Joi.string().optional().allow("").allow(null), 
      image: Joi.string().optional().allow("").allow(null),
      socialId: Joi.string().optional().allow("").allow(null),
      deviceId: Joi.string().optional().allow("").allow(null),
      ReferrerUserId: Joi.string().regex(common.validIdPattern).optional().allow("").allow(null)
  });

  var validation = validationSchema.validate(req.body);
  if (validation.error)
    return res.status(422).json(getErrorResponse(validation.error.details[0].message));

  var payload = validation.value;
  
  socialUser = await USER.findOne({ socialId: payload.socialId, isDeleted : false });
  
  if(!socialUser){
    console.log("=======if-------");
    payload.FuelPoints = 500;
    console.log("=====point====", payload.FuelPoints);
    var user = new USER(payload);
    user
      .save()
      .then(data => {
        const body = { _id : data._id, email : data.email };
        const token = jwt.sign({ user : body }, "SSDSJDJSBNBN");
        res.json({user: data, token: token})
      })
      .catch(err => res.status(500).json(getErrorResponse(err.message ? err.message : "Something went wrong while inserting new user")));
  } else {
    console.log("====else-----");
    const body = { _id : socialUser._id, email : socialUser.email };
    const token = jwt.sign({ user : body }, "SSDSJDJSBNBN");
    res.json({user: socialUser, token: token})
  }
});

router.get('/addCampaign', authCheck,  async (req, res, next) => {
  console.log("add  cccc");
  console.log("user---- :: ", req.user);
  return res.send("Enter---")
});


module.exports = router;