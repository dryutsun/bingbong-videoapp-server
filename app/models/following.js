const mongoose = require('mongoose')

const followingSchema = new mongoose.Schema(
	{
		following: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model('following', followingSchema)