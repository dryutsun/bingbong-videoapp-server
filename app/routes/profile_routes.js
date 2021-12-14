// Express docs: http://expressjs.com/en/api.html
const express = require("express");
// Passport docs: http://www.passportjs.org/docs/
const passport = require("passport");

// pull in Mongoose model for examples


const User = require("../models/user");
const Profile = require("../models/profiles");
const Comment = require("../models/comment");
const Video = require("../models/video")

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require("../../lib/custom_errors");

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404;
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership;

// this is middleware that will remove blank fields from `req.body`, e.g.
// { example: { title: '', text: 'foo' } } -> { example: { text: 'foo' } }
const removeBlanks = require("../../lib/remove_blank_fields");
const remove_blank_fields = require("../../lib/remove_blank_fields");
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate("bearer", { session: false });

// instantiate a router (mini app that only handles routes)
const router = express.Router();

router.get("/users", (req, res, next) => {
  Profile.find()
    .then((profile) => res.status(200).json({ profile : profile }))
    .catch(next)
});


// USER GET DETAIL
// 200 RETURN BUT NOT GETTING CONTENT ONLY ID
// IS THIS BECAUSE OF NULL FIELDS?

router.get("/users/:id", requireToken, (req, res, next) => {
  Profile.findById(req.params.id)
    .then((profile)=> res.status(200).json({ profile : profile.toObject() }))
    .catch((next)) 
    // .populate('following', ['username', '_id'])
})

// router.get("/users/:userid", (req, res, next) => {
//   let user
//   Profile.create()
// ! PROFILE CREATE, WILL REQUIRE USER TO BE LOGGED IN
router.post('/users',  requireToken, (req,res,next) => {
  // This will need to be tied to the current logged in user eventually.
  Profile.create(req.body.profile)
    .then((profile) => { res.status(201).json({ profile: profile.toObject() })
    })
    .catch(next)
})

// UPDATE
// ! WORKING
router.patch('/users/:id', removeBlanks, (req,res,next) => {
  Profile.findById(req.params.id)
    .then(handle404)
    .then((profile) => {

      return profile.updateOne(req.body.profile)
    })
    .then(() => {res.sendStatus(204)})
    .catch(next)
})

// DELETE
// WORKING? WILL HAVE TO TEST WITH TWO PROFILES IN DB
router.delete('/users/:id',  requireToken, (req, res, next) => {
  Profile.findById(req.params.id)
    .then(handle404)
    .then((profile) => {
      profile.deleteOne()
    })
    .then(() => res.sendStatus(404))
    .catch(next)
})



// })

// USERS DETAIL

// router.get("/users/:userid", () => {
//   console.log("Hello");
// });

module.exports = router

