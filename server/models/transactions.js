// models/Transaction.js
const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
    amount: { type: Number, required: true },
    approvals: [
        {
            email: { type: String, required: true },
            approved: { type: Boolean, default: false }
        }
    ],
    status: { type: String, default: 'pending' }  // can be 'pending' or 'approved'
});

module.exports = mongoose.model("Transaction", transactionSchema);
