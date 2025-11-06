const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
	user:{
        // This links the message to the specific user in the 'user' collection
		type:mongoose.Schema.Types.ObjectId,
		ref:"user" // References the 'user' model
	},
	content:{
        // The text content of the message (or a description/placeholder for a file)
		type:String,
		required:true
	},
	role:{
        // Defines who sent the message: 'user' or 'model' (AI response)
        type:String,
        enum:["user","model","system"], // Restricts values to these three options
	}
},{
	timestamps:true // Automatically adds 'createdAt' and 'updatedAt' fields
})

const messageModel = mongoose.model('message',messageSchema);

module.exports = messageModel;