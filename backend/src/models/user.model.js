const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true // Name is required to create a user.
    },
    email:{
        type:String,
        require:true,
        unique:true // CRITICAL: Ensures no two users can have the same email.
    },
    password:{
        type:String,
        // We don't set 'require:true' here because it might be handled 
        // during registration, but we expect it.
    }
},{timestamp:true}) // ⬅️ Automatically adds 'createdAt' and 'updatedAt' fields

const userModel = new mongoose.model("user",userSchema)

module.exports = userModel;