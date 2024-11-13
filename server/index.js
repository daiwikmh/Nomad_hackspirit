const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv")

dotenv.config();


const groupRoutes = require("./routes/group-routes");
const userRoutes = require("./routes/user-routes")

const app = express();
app.use(cors());
app.use(bodyParser.json());
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MongoDB Connected");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });


app.use("/api", groupRoutes);
app.use("/api", userRoutes);


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
