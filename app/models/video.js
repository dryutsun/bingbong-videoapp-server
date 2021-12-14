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

module.exports = Video


// const test = new Video({
//   url: "https://youtu.be/4hMpYTkjh4s",
//   externalUrl: "https://youtu.be/4hMpYTkjh4s",
//   title: "Lorenzo Senni - Canone Infinito",
//   owner: "61b4e7e40bef58034e60c584",
//   thumbnail: "",
//   duration: "0459",
//   categoryName: "Music",
//   comments: [],
// });

// Video.once("connected", function (err) {
//   if (err) {
//     return console.error(err);
//   }
//   Video.create(test, function (err, doc) {
//     if (err) {
//       return console.error(err);
//     }
//     console.log(doc);
//     return db.close();
//   });
// });
