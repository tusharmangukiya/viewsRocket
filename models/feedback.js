const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

/*
 * Collection Name: feedback
 */
const feedbackSchema = new Schema({
    user            :  { type: ObjectId, ref: 'user', required: true},
    feedbackType    :  { type: String, required: true },
    message         :  { type: String, required: true }, 
    isDeleted       :  { type: Boolean, default: false }
},
{
    timestamps: true
});

module.exports = mongoose.model("feedback" , feedbackSchema, "feedbacks");
