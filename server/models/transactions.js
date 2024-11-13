const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
    amount: Number,
    approvals: [{ userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, approved: Boolean }],
    status: { type: String, enum: ["pending", "approved"], default: "pending" },
});

module.exports = mongoose.model("Transaction", transactionSchema);
