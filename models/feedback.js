const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const bcrypt = require('bcrypt');
const config = require('../config');

/*
 * Collection Name: feedback
 */
const feedbackSchema = new Schema({
    user            :  { type: ObjectId, ref: 'user', default: null},
    feedbackType    :  { type: String, default: null },
    Message         :  { type: String, default: null }, 
    isDeleted       :  { type: Boolean, default: false }
},
{
    timestamps: true
});

module.exports = mongoose.model("feedback" , feedbackSchema, "feedback");
