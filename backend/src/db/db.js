const mongoose = require("mongoose");


async function connectDb() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("db connected.")
    } catch (error) {
        console.log("db not connected",error)
    }
}

module.exports = connectDb;