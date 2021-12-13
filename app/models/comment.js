const mongoose = require("mongoose");


const commentSchema = new mongoose.Schema(
  {
    postedBy: {
      // to create a reference, the type should be Object
      type: mongoose.Schema.Types.ObjectId,
      // ref is also needed, so we can poulate the owner
      ref: "User"
      // Note: Populate means replacing the owner id with the person document...

    },
    commentText: {
      type: String,
      required: true
    },
    thumbnail: String, // Maybe better to pull it from the owner
  },
  {
    timestamps: true
  }
);

module.exports= commentSchema;

