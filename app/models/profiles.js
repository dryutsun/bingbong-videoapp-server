const mongoose = require("mongoose");
const User = require("./user");
const commentSchema = require("./comment");
const Video = require("./video");
const videoSchema = require("./video")

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

    // Should we put this in User? <-- Let's ask timm about circular dependencies

    followers: {
      type: Array
    }
    // following: [{
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Profile",

    // }],
    // comments: [commentSchema],
    // videos: [{
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Profile"

    // }],
  },
  {
    timestamps: true
  }
);

const Profile = mongoose.model("Profile", profileSchema);

// exporting module and aliasing
module.exports = Profile

// We will eventually want to fill COMMENTS with Profile Information:
// .populate('owner', ['firstName', 'lastName']) <-- this is how u get it in the route it references we will want to grab the username

// at this moment, comments are referenced by their postedbyID in their Comment Schema, what we will have to do



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

