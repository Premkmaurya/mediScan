const userModel = require('../models/user.model')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

// 🔒 Middleware to protect routes: Verifies JWT from cookie and attaches user to request



// 📝 Controller for /register route
async function registerUser(req,res) {
    const {name,email,password} = req.body;

    const isUserExist = await userModel.findOne({email })
    if (isUserExist) {
        return res.status(403).json({
            message:"User already registered."
        })
    }
    // Hash the password for security
    const hash = await bcrypt.hash(password,10);

    const user = await userModel.create({
        name,
        email,
        password:hash
    })

    // Generate JWT (Token is created using user's ID and JWT_SECRET)
    const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
    
    // Send token as a secure cookie
    res.cookie("token",token, {
        httpOnly: true, // Prevents client-side JS from accessing the cookie
        secure: process.env.NODE_ENV === 'production', // Use secure in production
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days expiration
    })
    
    return res.status(201).json({
        message:"User created successfully.",
        name:user.name,
        email:user.email
    })
}


// 📝 Controller for /login route
async function loginUser(req,res) {
    const {email,password} = req.body;

    const user = await userModel.findOne({email});
    if(!user){
        return res.status(401).json({
            message:"User not registered yet."
        })
    }

    // Compare the plain text password with the hashed password in the DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({
            message: "Invalid email or password."
        });
    }
    
    const token = jwt.sign({id:user._id},process.env.JWT_SECRET)

    res.cookie("token",token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return res.status(200).json({
        message:"User logged in.",
        email:user.email
    })
}


// 📝 Controller for /me route (Requires 'protect' middleware)
async function getMe(req, res) {
    // User data is available in req.user, populated by the protect middleware
    res.status(200).json({
        message: "User profile retrieved.",
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
        }
    });
}

module.exports = {
    registerUser,
    loginUser,
    getMe,
}