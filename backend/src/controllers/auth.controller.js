const userModel = require('../models/user.model')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

async function registerUser(req,res) {
    const {name,email,password} = req.body;

    const isUserExist = await userModel.findOne({email })
    if (isUserExist) {
        return res.status(403).json({
            message:"user register already."
        })
    }
    const hash = await bcrypt.hash(password,10);

    const user = await userModel.create({
        name,
        email,
        password:hash
    })

    const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
    
    res.cookie("token",token)
    return res.status(200).json({
        message:"user created successfully.",
        name:user.name,
        email:user.email
    })
}

async function loginUser(req,res) {
    const {email,password} = req.body;

    const user = await userModel.findOne({email});
    if(!user){
        return res.status(401).json({
            message:"user not registered yet."
        })
    }

    const token = jwt.sign({id:user._id},process.env.JWT_SECRET)

    res.cookie("token",token)

    return res.status(200).json({
        message:"user logged in.",
        email:user.email
    })
}

async function getMe(req,res) {
    const user = userModel.findOne({_id:req.user.id})
    if (!user) {
        return res.status(400).json({
            message:"user not found"
        })
    }
    return res.status(200).json({
        user,
        message:"user found"
    })
}

module.exports = {
    registerUser,
    loginUser,
    getMe
}