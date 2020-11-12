const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

/*
 * Collection Name: transaction
 */
const transactionSchema = new Schema({
    user                    :  { type: ObjectId, ref: 'user', required: true},
    fpPurchase              :  { type: Number, required: true },
    transactionID           :  { type: String, required: true }
},
{
    timestamps: true
});

module.exports = mongoose.model("transaction" , transactionSchema, "transactions");
