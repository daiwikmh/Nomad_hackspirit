const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
    name: String,
    members: [
        {
            email: String,
            pooledAmount: { type: Number, default: 0 }
        }
    ],
    description: String,
    totalPool: { type: Number, default: 0 },
});

module.exports = mongoose.model("Group", groupSchema);
