const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const bcrypt = require('bcrypt');
const config = require('../config');

/*
 * Collection Name: campaign
 */
const campaignSchema = new Schema({
    user                    :  { type: ObjectId, ref: 'user', default: null},
    videoURL                :  { type: String, default: null },
    videoId                 :  { type: String, default: null },
    desiredViewcount        :  { type: Number, default: 0 },
    desiredViewduration     :  { type: Number, default: 0 },
    cost                    :  { type: Number, default: 0 },
    isCompleted             :  { type: Boolean, default: false },
    actualViewcount         :  { type: Number, default: 0 },
    pointSpent              :  { type: Number, default: 0 },
    status                  :  { type: Boolean, default: true }
},
{
    timestamps: true
});

module.exports = mongoose.model("campaign" , campaignSchema, "campaigns");
