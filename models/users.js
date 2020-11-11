const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const bcrypt = require('bcrypt');
const config = require('../config');

/*
 * Collection Name: users
 */
const userSchema = new Schema({
    name            :  { type: String, required: true },
    email           :  { type: String, required: true },
    phone           :  { type: String, default: null },
    image           :  { type: String, default: null },
    socialId        :  { type: String, required: true },
    deviceId        :  { type: String, required: true },
    referrerUserId  :  { type: ObjectId, ref: 'user', default: null},
    isPremiumUser   :  { type: Boolean, default: false },
    isAdsFreeUser   :  { type: Boolean, default: false },
    FuelPoints      :  { type: Number, default: 0 },
    pointsEarned    :  { type: Number, default: 0 },
    pointsSpent     :  { type: Number, default: 0 },
    referralsMade   :  { type: Number, default: 0 },
    viewsGained     :  { type: Number, default: 0 },
    isDeleted       :  { type: Boolean, default: false }
},
{
    timestamps: true
});

module.exports = mongoose.model("user" , userSchema, "users");
