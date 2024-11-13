const express = require("express");
const Group = require("../models/group");
const Transaction = require("../models/transactions");

const router = express.Router();


router.post("/create-group", async (req, res) => {
    const { name, description, members } = req.body;

    const group = new Group({
        name,
        description,
        members: members.map(email => ({ email, pooledAmount: 0 })),
        totalPool: 0,
    });

    await group.save();

    res.json(group);
});

router.post("/add-to-pool/:groupId", async (req, res) => {
    const { groupId } = req.params;
    const { userId, amount } = req.body;

    const group = await Group.findById(groupId);
    group.totalPool += amount;
    group.members.find(member => member.user.equals(userId)).pooledAmount += amount;
    await group.save();

    res.json(group);
});

router.get('/show-groups', async (req, res) => {
    const userEmail = req.query.email; 
    try {
        const groups = await Group.find({
            members: { $elemMatch: { email: userEmail } }
        });
        res.status(200).json(groups);
    } catch (error) {
        console.error('Error fetching groups:', error);
        res.status(500).json({ message: 'Error fetching groups' });
    }
});

router.post("/request-payment/:groupId", async (req, res) => {
    const { groupId } = req.params;
    const { amount } = req.body;

    const group = await Group.findById(groupId);
    if (group.totalPool < amount) return res.status(400).json({ error: "Insufficient pool funds" });

    const transaction = new Transaction({
        groupId,
        amount,
        approvals: group.members.map(member => ({ userId: member.user, approved: false })),
        status: "pending",
    });
    await transaction.save();

    res.json(transaction);
});


router.post("/approve-payment/:transactionId", async (req, res) => {
    const { transactionId } = req.params;
    const { userId } = req.body;

    const transaction = await Transaction.findById(transactionId);
    const approval = transaction.approvals.find(app => app.userId.equals(userId));

    if (!approval) return res.status(404).json({ error: "User not in approval list" });
    approval.approved = true;

    if (transaction.approvals.every(app => app.approved)) {
        transaction.status = "approved";
        const group = await Group.findById(transaction.groupId);
        group.totalPool -= transaction.amount;
        await group.save();
    }

    await transaction.save();
    res.json(transaction);
});

module.exports = router;
