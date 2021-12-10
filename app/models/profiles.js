const mongoose = require('mongoose')

const profileSchema= new mongoose.Schema(
	{
		userName: {
			type: String,
			required: true,
			unique: true,
		},
		videos: {

        },
        owner: {
            // to create a reference, the type should be Object
            type: mongoose.Schema.Types.ObjectId,
            // ref is also needed, so we can poulate the owner
            ref: 'User',
            // Note: Populate means replacing the owner id with the person document...
            required: true,
        },
        comments: [commentSchema],
        videos: [videoSchema]
	},
	{
		timestamps: true,
		toObject: {
			// remove `hashedPassword` field when we call `.toObject`
			transform: (_doc, user) => {
				delete user.hashedPassword
				return user
			},
		},
	}
)

module.exports = mongoose.model('User', userSchema)
