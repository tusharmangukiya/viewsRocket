// Router Instance
const router = require('express').Router();

const passport = require('passport');
const jwt = require('jsonwebtoken');
const Joi = require('@hapi/joi');
const { getSuccessResponse, getErrorResponse, authCheck, removeFields } = require('../../utils/helper');
const { secretKeys } = require('../../config');
const common = require("../../common");

// Models Import
const USER = require('../../models/users');

router.get('/', function (req, res, next) {
  console.log("==========docs");
  res.redirect("/api-docs");
});

/**
 * Social login
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
    var user = new USER(payload);
    user
      .save()
      .then(data => {
        const body = { _id : data._id, email : data.email };
        const token = jwt.sign({ user : body }, secretKeys.passport);
        res.json({user: data, token: token})
      })
      .catch(err => res.status(500).json(getErrorResponse(err.message ? err.message : "Something went wrong while inserting new user")));
  } else {
    const body = { _id : socialUser._id, email : socialUser.email };
    const token = jwt.sign({ user : body }, secretKeys.passport);
    res.json({user: socialUser, token: token})
  }
});

module.exports = router;