const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken')

async function authMiddleware(req,res,next) {
	const {token} = req.cookies;

	if(!token){
		return res.status(401).json({
			message:"invalid request."
		})
	}

	    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Corrected line: Use the ID from the decoded payload to find the user
        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                message: "User not found."
            });
        }
        req.user = user;
        next();
    } catch (err) {
        // Log the error for debugging purposes
        console.error('JWT verification error:', err);
        res.status(400).json({
            message: "Something broke."
        });
     }

}

module.exports = authMiddleware;