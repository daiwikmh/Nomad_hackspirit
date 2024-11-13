const express = require("express");
const User = require('../models/users')

const router = express.Router();

router.post("/add-user", async (req, res) => {
    const { userId, name, email } = req.body;
    try {
        let user = await User.findOne({ email });

        if (!user) {
            user = new User({ userId, name, email });
            await user.save();
        }
        res.json(user);
    } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).json({ error: "Failed to add user" });
    }
});

module.exports = router;
