const jwt = require("jsonwebtoken")
const userModel = require("../models/user.model")

async function protect(req, res, next) {
    let token;

    // ELI5: Check if the 'token' cookie exists (cookie-parser handles the parsing)
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).json({
            message: "Not authorized, login is required."
        });
    }

    try {
        // Verify token against the secret key (from .env)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user object to the request (excluding the password field)
        req.user = await userModel.findById(decoded.id).select('-password');
        
        if (!req.user) {
            return res.status(401).json({
                message: "User associated with token not found."
            });
        }
        
        next(); // Authorization successful, proceed to controller logic
    } catch (error) {
        console.error("❌ JWT Verification Error:", error);
        return res.status(401).json({
            message: "Not authorized, token failed or expired."
        });
    }
}

module.exports = protect;