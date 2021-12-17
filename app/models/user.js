const mongoose = require("mongoose");

// Do Profiles have User or does user have profile?


const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    hashedPassword: {
      type: String,
      required: true,
    },
    videos: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile"
    }],
    token: String,
  },
  {
    timestamps: true
  }
);


const User = mongoose.model("User", userSchema);

module.exports = User