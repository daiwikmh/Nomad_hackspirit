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

// In routes/groups.js
router.post("/add-to-pool/:groupId", async (req, res) => {
    const { groupId } = req.params;
    const { userEmail, amount } = req.body;  // Assuming user is identified by email

    try {
        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ message: "Group not found" });

        const member = group.members.find(member => member.email === userEmail);
        if (!member) return res.status(404).json({ message: "User not a member of this group" });

        group.totalPool += amount;
        member.pooledAmount += amount;

        await group.save();
        res.json(group);
    } catch (error) {
        console.error("Error adding to pool:", error);
        res.status(500).json({ message: "Error adding to pool" });
    }
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


router.get('/groups/:groupId', async (req, res) => {
    const { groupId } = req.params;

    try {
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        res.status(200).json(group);
    } catch (error) {
        console.error('Error fetching group:', error);
        res.status(500).json({ message: 'Error fetching group' });
    }
});


router.post("/request-payment/:groupId", async (req, res) => {
    const { groupId } = req.params;
    const { amount } = req.body;

    try {
        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ error: "Group not found" });

        // Check if the total pool has enough funds
        if (group.totalPool < amount) {
            return res.status(400).json({ error: "Insufficient pool funds" });
        }

        // Create a new transaction with pending approvals from all group members
        const transaction = new Transaction({
            groupId,
            amount,
            approvals: group.members.map(member => ({
                email: member.email,
                approved: false
            })),
            status: "pending"
        });

        await transaction.save();
        res.json(transaction);
    } catch (error) {
        console.error("Error requesting payment:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/approve-payment/:transactionId", async (req, res) => {
    const { transactionId } = req.params;
    const { email } = req.body;

    try {
        const transaction = await Transaction.findById(transactionId);
        if (!transaction) return res.status(404).json({ error: "Transaction not found" });

        const approval = transaction.approvals.find(app => app.email === email);
        if (!approval) return res.status(404).json({ error: "User not in approval list" });

        approval.approved = true;

        if (transaction.approvals.every(app => app.approved)) {
            transaction.status = "approved";

            const group = await Group.findById(transaction.groupId);
            if (group.totalPool < transaction.amount) {
                return res.status(400).json({ error: "Insufficient pool funds" });
            }
            group.totalPool -= transaction.amount;
            await group.save();
        }

        await transaction.save();
        res.json(transaction);
    } catch (error) {
        console.error("Error approving payment:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


router.get("/pending-transactions/:groupId", async (req, res) => {
    const { groupId } = req.params;

    try {
        const transactions = await Transaction.find({ groupId, status: "pending" });
        res.json(transactions);
    } catch (error) {
        console.error("Error fetching pending transactions:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.delete("/deny-payment/:transactionId", async (req, res) => {
    const { transactionId } = req.params;
    try {
        await Transaction.findByIdAndDelete(transactionId);
        res.status(200).json({ message: "Transaction denied and deleted" });
    } catch (error) {
        res.status(500).json({ error: "Failed to deny transaction" });
    }
});

router.get('/approved-transactions/:groupId', async (req, res) => {
    try {
        const { groupId } = req.params;
        const transactions = await Transaction.find({ groupId, status: 'approved' });
        res.status(200).json(transactions);
    } catch (error) {
        console.error("Error fetching approved transactions:", error);
        res.status(500).json({ message: "Failed to fetch approved transactions" });
    }
});


module.exports = router;
