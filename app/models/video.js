const mongoose = require("mongoose");
const User = require("./user");
const commentSchema = require('./comment')


const videoSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    unique: true,
  },
  externalUrl: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  thumbnail: {
    type: String,
  },
  duration: {
    type: String,
  },
  categoryName: {
    type: String,
  }, // maybe needs its own schema
  comments: [commentSchema],
});

const Video = mongoose.model("Video", videoSchema);

module.exports = Video;
