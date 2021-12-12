const mongoose = require("mongoose");
const User = require("./user");
const commentSchema = require("./comment");
const videoSchema = require("./video");

const profileSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    owner: {
      // to create a reference, the type should be Object
      type: mongoose.Schema.Types.ObjectId,
      // ref is also needed, so we can poulate the owner
      ref: "User",
      // Note: Populate means replacing the owner id with the person document...
      required: true,
    },
    comments: [commentSchema],
    videos: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Videos",
      required: true,
    }],
  },
  {
    timestamps: true
  }
);

const Profile = mongoose.model("Profile", profileSchema);

// exporting module and aliasing
module.exports = Profile


// followers: [{type: mongoose.Schema.ObjectId, ref: 'User'}]
// mechanism of attachment:
// - push?
// mechanism of removal:
// - pull?

// following: [{type: mongoose.Schema.ObjectId, ref: 'User'}]
// mechanism of attachment:
// - push?
// mechanism of removal:
// - pull?

