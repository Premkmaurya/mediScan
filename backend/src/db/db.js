const mongoose = require("mongoose")

async function connectDb(){
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("db connected.")
    } catch (error) {
        console.log("db is not connected.")
    }
}

module.exports = connectDb;