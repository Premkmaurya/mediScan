const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
	user:{
		type:mongoose.Schema.Types.ObjectId,
		ref:"user"
	},
	content:{
		type:String,
		required:true
	},
	role:{
        type:String,
        enum:["user","model","system"],
        ref:"user"
	}
},{
	timestamps:true
})

const messageModel = mongoose.model('message',messageSchema);

module.exports = messageModel;